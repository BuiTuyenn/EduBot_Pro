import requests
from config import Config

class DeepSeekClient:
    def __init__(self, api_key=None):
        self.api_key = api_key or Config.DEEPSEEK_API_KEY
        self.api_url = Config.DEEPSEEK_API_URL
        self.model = Config.DEEPSEEK_MODEL
    
    def generate_response(self, question, context=None):
        """Generate response using DeepSeek API via OpenRouter"""
        try:
            # Build system prompt
            system_prompt = """Bạn là trợ lý tư vấn tuyển sinh đại học thông minh và thân thiện.
Nhiệm vụ của bạn là:
- Trả lời các câu hỏi về tuyển sinh đại học tại Việt Nam
- Tư vấn hướng nghiệp cho học sinh
- Giải đáp thắc mắc về ngành học, trường học
- Cung cấp thông tin chính xác và hữu ích

Hãy trả lời bằng tiếng Việt, ngắn gọn, súc tích và thân thiện."""

            # Build user message
            user_message = question
            if context:
                user_message = f"Dựa trên thông tin sau:\n{context}\n\nCâu hỏi: {question}"
            
            # Make API request
            headers = {
                'Authorization': f'Bearer {self.api_key}',
                'Content-Type': 'application/json',
                'HTTP-Referer': 'http://localhost:5000',
                'X-Title': 'Educational Chatbot'
            }
            
            payload = {
                'model': self.model,
                'messages': [
                    {'role': 'system', 'content': system_prompt},
                    {'role': 'user', 'content': user_message}
                ],
                'temperature': 0.7,
                'max_tokens': 500
            }
            
            response = requests.post(
                self.api_url,
                headers=headers,
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                answer = result['choices'][0]['message']['content']
                return answer.strip()
            else:
                error_msg = f"DeepSeek API error: {response.status_code} - {response.text}"
                print(error_msg)
                
                # Return helpful fallback based on status code
                if response.status_code == 401:
                    return "API key không hợp lệ hoặc đã hết hạn. Vui lòng kiểm tra cấu hình."
                elif response.status_code == 402:
                    return "Tài khoản đã hết credits. Vui lòng nạp thêm tại OpenRouter."
                elif response.status_code == 429:
                    return "Quá nhiều requests. Vui lòng thử lại sau."
                return None
                
        except Exception as e:
            print(f"Error calling DeepSeek API: {str(e)}")
            return None
    
    def generate_with_data(self, question, database_results):
        """Generate response with database context"""
        context = self._format_database_context(database_results)
        return self.generate_response(question, context)
    
    def _format_database_context(self, data):
        """Format database results into context string"""
        if not data:
            return ""
        
        context_parts = []
        
        # Format admission scores
        if 'diem_chuan' in data:
            scores = data['diem_chuan']
            if scores:
                context_parts.append("Thông tin điểm chuẩn:")
                for score in scores[:5]:  # Limit to 5 results
                    context_parts.append(
                        f"- {score['ten_truong']}, ngành {score['ten_nganh']}, "
                        f"năm {score['nam']}: {score['diem']} điểm"
                    )
        
        # Format universities
        if 'truong' in data:
            schools = data['truong']
            if schools:
                context_parts.append("\nThông tin trường:")
                for school in schools[:3]:
                    context_parts.append(
                        f"- {school['ten']}: {school.get('mo_ta', 'Không có mô tả')}"
                    )
        
        # Format majors
        if 'nganh' in data:
            majors = data['nganh']
            if majors:
                context_parts.append("\nThông tin ngành:")
                for major in majors[:3]:
                    context_parts.append(
                        f"- {major['ten']} (Mã: {major['ma_nganh']}), "
                        f"Khối: {major.get('khoi_xet_tuyen', 'N/A')}"
                    )
        
        return "\n".join(context_parts)

