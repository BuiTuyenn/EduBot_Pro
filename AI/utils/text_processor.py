"""
Text processing utilities for Vietnamese text
"""
import re

class TextProcessor:
    """Vietnamese text preprocessing utilities"""
    
    @staticmethod
    def normalize_text(text):
        """Normalize Vietnamese text"""
        # Convert to lowercase
        text = text.lower()
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Remove special characters but keep Vietnamese
        text = re.sub(r'[^\w\sàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]', '', text)
        
        return text.strip()
    
    @staticmethod
    def remove_stopwords(text):
        """Remove Vietnamese stopwords"""
        stopwords = {
            'và', 'của', 'là', 'được', 'có', 'cho', 'từ', 'trong', 'với',
            'về', 'này', 'đó', 'các', 'những', 'một', 'để', 'không', 'còn',
            'thì', 'hay', 'hoặc', 'vì', 'nên', 'mà', 'ở', 'tại', 'trên'
        }
        
        words = text.split()
        filtered_words = [w for w in words if w not in stopwords]
        return ' '.join(filtered_words)
    
    @staticmethod
    def extract_keywords(text):
        """Extract keywords from text"""
        normalized = TextProcessor.normalize_text(text)
        without_stopwords = TextProcessor.remove_stopwords(normalized)
        return without_stopwords.split()

