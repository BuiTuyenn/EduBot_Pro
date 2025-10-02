import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Database Configuration
    DB_HOST = os.getenv('DB_HOST', 'localhost')
    DB_PORT = int(os.getenv('DB_PORT', 3306))
    DB_USER = os.getenv('DB_USER', 'root')
    DB_PASSWORD = os.getenv('DB_PASSWORD', '1234')
    DB_NAME = os.getenv('DB_NAME', 'edu_chatbot')
    
    # DeepSeek API Configuration
    DEEPSEEK_API_KEY = os.getenv('DEEPSEEK_API_KEY', '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')
    DEEPSEEK_API_URL = os.getenv('DEEPSEEK_API_URL', 'https://openrouter.ai/api/v1/chat/completions')
    DEEPSEEK_MODEL = 'deepseek/deepseek-chat'
    
    # Intent Categories
    INTENTS = [
        'diem_chuan',        # Hỏi điểm chuẩn
        'nganh_hoc',         # Hỏi về ngành học
        'truong_hoc',        # Hỏi về trường học
        'tu_van_huong_nghiep',  # Tư vấn hướng nghiệp
        'faq',               # Câu hỏi thường gặp
        'general'            # Câu hỏi tự do
    ]
    
    # Model paths (for Kaggle-trained models)
    INTENT_MODEL_PATH = 'models/intent_classifier.pkl'
    ENTITY_MODEL_PATH = 'models/entity_recognizer.pkl'
    VECTORIZER_PATH = 'models/vectorizer.pkl'

