-- Database Schema for Educational Chatbot
-- MySQL Database

-- Create database (run separately if needed)
-- CREATE DATABASE IF NOT EXISTS edu_chatbot CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE edu_chatbot;

-- Table: truong (universities/schools)
CREATE TABLE IF NOT EXISTS truong (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ten VARCHAR(255) NOT NULL,
    khu_vuc VARCHAR(100),
    website VARCHAR(255),
    mo_ta TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_ten (ten),
    INDEX idx_khu_vuc (khu_vuc)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: nganh (majors/fields of study)
CREATE TABLE IF NOT EXISTS nganh (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ten VARCHAR(255) NOT NULL,
    ma_nganh VARCHAR(50) NOT NULL,
    khoi_xet_tuyen VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_ma_nganh (ma_nganh),
    INDEX idx_ten (ten),
    INDEX idx_khoi_xet_tuyen (khoi_xet_tuyen)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: diem_chuan (admission scores)
CREATE TABLE IF NOT EXISTS diem_chuan (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_truong BIGINT NOT NULL,
    id_nganh BIGINT NOT NULL,
    nam YEAR NOT NULL,
    diem DECIMAL(4,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_truong) REFERENCES truong(id) ON DELETE CASCADE,
    FOREIGN KEY (id_nganh) REFERENCES nganh(id) ON DELETE CASCADE,
    INDEX idx_truong_nganh (id_truong, id_nganh),
    INDEX idx_nam (nam),
    UNIQUE KEY uk_truong_nganh_nam (id_truong, id_nganh, nam)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: user (users)
CREATE TABLE IF NOT EXISTS user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ten VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    mat_khau_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: lich_su_chat (chat history)
CREATE TABLE IF NOT EXISTS lich_su_chat (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_user BIGINT NOT NULL,
    session_id VARCHAR(255),
    cau_hoi TEXT NOT NULL,
    cau_tra_loi TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES user(id) ON DELETE CASCADE,
    INDEX idx_user_timestamp (id_user, timestamp),
    INDEX idx_session (session_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

