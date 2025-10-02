from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from datetime import datetime

from services.intent_classifier import IntentClassifier
from services.entity_recognizer import EntityRecognizer
from services.deepseek_client import DeepSeekClient
from services.database import DatabaseService
from services.response_generator import ResponseGenerator

app = Flask(__name__)
CORS(app)

# Initialize services
db_service = DatabaseService()
intent_classifier = IntentClassifier()
entity_recognizer = EntityRecognizer()
deepseek_client = DeepSeekClient(api_key=os.getenv('DEEPSEEK_API_KEY', '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'))
response_generator = ResponseGenerator(db_service, deepseek_client)

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'Educational Chatbot AI',
        'timestamp': datetime.now().isoformat(),
        'database': 'connected' if db_service.check_connection() else 'disconnected'
    }), 200

@app.route('/ask', methods=['POST'])
def ask():
    """Main endpoint for handling questions"""
    try:
        data = request.get_json()
        question = data.get('question', '').strip()
        user_id = data.get('user_id')
        
        if not question:
            return jsonify({
                'success': False,
                'error': 'Question is required'
            }), 400
        
        # Step 1: Intent Classification
        intent = intent_classifier.classify(question)
        
        # Step 2: Entity Recognition
        entities = entity_recognizer.extract(question)
        
        # Step 3: Generate response based on intent
        response_data = response_generator.generate(
            question=question,
            intent=intent,
            entities=entities,
            user_id=user_id
        )
        
        # Step 4: Return standardized JSON response
        return jsonify({
            'success': True,
            'answer': response_data['answer'],
            'intent': intent,
            'entities': entities,
            'sources': response_data.get('sources', []),
            'confidence': response_data.get('confidence', 0.0),
            'timestamp': datetime.now().isoformat()
        }), 200
        
    except Exception as e:
        print(f"Error in /ask endpoint: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e),
            'answer': 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.'
        }), 500

@app.route('/api/chat', methods=['POST'])
def chat():
    """Alternative endpoint for Spring Boot backend compatibility"""
    try:
        data = request.get_json()
        question = data.get('question', '').strip()
        user_id = data.get('user_id')
        
        if not question:
            return jsonify({'answer': 'Vui lòng nhập câu hỏi.'}), 400
        
        # Use the same logic as /ask
        intent = intent_classifier.classify(question)
        entities = entity_recognizer.extract(question)
        response_data = response_generator.generate(
            question=question,
            intent=intent,
            entities=entities,
            user_id=user_id
        )
        
        return jsonify({
            'answer': response_data['answer']
        }), 200
        
    except Exception as e:
        print(f"Error in /api/chat endpoint: {str(e)}")
        return jsonify({
            'answer': 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.'
        }), 500

if __name__ == '__main__':
    print("Starting Educational Chatbot AI Service...")
    print("Server running on http://localhost:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)

