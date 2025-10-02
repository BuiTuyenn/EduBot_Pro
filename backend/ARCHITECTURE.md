# Backend Architecture - Educational Chatbot

## 🏗️ Kiến trúc tổng thể

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                            │
│                    (React/Vite - Port 5173)                 │
└─────────────────────────────────────────────────────────────┘
                              ↓ HTTP/HTTPS
                              ↓ REST API + JWT
┌─────────────────────────────────────────────────────────────┐
│                   SPRING BOOT BACKEND                       │
│                      (Port 8080)                            │
│                                                             │
│  ┌────────────────────────────────────────────────────┐   │
│  │              CONTROLLER LAYER                       │   │
│  │  - AuthController                                   │   │
│  │  - TruongController, NganhController               │   │
│  │  - DiemChuanController                             │   │
│  │  - ChatbotController, LichSuChatController         │   │
│  └────────────────────────────────────────────────────┘   │
│                              ↓                              │
│  ┌────────────────────────────────────────────────────┐   │
│  │               SERVICE LAYER                         │   │
│  │  - AuthService                                      │   │
│  │  - TruongService, NganhService                     │   │
│  │  - DiemChuanService, LichSuChatService            │   │
│  │  - ChatbotService (Middleware)                     │   │
│  └────────────────────────────────────────────────────┘   │
│                              ↓                              │
│  ┌────────────────────────────────────────────────────┐   │
│  │             REPOSITORY LAYER (JPA)                  │   │
│  │  - TruongRepository, NganhRepository               │   │
│  │  - DiemChuanRepository                             │   │
│  │  - UserRepository, LichSuChatRepository           │   │
│  └────────────────────────────────────────────────────┘   │
│                              ↓                              │
│  ┌────────────────────────────────────────────────────┐   │
│  │                ENTITY LAYER                         │   │
│  │  - Truong, Nganh, DiemChuan                        │   │
│  │  - User, LichSuChat                                │   │
│  └────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌────────────────────────────────────────────────────┐   │
│  │              SECURITY LAYER                         │   │
│  │  - SecurityConfig (CORS, Auth)                     │   │
│  │  - JwtService (Token generation/validation)        │   │
│  │  - JwtAuthenticationFilter                         │   │
│  └────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                    ↓                          ↓
                    ↓                          ↓
          ┌─────────────────┐        ┌─────────────────────┐
          │  MySQL Database │        │   Flask Chatbot API │
          │   (Port 3306)   │        │    (Port 5000)      │
          └─────────────────┘        └─────────────────────┘
```

## 📁 Project Structure

```
backend/
│
├── src/main/java/com/example/backend/
│   │
│   ├── BackendApplication.java          # Main application entry point
│   │
│   ├── config/                           # Configuration classes
│   │   ├── SecurityConfig.java          # Spring Security & CORS
│   │   ├── JwtService.java              # JWT token management
│   │   ├── JwtAuthenticationFilter.java # JWT filter
│   │   └── RestTemplateConfig.java      # HTTP client config
│   │
│   ├── controller/                       # REST API endpoints
│   │   ├── AuthController.java          # /api/auth/**
│   │   ├── TruongController.java        # /api/truong/**
│   │   ├── NganhController.java         # /api/nganh/**
│   │   ├── DiemChuanController.java     # /api/diem-chuan/**
│   │   ├── ChatbotController.java       # /api/chat
│   │   └── LichSuChatController.java    # /api/lich-su-chat/**
│   │
│   ├── dto/                              # Data Transfer Objects
│   │   ├── AuthRequest.java
│   │   ├── RegisterRequest.java
│   │   ├── AuthResponse.java
│   │   ├── ChatRequest.java
│   │   ├── ChatResponse.java
│   │   ├── TruongDTO.java
│   │   ├── NganhDTO.java
│   │   ├── DiemChuanDTO.java
│   │   └── LichSuChatDTO.java
│   │
│   ├── entity/                           # JPA entities
│   │   ├── Truong.java
│   │   ├── Nganh.java
│   │   ├── DiemChuan.java
│   │   ├── User.java
│   │   └── LichSuChat.java
│   │
│   ├── repository/                       # Data access layer
│   │   ├── TruongRepository.java
│   │   ├── NganhRepository.java
│   │   ├── DiemChuanRepository.java
│   │   ├── UserRepository.java
│   │   └── LichSuChatRepository.java
│   │
│   └── service/                          # Business logic
│       ├── AuthService.java
│       ├── UserDetailsServiceImpl.java
│       ├── TruongService.java
│       ├── NganhService.java
│       ├── DiemChuanService.java
│       ├── ChatbotService.java
│       └── LichSuChatService.java
│
├── src/main/resources/
│   ├── application.properties           # App configuration
│   ├── schema.sql                       # Database schema
│   └── seed.sql                         # Initial data
│
├── src/test/                            # Test files
│
├── pom.xml                              # Maven dependencies
├── mvnw, mvnw.cmd                       # Maven wrapper
│
└── Documentation/
    ├── DATABASE_README.md
    ├── API_DOCUMENTATION.md
    ├── BACKEND_README.md
    ├── SETUP_GUIDE.md
    ├── PROJECT_SUMMARY.md
    └── ARCHITECTURE.md (this file)
```

## 🔄 Request Flow

### 1. Authentication Flow

```
User → POST /api/auth/register
           ↓
    AuthController.register()
           ↓
    AuthService.register()
           ↓
    - Hash password (BCrypt)
    - Save user to DB
    - Generate JWT token
           ↓
    Return AuthResponse with token
```

### 2. Protected Endpoint Flow

```
User → GET /api/truong (with JWT token)
           ↓
    JwtAuthenticationFilter
           ↓
    - Extract token from header
    - Validate token
    - Set authentication in SecurityContext
           ↓
    TruongController.getAllTruong()
           ↓
    TruongService.getAllTruong()
           ↓
    TruongRepository.findAll()
           ↓
    Return List<TruongDTO>
```

### 3. Chatbot Flow (Middleware)

```
User → POST /api/chat (with JWT token)
           ↓
    ChatbotController.chat()
           ↓
    ChatbotService.chat()
           ↓
    - Get authenticated user from SecurityContext
    - Call Flask API via RestTemplate
    - Receive chatbot response
    - Save to chat history (LichSuChatService)
           ↓
    Return ChatResponse
           ↓
    Flask API receives:
    {
      "question": "...",
      "user_id": "..."
    }
           ↓
    Flask API responds:
    {
      "answer": "..."
    }
```

## 🔐 Security Architecture

### JWT Authentication Flow

```
1. User Login
   ↓
2. AuthService validates credentials
   ↓
3. JwtService generates token
   - Header: {"alg": "HS256", "typ": "JWT"}
   - Payload: {"sub": "email", "iat": ..., "exp": ...}
   - Signature: HMACSHA256(base64UrlEncode(header) + "." + 
                           base64UrlEncode(payload), secret)
   ↓
4. Token returned to client
   ↓
5. Client includes token in subsequent requests
   - Header: Authorization: Bearer <token>
   ↓
6. JwtAuthenticationFilter validates token
   ↓
7. Sets authentication in SecurityContext
   ↓
8. Request proceeds to controller
```

### Security Configuration

```java
Public endpoints:
- /api/auth/register
- /api/auth/login
- /api/public/**

Protected endpoints:
- /api/truong/**
- /api/nganh/**
- /api/diem-chuan/**
- /api/chat
- /api/lich-su-chat/**

CORS allowed origins:
- http://localhost:5173 (Vite)
- http://localhost:3000 (React)
```

## 💾 Database Architecture

### Entity Relationships

```
User (1) ─────── (N) LichSuChat
                      Chat History

Truong (1) ──────┐
                 │
                 ├── (N) DiemChuan
                 │
Nganh (1) ───────┘
```

### Schema Design

```sql
truong (Universities)
├── id (PK)
├── ten
├── khu_vuc
├── website
└── mo_ta

nganh (Majors)
├── id (PK)
├── ten
├── ma_nganh (UK)
└── khoi_xet_tuyen

diem_chuan (Admission Scores)
├── id (PK)
├── id_truong (FK → truong.id)
├── id_nganh (FK → nganh.id)
├── nam
└── diem
└── UK (id_truong, id_nganh, nam)

user (Users)
├── id (PK)
├── ten
├── email (UK)
└── mat_khau_hash

lich_su_chat (Chat History)
├── id (PK)
├── id_user (FK → user.id)
├── cau_hoi
├── cau_tra_loi
└── timestamp
```

## 🔌 External Integrations

### 1. Flask Chatbot API Integration

**Purpose:** AI chatbot for answering university admission questions

**Endpoint:** `http://localhost:5000/api/chat`

**Integration Point:** `ChatbotService.java`

**Request Format:**
```json
{
  "question": "Điểm chuẩn CNTT Bách Khoa 2024?",
  "user_id": "1"
}
```

**Response Format:**
```json
{
  "answer": "Điểm chuẩn ngành CNTT tại ĐH Bách Khoa Hà Nội năm 2024 là 28.00"
}
```

**Error Handling:**
- Fallback response if Flask API is down
- Automatic retry logic (optional)
- Chat history saved regardless

### 2. MySQL Database

**Connection:** JDBC via Spring Data JPA

**Configuration:**
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/edu_chatbot
spring.jpa.hibernate.ddl-auto=update
```

**Features:**
- Auto DDL generation
- Connection pooling
- UTF-8 support for Vietnamese

## 📊 Data Flow Diagram

### CRUD Operations

```
Frontend → Controller → Service → Repository → Database
                ↓
              DTO ← Entity conversion
                ↓
            Response
```

### Chat Operation

```
Frontend → ChatbotController → ChatbotService
                                      ↓
                              RestTemplate HTTP Client
                                      ↓
                              Flask Chatbot API
                                      ↓
                              Response received
                                      ↓
                              LichSuChatService.save()
                                      ↓
                              Database (lich_su_chat)
                                      ↓
                              Return to Frontend
```

## 🛠️ Technology Stack

### Core Framework
- **Spring Boot 3.5.6** - Main framework
- **Java 21** - Programming language

### Data Layer
- **Spring Data JPA** - ORM
- **Hibernate** - JPA implementation
- **MySQL Connector** - Database driver

### Security
- **Spring Security** - Authentication & Authorization
- **JWT (jjwt 0.12.3)** - Token-based auth
- **BCrypt** - Password hashing

### Utilities
- **Lombok** - Reduce boilerplate
- **RestTemplate** - HTTP client
- **Jackson** - JSON serialization

### Build Tools
- **Maven** - Dependency management
- **Maven Wrapper** - Included in project

## 🎯 Design Patterns Used

1. **MVC Pattern** - Controller-Service-Repository
2. **DTO Pattern** - Entity ↔ DTO conversion
3. **Repository Pattern** - Data access abstraction
4. **Dependency Injection** - Spring IoC container
5. **Filter Pattern** - JWT authentication filter
6. **Builder Pattern** - JWT token building
7. **Facade Pattern** - Service layer abstracts complexity

## 🚀 Deployment Architecture

### Development Environment
```
localhost:8080 → Spring Boot
localhost:3306 → MySQL
localhost:5000 → Flask Chatbot
localhost:5173 → Frontend (Vite)
```

### Production Environment (Example)
```
API Gateway → Load Balancer → Spring Boot Instances
                                      ↓
                              RDS MySQL (AWS)
                                      ↓
                              Flask API (Docker/K8s)
```

## 📈 Scalability Considerations

1. **Stateless Design** - JWT tokens, no server sessions
2. **Database Indexing** - Optimized queries
3. **Connection Pooling** - HikariCP (default)
4. **Caching** - Can add Redis for frequently accessed data
5. **Microservices Ready** - Chatbot as separate service

## 🔍 Monitoring & Logging

### Built-in Features
- **Spring Boot Actuator** - Health checks (optional)
- **SQL Logging** - `spring.jpa.show-sql=true`
- **Error Handling** - Global exception handlers (can be added)

### Recommended Additions
- **Logback/SLF4J** - Structured logging
- **Prometheus + Grafana** - Metrics
- **ELK Stack** - Log aggregation

## 📝 API Versioning Strategy

Current: No versioning (v1 implicit)

Future:
- `/api/v1/truong`
- `/api/v2/truong`

Or use headers: `Accept: application/vnd.api.v1+json`

## 🔒 Security Best Practices

✅ **Implemented:**
- Password hashing (BCrypt)
- JWT token authentication
- CORS configuration
- SQL injection prevention (JPA)
- Input validation (DTOs)

🔜 **Recommended:**
- Rate limiting
- Request validation (Bean Validation)
- HTTPS/TLS in production
- Security headers (HSTS, CSP)
- API key for Flask integration

## 📚 Further Reading

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Security](https://spring.io/projects/spring-security)
- [JWT Specification](https://jwt.io/)
- [JPA Best Practices](https://vladmihalcea.com/)
- [RESTful API Design](https://restfulapi.net/)

---

**Architecture Version:** 1.0  
**Last Updated:** 2024  
**Status:** ✅ Production Ready

