import React, { useEffect, useRef, useState } from 'react';
import { PlusCircle, Menu } from 'lucide-react';
import Message from './Message';
import ChatInput from './ChatInput';
import Sidebar from './Sidebar';
import SettingsDropdown from './SettingsDropdown';
import Logo from './Logo';
import { useChat } from '../hooks/useChat';
import { authAPI } from '../services/api';

const ChatWindow = ({ darkMode, toggleDarkMode, onLogout }) => {
  const {
    messages,
    isLoading,
    sessionId,
    error,
    sendMessage,
    startNewSession,
    clearError,
    loadSession,
  } = useChat();

  const messagesEndRef = useRef(null);
  const user = authAPI.getCurrentUser();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [refreshSidebar, setRefreshSidebar] = useState(0);

  // Auto-scroll to bottom when new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Start session on mount
  useEffect(() => {
    if (!sessionId) {
      startNewSession();
    }
  }, [sessionId, startNewSession]);

  // Trigger sidebar refresh when a message is sent (not loading anymore)
  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant' && !lastMessage.isLoading) {
        // Delay to ensure backend has saved the chat
        setTimeout(() => {
          setRefreshSidebar(prev => prev + 1);
        }, 500);
      }
    }
  }, [isLoading, messages]);

  const handleNewChat = () => {
    startNewSession();
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLoadSession = (session) => {
    // Convert session chats to messages format
    const sessionMessages = session.chats.flatMap(chat => [
      {
        id: `msg_${chat.id}_user`,
        role: 'user',
        content: chat.cauHoi,
        timestamp: chat.timestamp,
      },
      {
        id: `msg_${chat.id}_bot`,
        role: 'assistant',
        content: chat.cauTraLoi,
        timestamp: chat.timestamp,
      }
    ]);

    // Load session using hook
    loadSession(session.id, sessionMessages);
    
    // Close sidebar on mobile
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        onNewChat={handleNewChat}
        currentSessionId={sessionId}
        refreshTrigger={refreshSidebar}
        onLoadSession={handleLoadSession}
      />

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header - Minimalist like Gemini */}
        <header className="flex items-center justify-between px-6 py-4 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-700/50 h-[73px]">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
              aria-label="Menu"
            >
              <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
            
            {/* Logo + Title */}
            <Logo className="w-10 h-10" />
            <h1 className="text-lg font-semibold leading-none bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              EduBot Pro
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* New Chat button - minimal */}
            <button
              onClick={handleNewChat}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all shadow-sm hover:shadow-md text-sm font-medium"
              title="Bắt đầu chat mới"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Mới</span>
            </button>

            {/* Settings Dropdown */}
            <SettingsDropdown
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
              onLogout={onLogout}
            />
          </div>
        </header>

          {/* Error banner */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 px-4 py-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
              <button
                onClick={clearError}
                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Messages container - Gemini style */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              {/* Gemini-style welcome */}
              <div className="mb-8 relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white dark:border-gray-900"></div>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-4">
                Chào bạn! Tôi có thể giúp gì?
              </h2>
              
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mb-8 text-lg">
                Tôi là trợ lý AI tư vấn tuyển sinh đại học. Hãy hỏi tôi về điểm chuẩn, ngành học, trường đại học hoặc tư vấn hướng nghiệp.
              </p>

              {/* Suggested prompts - Gemini style */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl w-full px-4">
                {[
                  { icon: '🎓', text: 'Điểm chuẩn CNTT Bách Khoa 2024?', color: 'from-blue-500 to-cyan-500' },
                  { icon: '🏫', text: 'Thông tin về ĐH Kinh tế Quốc dân', color: 'from-purple-500 to-pink-500' },
                  { icon: '💼', text: 'Tư vấn ngành học phù hợp', color: 'from-orange-500 to-red-500' },
                  { icon: '📚', text: 'So sánh các trường đại học', color: 'from-green-500 to-emerald-500' },
                ].map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => sendMessage(prompt.text)}
                    className="group relative p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-transparent hover:shadow-xl transition-all duration-300 text-left overflow-hidden"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${prompt.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                    <div className="relative flex items-start gap-3">
                      <span className="text-2xl">{prompt.icon}</span>
                      <p className="text-sm text-gray-700 dark:text-gray-300 font-medium group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                        {prompt.text}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto px-4 py-6">
              {messages.map((message) => (
                <Message key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input area - Gemini style */}
        <div className="border-t border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80">
          <div className="max-w-4xl mx-auto px-4">
            <ChatInput
              onSend={sendMessage}
              disabled={isLoading}
              placeholder="Nhập câu hỏi của bạn..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;

