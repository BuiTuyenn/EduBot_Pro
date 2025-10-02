import React, { useState, useRef, useEffect } from 'react';
import { Settings, User, Moon, Sun, LogOut, ChevronDown } from 'lucide-react';
import { authAPI } from '../services/api';

const SettingsDropdown = ({ darkMode, toggleDarkMode, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const user = authAPI.getCurrentUser();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsOpen(false);
    onLogout();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Settings Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        aria-label="Settings"
      >
        <div className="flex items-center gap-2">
          {/* User Avatar */}
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
            {user?.ten?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <ChevronDown
            className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-700 overflow-hidden z-50">
          {/* User Info Section */}
          <div className="px-4 py-3 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                {user?.ten?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {user?.ten || 'User'}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {/* Profile/Account */}
            <button
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
              onClick={() => {
                setIsOpen(false);
                // Navigate to profile (implement later)
              }}
            >
              <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Tài khoản
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Quản lý thông tin cá nhân
                </p>
              </div>
            </button>

            {/* Theme Toggle */}
            <button
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
              onClick={() => {
                toggleDarkMode();
              }}
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {darkMode ? 'Chế độ sáng' : 'Chế độ tối'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Chuyển đổi giao diện
                </p>
              </div>
            </button>

            {/* Settings */}
            <button
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
              onClick={() => {
                setIsOpen(false);
                // Navigate to settings (implement later)
              }}
            >
              <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Cài đặt
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Tùy chỉnh ứng dụng
                </p>
              </div>
            </button>
          </div>

          {/* Logout Section */}
          <div className="border-t dark:border-gray-700 py-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
            >
              <LogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-600 dark:text-red-400">
                  Đăng xuất
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Thoát khỏi tài khoản
                </p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsDropdown;

