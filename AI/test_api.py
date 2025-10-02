"""
Simple script to test the Flask API endpoints
"""
import requests
import json

BASE_URL = "http://localhost:5000"

def test_health():
    """Test health endpoint"""
    print("\n=== Testing /health endpoint ===")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")

def test_ask(question):
    """Test ask endpoint"""
    print(f"\n=== Testing /ask endpoint ===")
    print(f"Question: {question}")
    
    payload = {
        "question": question,
        "user_id": "1"
    }
    
    response = requests.post(
        f"{BASE_URL}/ask",
        json=payload,
        headers={"Content-Type": "application/json"}
    )
    
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")

def test_chat(question):
    """Test chat endpoint (Spring Boot compatible)"""
    print(f"\n=== Testing /api/chat endpoint ===")
    print(f"Question: {question}")
    
    payload = {
        "question": question,
        "user_id": "1"
    }
    
    response = requests.post(
        f"{BASE_URL}/api/chat",
        json=payload,
        headers={"Content-Type": "application/json"}
    )
    
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")

if __name__ == "__main__":
    # Test health
    test_health()
    
    # Test various questions
    questions = [
        "Điểm chuẩn ngành CNTT Đại học Bách Khoa Hà Nội năm 2024 là bao nhiêu?",
        "Cho tôi biết thông tin về ngành Công nghệ thông tin",
        "Trường Đại học Kinh tế Quốc dân ở đâu?",
        "Tôi nên học ngành gì nếu thích toán và máy tính?"
    ]
    
    for q in questions:
        test_ask(q)
        # test_chat(q)  # Uncomment to test /api/chat endpoint

