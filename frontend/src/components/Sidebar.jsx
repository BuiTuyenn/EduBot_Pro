import React, { useState, useEffect } from 'react';
import { PlusCircle, MessageSquare, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { historyAPI } from '../services/api';
import Logo from './Logo';

const Sidebar = ({ isOpen, onToggle, onNewChat, currentSessionId, refreshTrigger, onLoadSession }) => {
  const [chatSessions, setChatSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load chat history on mount
  useEffect(() => {
    loadChatHistory();
  }, []);

  // Reload chat history when refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger > 0) {
      console.log('🔄 Refreshing chat history due to trigger:', refreshTrigger);
      loadChatHistory();
    }
  }, [refreshTrigger]);

  const loadChatHistory = async () => {
    setIsLoading(true);
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        console.log('❌ No user found in localStorage');
        setIsLoading(false);
        return;
      }

      const user = JSON.parse(userStr);
      console.log('📋 Full User data from localStorage:', user);
      console.log('📋 User keys:', Object.keys(user));
      
      // Try different possible user ID fields
      const userId = user.userId || user.id;
      
      console.log('🔑 Extracted userId:', userId);
      
      if (!userId) {
        console.error('❌ User ID not found in user object:', user);
        console.error('❌ Available fields:', Object.keys(user));
        setIsLoading(false);
        return;
      }

      console.log('📡 Fetching chat history for userId:', userId);
      const history = await historyAPI.getRecentHistory(userId);
      console.log('✅ Chat history received:', history);
      console.log('📊 Number of history items:', history?.length || 0);
      
      // Group by session (timestamp-based grouping)
      const sessions = groupChatsBySession(history);
      console.log('📦 Grouped sessions:', sessions);
      console.log('📊 Number of sessions:', sessions?.length || 0);
      setChatSessions(sessions);
    } catch (error) {
      console.error('❌ Error loading chat history:', error);
      console.error('❌ Error details:', error.response?.data || error.message);
      // Don't show error to user, just log it
      setChatSessions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const groupChatsBySession = (history) => {
    // Group by sessionId
    const sessionMap = new Map();
    
    history.forEach((chat) => {
      const sessionKey = chat.sessionId || `session_${chat.id}`;
      
      if (!sessionMap.has(sessionKey)) {
        sessionMap.set(sessionKey, {
          id: sessionKey,
          title: chat.cauHoi.substring(0, 50) + (chat.cauHoi.length > 50 ? '...' : ''),
          timestamp: chat.timestamp,
          chats: [chat],
        });
      } else {
        sessionMap.get(sessionKey).chats.push(chat);
      }
    });
    
    // Convert to array and sort by timestamp (most recent first)
    const sessions = Array.from(sessionMap.values())
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    return sessions;
  };

  const handleDeleteSession = async (sessionId, e) => {
    e.stopPropagation();
    
    if (confirm('Bạn có chắc muốn xóa cuộc trò chuyện này?')) {
      try {
        // Delete all chats in session
        const session = chatSessions.find(s => s.id === sessionId);
        if (session) {
          for (const chat of session.chats) {
            await historyAPI.deleteHistory(chat.id);
          }
        }
        
        // Reload history
        loadChatHistory();
        
        // Start new chat if deleted current session
        if (sessionId === currentSessionId) {
          onNewChat();
        }
      } catch (error) {
        console.error('Error deleting session:', error);
      }
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Hôm nay';
    } else if (diffDays === 1) {
      return 'Hôm qua';
    } else if (diffDays < 7) {
      return `${diffDays} ngày trước`;
    } else {
      return date.toLocaleDateString('vi-VN');
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative top-0 left-0 h-full bg-white dark:bg-gray-800 border-r dark:border-gray-700 transition-transform duration-300 z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isOpen ? 'w-80' : 'lg:w-80'}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b dark:border-gray-700 h-[73px]">
            <div className="flex items-center gap-3">
              <Logo className="w-10 h-10" />
              <h2 className="font-semibold text-lg leading-none text-gray-900 dark:text-gray-100">
              </h2>
            </div>
            <button
              onClick={onToggle}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          {/* New Chat Button */}
          <div className="px-6 py-4">
            <button
              onClick={() => {
                onNewChat();
                if (window.innerWidth < 1024) {
                  onToggle();
                }
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              <PlusCircle className="w-5 h-5" />
              Chat mới
            </button>
          </div>

          {/* Chat Sessions List */}
          <div className="flex-1 overflow-y-auto scrollbar-thin px-3 pb-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : chatSessions.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Chưa có lịch sử chat</p>
              </div>
            ) : (
              <div className="space-y-2">
                {chatSessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => onLoadSession && onLoadSession(session)}
                    className={`group relative p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                      session.id === currentSessionId
                        ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                        : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <MessageSquare className="w-4 h-4 mt-1 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {session.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {formatDate(session.timestamp)} • {session.chats.length} tin nhắn
                        </p>
                      </div>
                      <button
                        onClick={(e) => handleDeleteSession(session.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-opacity"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Toggle button for desktop when sidebar closed */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="hidden lg:block fixed left-0 top-1/2 -translate-y-1/2 p-2 bg-white dark:bg-gray-800 border-r border-t border-b dark:border-gray-700 rounded-r-lg shadow-lg z-30 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      )}
    </>
  );
};

export default Sidebar;

