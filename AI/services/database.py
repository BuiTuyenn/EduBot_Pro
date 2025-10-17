import mysql.connector
from mysql.connector import Error
from config import Config

class DatabaseService:
    def __init__(self):
        self.connection = None
        self.connect()
    
    def connect(self):
        """Establish database connection"""
        try:
            self.connection = mysql.connector.connect(
                host=Config.DB_HOST,
                port=Config.DB_PORT,
                user=Config.DB_USER,
                password=Config.DB_PASSWORD,
                database=Config.DB_NAME,
                charset='utf8mb4',
                collation='utf8mb4_unicode_ci'
            )
            if self.connection.is_connected():
                print("[OK] Connected to MySQL database")
                return True
        except Error as e:
            print(f"[ERROR] Error connecting to MySQL: {e}")
            return False
    
    def check_connection(self):
        """Check if database connection is alive"""
        try:
            if self.connection and self.connection.is_connected():
                return True
            else:
                return self.connect()
        except:
            return False
    
    def execute_query(self, query, params=None):
        """Execute SELECT query and return results"""
        try:
            if not self.check_connection():
                self.connect()
            
            cursor = self.connection.cursor(dictionary=True)
            cursor.execute(query, params or ())
            results = cursor.fetchall()
            cursor.close()
            return results
        except Error as e:
            print(f"Error executing query: {e}")
            return []
    
    def get_truong_by_name(self, ten):
        """Get university by name (fuzzy match)"""
        query = "SELECT * FROM truong WHERE ten LIKE %s LIMIT 5"
        return self.execute_query(query, (f"%{ten}%",))
    
    def get_nganh_by_name(self, ten):
        """Get major by name (fuzzy match)"""
        query = "SELECT * FROM nganh WHERE ten LIKE %s LIMIT 5"
        return self.execute_query(query, (f"%{ten}%",))
    
    def get_diem_chuan(self, truong_id=None, nganh_id=None, nam=None):
        """Get admission scores with filters"""
        conditions = []
        params = []
        
        query = """
            SELECT dc.*, t.ten as ten_truong, n.ten as ten_nganh, n.khoi_xet_tuyen
            FROM diem_chuan dc
            JOIN truong t ON dc.id_truong = t.id
            JOIN nganh n ON dc.id_nganh = n.id
        """
        
        if truong_id:
            conditions.append("dc.id_truong = %s")
            params.append(truong_id)
        
        if nganh_id:
            conditions.append("dc.id_nganh = %s")
            params.append(nganh_id)
        
        if nam:
            conditions.append("dc.nam = %s")
            params.append(nam)
        
        if conditions:
            query += " WHERE " + " AND ".join(conditions)
        
        query += " ORDER BY dc.nam DESC LIMIT 10"
        
        return self.execute_query(query, tuple(params))
    
    def search_diem_chuan_by_text(self, truong_name=None, nganh_name=None, nam=None):
        """Search admission scores by text (names)"""
        query = """
            SELECT dc.*, t.ten as ten_truong, n.ten as ten_nganh, n.khoi_xet_tuyen
            FROM diem_chuan dc
            JOIN truong t ON dc.id_truong = t.id
            JOIN nganh n ON dc.id_nganh = n.id
            WHERE 1=1
        """
        params = []
        
        if truong_name:
            query += " AND t.ten LIKE %s"
            params.append(f"%{truong_name}%")
        
        if nganh_name:
            query += " AND n.ten LIKE %s"
            params.append(f"%{nganh_name}%")
        
        if nam:
            query += " AND dc.nam = %s"
            params.append(nam)
        
        query += " ORDER BY dc.nam DESC LIMIT 10"
        
        return self.execute_query(query, tuple(params))
    
    def get_all_truong(self):
        """Get all universities"""
        query = "SELECT * FROM truong ORDER BY ten"
        return self.execute_query(query)
    
    def get_all_nganh(self):
        """Get all majors"""
        query = "SELECT * FROM nganh ORDER BY ten"
        return self.execute_query(query)
    
    def get_truong_by_khu_vuc(self, khu_vuc):
        """Get universities by region"""
        query = "SELECT * FROM truong WHERE khu_vuc LIKE %s"
        return self.execute_query(query, (f"%{khu_vuc}%",))
    
    def close(self):
        """Close database connection"""
        if self.connection and self.connection.is_connected():
            self.connection.close()
            print("Database connection closed")

