import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';

const ChatInput = ({ onSend, disabled, placeholder }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '';
      const scrollHeight = textareaRef.current.scrollHeight;
      if (scrollHeight > 56) {
        textareaRef.current.style.height = `${scrollHeight}px`;
      }
    }
  }, [input]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = '';
      }
    }
  };

  const handleKeyDown = (e) => {
    // Enter without Shift -> send message
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
    // Shift + Enter -> new line (default behavior)
  };

  return (
    <form onSubmit={handleSubmit} className="relative py-4">
      <div className="flex items-end gap-3">
        {/* Textarea - Gemini style */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || 'Nhập câu hỏi của bạn...'}
            disabled={disabled}
            rows={1}
            className="w-full resize-none outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-3xl px-6 py-4 pr-16 max-h-32 overflow-y-auto scrollbar-thin disabled:opacity-50 disabled:cursor-not-allowed border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-600 transition-all shadow-sm hover:shadow-md"
            style={{
              minHeight: '56px',
            }}
          />
          
          {/* Send Button - inside input */}
          <button
            type="submit"
            disabled={disabled || !input.trim()}
            className="absolute right-3 bottom-3 flex-shrink-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 dark:disabled:from-gray-600 dark:disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-full p-2.5 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 disabled:transform-none focus:outline-none"
            aria-label="Gửi tin nhắn"
          >
            {disabled ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Hint text - minimal */}
      <div className="px-2 pt-2 text-center">
        <span className="text-xs text-gray-400 dark:text-gray-600">
          EduBot Pro có thể mắc lỗi. Hãy kiểm tra thông tin quan trọng.
        </span>
      </div>
    </form>
  );
};

export default ChatInput;

