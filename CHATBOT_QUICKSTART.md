# 🚀 Quick Start - Chatbot Integration

## One-Time Setup (5 minutes)

1. **Navigate to chatbot folder:**
   ```powershell
   cd frontend\src\pages\Chatbot
   ```

2. **Run the startup script:**
   ```powershell
   start_chatbot.bat
   ```
   OR manually:
   ```powershell
   python -m venv venv
   venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Configure your API key:**
   - Open `.env` file in the Chatbot folder
   - Add your GROQ API key:
     ```
     GROQ_API_KEY=your_actual_key_here
     ```

## Daily Use

### Start Backend (Terminal 1):
```powershell
cd frontend\src\pages\Chatbot
venv\Scripts\activate
python app.py
```
✅ Flask server running on http://localhost:5000

### Start Frontend (Terminal 2):
```powershell
cd frontend
npm run dev
```
✅ Frontend running on http://localhost:5173

### Access Chatbot:
1. Login to your app
2. Go to `/chatbot` or click "AI Chatbot" from dashboard
3. Start chatting! 🎉

## Files Created/Modified

✅ `frontend/src/services/chatbotService.js` - API service  
✅ `frontend/src/components/ChatbotWidget.jsx` - Chat UI  
✅ `frontend/src/pages/ChatbotPage.jsx` - Chat page  
✅ `frontend/src/App.jsx` - Added chatbot route  
✅ `frontend/src/pages/Chatbot/app.py` - Added CORS  
✅ `frontend/src/pages/Chatbot/requirements.txt` - Added flask-cors  
✅ `frontend/src/pages/Chatbot/start_chatbot.bat` - Startup script  
✅ `frontend/src/pages/Chatbot/README.md` - Backend docs  
✅ `frontend/src/pages/Chatbot/INTEGRATION_GUIDE.md` - Full guide  

## Verification Checklist

- [ ] Virtual environment created and activated
- [ ] All Python packages installed
- [ ] `.env` file exists with GROQ_API_KEY
- [ ] Flask server starts without errors
- [ ] Frontend shows chatbot at `/chatbot` route
- [ ] Status indicator shows "Online" (green dot)
- [ ] Messages send and receive successfully

## Common Issues

**"Offline" status:**
→ Start Flask server: `python app.py`

**Import errors:**
→ Activate venv: `venv\Scripts\activate`

**No response:**
→ Check GROQ_API_KEY in `.env`

**Port conflict:**
→ Change port in `app.py` line 84

---

Need detailed help? See [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)
