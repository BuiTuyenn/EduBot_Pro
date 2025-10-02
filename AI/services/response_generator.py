class ResponseGenerator:
    """Generate responses based on intent and database queries"""
    
    def __init__(self, db_service, deepseek_client):
        self.db = db_service
        self.deepseek = deepseek_client
    
    def generate(self, question, intent, entities, user_id=None):
        """Main response generation logic"""
        
        # Route based on intent
        if intent == 'diem_chuan':
            return self._handle_diem_chuan(question, entities)
        elif intent == 'nganh_hoc':
            return self._handle_nganh_hoc(question, entities)
        elif intent == 'truong_hoc':
            return self._handle_truong_hoc(question, entities)
        elif intent == 'tu_van_huong_nghiep':
            return self._handle_tu_van(question, entities)
        elif intent == 'faq':
            return self._handle_faq(question, entities)
        else:  # general
            return self._handle_general(question)
    
    def _handle_diem_chuan(self, question, entities):
        """Handle admission score queries"""
        truong_name = entities['truong'][0] if entities['truong'] else None
        nganh_name = entities['nganh'][0] if entities['nganh'] else None
        nam = entities['nam']
        
        # Query database
        results = self.db.search_diem_chuan_by_text(truong_name, nganh_name, nam)
        
        if results:
            # Format structured response
            answer_parts = []
            
            if len(results) == 1:
                r = results[0]
                answer_parts.append(
                    f"Điểm chuẩn ngành {r['ten_nganh']} tại {r['ten_truong']} "
                    f"năm {r['nam']} là {r['diem']} điểm."
                )
                if r.get('khoi_xet_tuyen'):
                    answer_parts.append(f"Khối xét tuyển: {r['khoi_xet_tuyen']}")
            else:
                answer_parts.append("Dưới đây là thông tin điểm chuẩn:")
                for r in results[:5]:
                    answer_parts.append(
                        f"- {r['ten_truong']}, ngành {r['ten_nganh']}, "
                        f"năm {r['nam']}: {r['diem']} điểm"
                    )
            
            return {
                'answer': '\n'.join(answer_parts),
                'sources': results,
                'confidence': 0.9
            }
        else:
            # No database results, use DeepSeek
            context_msg = "Không tìm thấy dữ liệu điểm chuẩn chính xác trong database."
            ai_answer = self.deepseek.generate_response(question, context_msg)
            
            return {
                'answer': ai_answer or "Xin lỗi, tôi không tìm thấy thông tin điểm chuẩn bạn yêu cầu.",
                'sources': [],
                'confidence': 0.3
            }
    
    def _handle_nganh_hoc(self, question, entities):
        """Handle major information queries"""
        nganh_name = entities['nganh'][0] if entities['nganh'] else None
        
        if nganh_name:
            results = self.db.get_nganh_by_name(nganh_name)
            
            if results:
                answer_parts = []
                for r in results[:3]:
                    answer_parts.append(
                        f"**{r['ten']}** (Mã ngành: {r['ma_nganh']})\n"
                        f"Khối xét tuyển: {r.get('khoi_xet_tuyen', 'Chưa cập nhật')}"
                    )
                
                # Get admission scores for this major
                scores = self.db.get_diem_chuan(nganh_id=results[0]['id'])
                if scores:
                    answer_parts.append("\nMột số điểm chuẩn gần đây:")
                    for s in scores[:3]:
                        answer_parts.append(
                            f"- {s['ten_truong']}, năm {s['nam']}: {s['diem']} điểm"
                        )
                
                return {
                    'answer': '\n'.join(answer_parts),
                    'sources': {'nganh': results, 'diem_chuan': scores},
                    'confidence': 0.85
                }
        
        # Use AI for general major questions
        all_majors = self.db.get_all_nganh()
        ai_answer = self.deepseek.generate_with_data(question, {'nganh': all_majors[:10]})
        
        return {
            'answer': ai_answer or "Vui lòng cung cấp thêm thông tin về ngành học bạn quan tâm.",
            'sources': {'nganh': all_majors[:10]},
            'confidence': 0.6
        }
    
    def _handle_truong_hoc(self, question, entities):
        """Handle university information queries"""
        truong_name = entities['truong'][0] if entities['truong'] else None
        
        if truong_name:
            results = self.db.get_truong_by_name(truong_name)
            
            if results:
                answer_parts = []
                for r in results[:2]:
                    answer_parts.append(f"**{r['ten']}**")
                    answer_parts.append(f"Khu vực: {r.get('khu_vuc', 'N/A')}")
                    if r.get('website'):
                        answer_parts.append(f"Website: {r['website']}")
                    if r.get('mo_ta'):
                        answer_parts.append(f"Mô tả: {r['mo_ta']}")
                    answer_parts.append("")
                
                return {
                    'answer': '\n'.join(answer_parts),
                    'sources': {'truong': results},
                    'confidence': 0.85
                }
        
        # Use AI for general university questions
        all_truong = self.db.get_all_truong()
        ai_answer = self.deepseek.generate_with_data(question, {'truong': all_truong[:10]})
        
        return {
            'answer': ai_answer or "Vui lòng cung cấp tên trường cụ thể bạn muốn biết thông tin.",
            'sources': {'truong': all_truong[:10]},
            'confidence': 0.6
        }
    
    def _handle_tu_van(self, question, entities):
        """Handle career counseling queries using AI"""
        # Get relevant data for context
        context_data = {}
        
        if entities['nganh']:
            nganh_results = self.db.get_nganh_by_name(entities['nganh'][0])
            if nganh_results:
                context_data['nganh'] = nganh_results
        
        ai_answer = self.deepseek.generate_with_data(question, context_data)
        
        return {
            'answer': ai_answer or "Tôi có thể tư vấn cho bạn về lựa chọn ngành học và trường đại học. Bạn có thể cho tôi biết thêm về sở thích và điểm mạnh của bạn không?",
            'sources': context_data,
            'confidence': 0.7
        }
    
    def _handle_faq(self, question, entities):
        """Handle FAQ queries using AI"""
        ai_answer = self.deepseek.generate_response(question)
        
        return {
            'answer': ai_answer or "Vui lòng liên hệ với bộ phận tuyển sinh của trường để biết thêm chi tiết về thủ tục và hồ sơ.",
            'sources': [],
            'confidence': 0.65
        }
    
    def _handle_general(self, question):
        """Handle general queries using AI"""
        ai_answer = self.deepseek.generate_response(question)
        
        return {
            'answer': ai_answer or "Tôi có thể giúp bạn tra cứu điểm chuẩn, thông tin về trường, ngành học và tư vấn hướng nghiệp. Bạn cần hỗ trợ gì?",
            'sources': [],
            'confidence': 0.5
        }

