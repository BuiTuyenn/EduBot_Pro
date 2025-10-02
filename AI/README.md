# Educational Chatbot AI Service (Flask)

Flask server tích hợp Intent Classification, Entity Recognition, MySQL và DeepSeek API.

## 🎯 Tính năng

### 1. Intent Classification (Phân loại ý định)
- `diem_chuan` - Hỏi điểm chuẩn
- `nganh_hoc` - Hỏi về ngành học
- `truong_hoc` - Hỏi về trường học
- `tu_van_huong_nghiep` - Tư vấn hướng nghiệp
- `faq` - Câu hỏi thường gặp
- `general` - Câu hỏi tự do

### 2. Entity Recognition (Nhận diện thực thể)
- Trường đại học
- Ngành học
- Năm

### 3. Tích hợp Database (MySQL)
- Truy vấn điểm chuẩn
- Lấy thông tin trường/ngành
- Cung cấp context cho AI

### 4. DeepSeek API (OpenRouter)
- Xử lý câu hỏi tự do
- Tư vấn hướng nghiệp
- Sinh phản hồi tự nhiên

## 📁 Cấu trúc Project

```
AI/
├── app.py                      # Main Flask application
├── config.py                   # Configuration
├── requirements.txt            # Python dependencies
├── .env.example               # Environment variables template
│
├── services/                   # Business logic
│   ├── __init__.py
│   ├── database.py            # MySQL connector
│   ├── deepseek_client.py     # DeepSeek API client
│   ├── intent_classifier.py   # Intent classification
│   ├── entity_recognizer.py   # Entity recognition
│   └── response_generator.py  # Response generation logic
│
├── models/                     # ML models (optional)
│   └── README.md
│
├── utils/                      # Utilities
│   ├── __init__.py
│   ├── text_processor.py      # Text processing
│   └── logger.py              # Logging
│
├── start.bat                   # Windows start script
├── start.sh                    # Linux/Mac start script
├── run.py                      # Alternative run script
└── test_api.py                # API testing script
```

## 🚀 Setup & Run

### Bước 1: Cài đặt Python Dependencies

```bash
cd AI
pip install -r requirements.txt
```

### Bước 2: Cấu hình Environment

Tạo file `.env` (copy từ `.env.example`):

```bash
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=1234
DB_NAME=edu_chatbot

# DeepSeek API
DEEPSEEK_API_KEY=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
DEEPSEEK_API_URL=https://openrouter.ai/api/v1/chat/completions
```

### Bước 3: Chạy Flask Server

**Windows:**
```bash
start.bat
```

**Linux/Mac:**
```bash
chmod +x start.sh
./start.sh
```

**Hoặc dùng Python:**
```bash
python app.py
```

Server sẽ chạy tại: `http://localhost:5000`

## 📡 API Endpoints

### 1. Health Check
**GET** `/health`

**Response:**
```json
{
  "status": "healthy",
  "service": "Educational Chatbot AI",
  "timestamp": "2024-01-01T10:00:00",
  "database": "connected"
}
```

### 2. Ask Question (Full Response)
**POST** `/ask`

**Request:**
```json
{
  "question": "Điểm chuẩn ngành CNTT Bách Khoa Hà Nội 2024?",
  "user_id": "1"
}
```

**Response:**
```json
{
  "success": true,
  "answer": "Điểm chuẩn ngành Công nghệ thông tin tại Đại học Bách khoa Hà Nội năm 2024 là 28.00 điểm.",
  "intent": "diem_chuan",
  "entities": {
    "truong": ["Bách Khoa Hà Nội"],
    "nganh": ["CNTT"],
    "nam": 2024
  },
  "sources": [...],
  "confidence": 0.9,
  "timestamp": "2024-01-01T10:00:00"
}
```

### 3. Chat (Spring Boot Compatible)
**POST** `/api/chat`

**Request:**
```json
{
  "question": "Điểm chuẩn ngành CNTT Bách Khoa Hà Nội 2024?",
  "user_id": "1"
}
```

**Response:**
```json
{
  "answer": "Điểm chuẩn ngành Công nghệ thông tin tại Đại học Bách khoa Hà Nội năm 2024 là 28.00 điểm."
}
```

## 🔄 Luồng xử lý câu hỏi

```
1. Nhận câu hỏi từ endpoint
         ↓
2. Intent Classification (Phân loại ý định)
         ↓
3. Entity Recognition (Nhận diện thực thể)
         ↓
4. Quyết định nguồn dữ liệu:
   ├── Nếu cần dữ liệu chuẩn → Query MySQL
   └── Nếu câu hỏi tự do → Gọi DeepSeek API
         ↓
5. Response Generator (Kết hợp dữ liệu + AI)
         ↓
6. Trả JSON về backend
```

## 🧪 Test API

Sử dụng script test:

```bash
python test_api.py
```

Hoặc dùng curl:

```bash
# Test health
curl http://localhost:5000/health

# Test ask
curl -X POST http://localhost:5000/ask \
  -H "Content-Type: application/json" \
  -d '{"question":"Điểm chuẩn CNTT Bách Khoa 2024?","user_id":"1"}'

# Test chat (Spring Boot endpoint)
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"question":"Điểm chuẩn CNTT Bách Khoa 2024?","user_id":"1"}'
```

## 🔌 Tích hợp với Spring Boot Backend

Spring Boot Backend sẽ gọi Flask AI qua endpoint `/api/chat`:

```java
// ChatbotService.java
RestTemplate restTemplate = new RestTemplate();
String flaskUrl = "http://localhost:5000/api/chat";

Map<String, String> request = new HashMap<>();
request.put("question", question);
request.put("user_id", userId);

ResponseEntity<Map> response = restTemplate.postForEntity(
    flaskUrl, request, Map.class
);

String answer = (String) response.getBody().get("answer");
```

## 📊 Intent Classification Rules

### Điểm chuẩn (diem_chuan)
Keywords: điểm chuẩn, điểm, chuẩn, bao nhiêu điểm, điểm đầu vào

### Ngành học (nganh_hoc)
Keywords: ngành, chuyên ngành, học gì, ngành nào, thông tin ngành

### Trường học (truong_hoc)
Keywords: trường, đại học, trường nào, thông tin trường, khu vực

### Tư vấn hướng nghiệp (tu_van_huong_nghiep)
Keywords: tư vấn, nên học, lựa chọn, hướng nghiệp, nghề nghiệp

### FAQ (faq)
Keywords: hồ sơ, thủ tục, đăng ký, xét tuyển, tuyển sinh

## 🤖 DeepSeek API Configuration

API sử dụng: **DeepSeek V3.1** qua OpenRouter

**Model:** `deepseek/deepseek-chat`

**Endpoint:** `https://openrouter.ai/api/v1/chat/completions`

**API Key:** Đã cấu hình trong `.env`

## 📝 Example Questions

### Điểm chuẩn:
- "Điểm chuẩn ngành CNTT Bách Khoa Hà Nội 2024?"
- "Cho tôi biết điểm chuẩn ngành Kinh tế năm 2023"

### Ngành học:
- "Cho tôi biết thông tin về ngành Công nghệ thông tin"
- "Ngành Kỹ thuật phần mềm học những gì?"

### Trường học:
- "Thông tin về Đại học Bách khoa Hà Nội"
- "Các trường ở TP.HCM có ngành CNTT?"

### Tư vấn:
- "Tôi nên học ngành gì nếu thích toán và máy tính?"
- "Ngành nào có triển vọng việc làm tốt?"

### FAQ:
- "Thủ tục xét tuyển đại học như thế nào?"
- "Cần chuẩn bị hồ sơ gì để đăng ký?"

## 🐛 Troubleshooting

### Database connection error
- Kiểm tra MySQL đã chạy chưa
- Kiểm tra thông tin trong `.env`
- Test connection: `python -c "from services.database import DatabaseService; DatabaseService().check_connection()"`

### DeepSeek API error
- Kiểm tra API key trong `.env`
- Kiểm tra internet connection
- Xem logs để biết lỗi cụ thể

### Port 5000 already in use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5000
kill -9 <PID>
```

## 📚 Dependencies

- **Flask** - Web framework
- **flask-cors** - CORS support
- **mysql-connector-python** - MySQL connection
- **requests** - HTTP client (DeepSeek API)
- **python-dotenv** - Environment variables

## 🔐 Security Notes

- API key được lưu trong `.env` (không commit lên git)
- Database password trong `.env`
- CORS enabled cho localhost (development only)

## 🚀 Next Steps

1. ✅ Flask AI Service hoàn thành
2. ⏳ Tích hợp với Spring Boot Backend
3. ⏳ Test end-to-end với Frontend
4. ⏳ Train ML models (Kaggle) để cải thiện Intent Classification
5. ⏳ Deploy to production

---

**Status: ✅ Ready to Use**

Server running on: `http://localhost:5000`

