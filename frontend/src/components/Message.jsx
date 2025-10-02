import React from 'react';
import ReactMarkdown from 'react-markdown';
import { User, Bot, AlertTriangle, Loader2 } from 'lucide-react';

const Message = ({ message }) => {
  const isUser = message.role === 'user';
  const isError = message.isError;
  const isLoading = message.isLoading;

  // Check for warning keywords
  const hasWarning = message.content && (
    message.content.includes('CẢNH BÁO') ||
    message.content.includes('KHẨN CẤP') ||
    message.content.includes('LƯU Ý')
  );

  return (
    <div
      className={`flex gap-6 py-8 px-6 ${
        isUser
          ? 'flex-row-reverse bg-transparent'
          : 'flex-row' + (isError
          ? ' bg-red-50/50 dark:bg-red-900/5'
          : hasWarning
          ? ' bg-yellow-50/50 dark:bg-yellow-900/5'
          : ' bg-gradient-to-br from-gray-50/50 to-blue-50/30 dark:from-gray-800/30 dark:to-blue-900/10')
      }`}
    >
      {/* Avatar - Gemini style */}
      <div className="flex-shrink-0">
        <div
          className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg transform transition-transform hover:scale-105 ${
            isUser
              ? 'bg-gradient-to-br from-blue-500 to-purple-600'
              : isError
              ? 'bg-gradient-to-br from-red-500 to-orange-600'
              : 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500'
          }`}
        >
          {isUser ? (
            <User className="w-5 h-5 text-white" />
          ) : isError ? (
            <AlertTriangle className="w-5 h-5 text-white" />
          ) : (
            <Bot className="w-5 h-5 text-white" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className={`flex-1 min-w-0 ${isUser ? 'text-right' : 'text-left'}`}>
        <div className={`flex items-center gap-3 mb-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
          <span className="font-bold text-base bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
            {isUser ? 'Bạn' : 'EduBot Pro'}
          </span>
          {hasWarning && !isUser && (
            <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-medium rounded-full flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Lưu ý
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Đang suy nghĩ...</span>
          </div>
        ) : (
          <div
            className={`markdown-body ${
              isUser ? 'text-gray-900 dark:text-gray-100' : ''
            }`}
          >
            {isUser ? (
              <p className="whitespace-pre-wrap">{message.content}</p>
            ) : (
              <ReactMarkdown
                components={{
                  // Custom code block styling
                  code({ node, inline, className, children, ...props }) {
                    return inline ? (
                      <code
                        className="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm font-mono"
                        {...props}
                      >
                        {children}
                      </code>
                    ) : (
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-3">
                        <code className="font-mono text-sm" {...props}>
                          {children}
                        </code>
                      </pre>
                    );
                  },
                  // Custom list styling
                  ul({ children }) {
                    return <ul className="list-disc ml-6 mb-3 space-y-1">{children}</ul>;
                  },
                  ol({ children }) {
                    return <ol className="list-decimal ml-6 mb-3 space-y-1">{children}</ol>;
                  },
                  // Custom paragraph styling
                  p({ children }) {
                    return <p className="mb-3 leading-relaxed">{children}</p>;
                  },
                  // Custom strong/bold styling
                  strong({ children }) {
                    return <strong className="font-semibold text-gray-900 dark:text-gray-100">{children}</strong>;
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            )}
          </div>
        )}

        {/* Timestamp - subtle */}
        {message.timestamp && !isLoading && (
          <div className={`text-xs text-gray-400 dark:text-gray-600 mt-4 flex items-center gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <span>{new Date(message.timestamp).toLocaleTimeString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit',
            })}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;

