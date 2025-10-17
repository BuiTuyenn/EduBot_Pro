from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys
import logging
from datetime import datetime

from services.intent_classifier import IntentClassifier
from services.entity_recognizer import EntityRecognizer
from services.deepseek_client import DeepSeekClient
from services.database import DatabaseService
from services.response_generator import ResponseGenerator
from config import Config

# Fix encoding for Windows
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False
app.config['JSON_SORT_KEYS'] = False
CORS(app)

# Initialize services
db_service = DatabaseService()
intent_classifier = IntentClassifier()
entity_recognizer = EntityRecognizer()
# Use API key from Config (no hardcoded fallback)
deepseek_client = DeepSeekClient()
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
        # Force UTF-8 encoding for request data
        data = request.get_json(force=True)
        if data is None:
            data = request.json
        
        question = data.get('question', '').strip()
        user_id = data.get('user_id')
        
        logger.info(f"📩 Received question from user {user_id}: {question}")
        
        if not question:
            logger.warning("Empty question received")
            return jsonify({'answer': 'Vui lòng nhập câu hỏi.'}), 400
        
        # Use the same logic as /ask
        intent = intent_classifier.classify(question)
        entities = entity_recognizer.extract(question)
        
        logger.info(f"🎯 Intent: {intent}, Entities: {entities}")
        
        response_data = response_generator.generate(
            question=question,
            intent=intent,
            entities=entities,
            user_id=user_id
        )
        
        logger.info(f"✅ Response generated: {response_data['answer'][:100]}...")
        
        return jsonify({
            'answer': response_data['answer']
        }), 200
        
    except Exception as e:
        logger.error(f"❌ Error in /api/chat endpoint: {str(e)}", exc_info=True)
        return jsonify({
            'answer': 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.'
        }), 500

if __name__ == '__main__':
    logger.info("="*70)
    logger.info("🚀 Starting Educational Chatbot AI Service...")
    logger.info("🌐 Server running on http://localhost:5000")
    logger.info("📊 Database: " + ("✅ Connected" if db_service.check_connection() else "❌ Disconnected"))
    logger.info("🔑 DeepSeek API: Configured")
    logger.info("="*70)
    app.run(host='0.0.0.0', port=5000, debug=True)

