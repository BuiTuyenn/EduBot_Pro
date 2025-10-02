import os
import re
from config import Config

class IntentClassifier:
    """Intent classification using rule-based approach and keyword matching"""
    
    def __init__(self):
        self.intent_keywords = {
            'diem_chuan': [
                'điểm chuẩn', 'điểm', 'chuẩn', 'benchmark', 'score',
                'bao nhiêu điểm', 'điểm đầu vào', 'điểm xét tuyển'
            ],
            'nganh_hoc': [
                'ngành', 'chuyên ngành', 'major', 'học gì', 'ngành nào',
                'chương trình đào tạo', 'môn học', 'thông tin ngành'
            ],
            'truong_hoc': [
                'trường', 'đại học', 'university', 'trường nào', 'thông tin trường',
                'cơ sở', 'học viện', 'khu vực'
            ],
            'tu_van_huong_nghiep': [
                'tư vấn', 'nên học', 'lựa chọn', 'hướng nghiệp', 'nghề nghiệp',
                'tương lai', 'phù hợp', 'định hướng', 'career'
            ],
            'faq': [
                'hồ sơ', 'thủ tục', 'đăng ký', 'xét tuyển', 'tuyển sinh',
                'khối', 'môn thi', 'kỳ thi', 'thời gian', 'hạn nộp'
            ]
        }
    
    def classify(self, question):
        """Classify intent from question text"""
        question_lower = question.lower()
        
        # Count keyword matches for each intent
        intent_scores = {}
        for intent, keywords in self.intent_keywords.items():
            score = sum(1 for keyword in keywords if keyword in question_lower)
            if score > 0:
                intent_scores[intent] = score
        
        # Return intent with highest score
        if intent_scores:
            return max(intent_scores, key=intent_scores.get)
        
        # Default to general for unclassified questions
        return 'general'
    
    def get_confidence(self, question):
        """Get confidence score for classification"""
        question_lower = question.lower()
        max_matches = 0
        
        for keywords in self.intent_keywords.values():
            matches = sum(1 for keyword in keywords if keyword in question_lower)
            max_matches = max(max_matches, matches)
        
        # Simple confidence: number of matches / 3, capped at 1.0
        confidence = min(max_matches / 3.0, 1.0)
        return confidence

