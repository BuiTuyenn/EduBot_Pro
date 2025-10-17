import { useState, useCallback, useRef } from 'react';
import { chatAPI, authAPI } from '../services/api';

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  // Start new chat session
  const startNewSession = useCallback(() => {
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSessionId);
    setMessages([]);
    setError(null);
    
    // Add welcome message
    setMessages([{
      id: `msg_${Date.now()}`,
      role: 'assistant',
      content: 'Xin chào! Tôi là trợ lý tư vấn tuyển sinh đại học. Tôi có thể giúp bạn:\n\n- Tra cứu điểm chuẩn các trường, ngành\n- Tìm hiểu thông tin về trường đại học\n- Tư vấn lựa chọn ngành học phù hợp\n- Giải đáp thắc mắc về tuyển sinh\n\nBạn muốn hỏi gì?',
      timestamp: new Date().toISOString(),
    }]);
    
    return newSessionId;
  }, []);

  // Send message
  const sendMessage = useCallback(async (question) => {
    if (!question.trim()) return;

    const user = authAPI.getCurrentUser();
    if (!user) {
      setError('Vui lòng đăng nhập để sử dụng chatbot');
      return;
    }

    // Add user message
    const userMessage = {
      id: `msg_${Date.now()}_user`,
      role: 'user',
      content: question,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    // Create temporary bot message with loading indicator
    const botMessageId = `msg_${Date.now()}_bot`;
    const loadingMessage = {
      id: botMessageId,
      role: 'assistant',
      content: '',
      isLoading: true,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, loadingMessage]);

    try {
      // Abort previous request if exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      // Call backend API (which calls Flask AI)
      const response = await chatAPI.sendMessage(question, sessionId);
      const fullText = response.answer || 'Xin lỗi, tôi không thể trả lời câu hỏi này.';

      // Remove loading state first
      setMessages(prev =>
        prev.map(msg =>
          msg.id === botMessageId
            ? { ...msg, content: '', isLoading: false }
            : msg
        )
      );

      // Typing effect: Display text character by character
      let currentIndex = 0;
      const typingSpeed = 20; // milliseconds per character

      const typeNextChar = () => {
        if (currentIndex < fullText.length) {
          const nextChar = fullText[currentIndex];
          currentIndex++;

          setMessages(prev =>
            prev.map(msg =>
              msg.id === botMessageId
                ? { ...msg, content: fullText.substring(0, currentIndex) }
                : msg
            )
          );

          setTimeout(typeNextChar, typingSpeed);
        }
      };

      typeNextChar();
    } catch (err) {
      console.error('Error sending message:', err);
      
      // Update with error message
      setMessages(prev =>
        prev.map(msg =>
          msg.id === botMessageId
            ? {
                ...msg,
                content: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.',
                isLoading: false,
                isError: true,
              }
            : msg
        )
      );

      setError(err.response?.data?.message || 'Không thể kết nối đến server');
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [sessionId]);

  // Retry last message
  const retryLastMessage = useCallback(() => {
    const lastUserMessage = [...messages]
      .reverse()
      .find(msg => msg.role === 'user');
    
    if (lastUserMessage) {
      // Remove last bot message if it's an error
      setMessages(prev => {
        const lastBotIndex = [...prev].reverse().findIndex(msg => msg.role === 'assistant');
        if (lastBotIndex !== -1) {
          const actualIndex = prev.length - 1 - lastBotIndex;
          return prev.slice(0, actualIndex);
        }
        return prev;
      });

      // Resend the message
      sendMessage(lastUserMessage.content);
    }
  }, [messages, sendMessage]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load existing session
  const loadSession = useCallback((sessionId, sessionMessages) => {
    setSessionId(sessionId);
    setMessages(sessionMessages);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    sessionId,
    error,
    sendMessage,
    startNewSession,
    retryLastMessage,
    clearError,
    loadSession,
  };
};

export default useChat;

