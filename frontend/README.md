# Educational Chatbot Frontend

React frontend với Vite, Tailwind CSS, thiết kế giống Gemini.

## 🎯 Tính năng

- ✅ Giao diện chat đẹp, hiện đại (giống Gemini)
- ✅ Dark mode / Light mode
- ✅ Authentication (Login/Register)
- ✅ Real-time chat với AI
- ✅ Markdown rendering với code syntax highlighting
- ✅ Responsive mobile & desktop
- ✅ Auto-scroll tin nhắn
- ✅ Textarea tự động co giãn
- ✅ Loading states & error handling
- ✅ Warning message highlighting

## 🛠️ Tech Stack

- **React 19** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Markdown** - Markdown rendering
- **Lucide React** - Icons

## 📦 Setup & Run

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Configure environment

Tạo file `.env`:

```bash
VITE_API_URL=http://localhost:8080/api
VITE_CHATBOT_URL=http://localhost:5000
```

### 3. Run development server

```bash
npm run dev
```

Server sẽ chạy tại: `http://localhost:5173`

### 4. Build for production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
frontend/src/
├── components/
│   ├── ChatWindow.jsx      # Main chat interface
│   ├── Message.jsx          # Message bubble component
│   ├── ChatInput.jsx        # Input area with auto-resize
│   ├── Login.jsx            # Login form
│   └── Register.jsx         # Register form
│
├── hooks/
│   └── useChat.js           # Chat state management hook
│
├── services/
│   └── api.js               # API calls (axios)
│
├── App.jsx                  # Main app with routing
├── main.jsx                 # Entry point
└── index.css                # Tailwind + custom styles
```

## 🎨 Features Detail

### Chat Interface
- Tin nhắn user: màu xanh, avatar User
- Tin nhắn bot: màu xám, avatar Bot
- Tin nhắn warning: màu vàng với icon cảnh báo
- Loading state: "Đang suy nghĩ..." với spinner

### Input Area
- **Enter**: Gửi tin nhắn
- **Shift + Enter**: Xuống dòng
- Auto-resize khi gõ nhiều dòng
- Disable khi đang chờ response

### Dark Mode
- Toggle button ở header
- Lưu preference vào localStorage
- Tự động detect system preference

### Authentication
- Login/Register forms
- JWT token authentication
- Auto-save token to localStorage
- Demo account provided

## 🔌 API Integration

### Backend APIs (Spring Boot - Port 8080)
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `POST /api/chat` - Send message (calls Flask AI)
- `GET /api/lich-su-chat/user/:id` - Get chat history

### Flask AI APIs (Port 5000)
- `POST /api/chat` - Direct chat with AI
- `GET /health` - Health check

## 🧪 Testing

### Demo Account
```
Email: nguyenvana@example.com
Password: password123
```

### Test Chat
1. Login với demo account
2. Hỏi: "Điểm chuẩn CNTT Bách Khoa 2024?"
3. Hỏi: "Tư vấn ngành học cho tôi"
4. Hỏi: "Thông tin về Đại học Kinh tế Quốc dân"

## 📱 Responsive Design

- **Mobile**: Menu button, compact header
- **Tablet**: 2-column layout (optional sidebar)
- **Desktop**: Full width chat, sidebar navigation

## 🎨 Tailwind Customization

Custom classes in `index.css`:
- `.scrollbar-thin` - Custom scrollbar
- `.markdown-body` - Markdown styling
- Dark mode classes với `dark:` prefix

## 🚀 Deployment

### Vercel/Netlify
```bash
npm run build
# Upload dist/ folder
```

### Environment Variables
Set in deployment platform:
- `VITE_API_URL` - Backend URL
- `VITE_CHATBOT_URL` - Flask AI URL

## 🐛 Troubleshooting

### CORS Error
- Kiểm tra backend CORS configuration
- Đảm bảo `http://localhost:5173` được allow

### API Connection Error
- Kiểm tra backend đang chạy (port 8080)
- Kiểm tra Flask AI đang chạy (port 5000)
- Kiểm tra `.env` file

### Dark Mode không hoạt động
- Xóa localStorage và reload
- Kiểm tra `tailwind.config.js` có `darkMode: 'class'`

## 📚 Libraries Used

```json
{
  "react": "^19.1.1",
  "react-dom": "^19.1.1",
  "react-markdown": "^9.0.1",
  "lucide-react": "^0.263.1",
  "axios": "^1.6.2",
  "tailwindcss": "^3.4.0"
}
```

## ✨ Future Enhancements

- [ ] Chat history sidebar
- [ ] Voice input
- [ ] File upload
- [ ] Export chat history
- [ ] Multiple chat sessions
- [ ] Search trong chat
- [ ] Admin panel

---

**Status: ✅ Ready to Use**

Frontend running on: `http://localhost:5173`
