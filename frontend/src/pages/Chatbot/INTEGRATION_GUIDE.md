# Chatbot Integration Guide

## 🚀 Setup Instructions

Follow these steps to get your chatbot up and running:

### 1. Install Python Dependencies

Navigate to the chatbot directory and set up the virtual environment:

```powershell
cd frontend\src\pages\Chatbot
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Create a `.env` file in `frontend/src/pages/Chatbot/` if it doesn't exist:

```env
GROQ_API_KEY=your_actual_groq_api_key_here
```

### 3. Configure Frontend Environment

Create or update `frontend/.env`:

```env
VITE_CHATBOT_API_URL=http://localhost:5000
```

### 4. Start the Flask Backend

In the chatbot directory (with venv activated):

```powershell
python app.py
```

The Flask server will start on `http://localhost:5000`

### 5. Start the Frontend

In a new terminal, navigate to the frontend directory:

```powershell
cd frontend
npm run dev
# or
pnpm dev
```

### 6. Access the Chatbot

1. Open your browser and go to your frontend URL (usually `http://localhost:5173`)
2. Login to your application
3. Navigate to `/chatbot` or click on the "AI Chatbot" card from the dashboard
4. Start chatting!

## 📁 File Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── ChatbotWidget.jsx        # Main chatbot UI component
│   ├── pages/
│   │   └── Chatbot/                 # Chatbot module
│   │       ├── ChatbotPage.jsx      # Chatbot page component
│   │       ├── app.py               # Flask server
│   │       ├── requirements.txt     # Python dependencies
│   │       ├── .env                 # API keys
│   │       ├── venv/                # Virtual environment
│   │       ├── src/
│   │       │   ├── embedding.py
│   │       │   ├── vectorstore.py
│   │       │   ├── dataloader.py
│   │       │   └── search.py
│   │       └── data/
│   │           ├── pdf/             # Place your PDF documents here
│   │           └── vector_store/    # ChromaDB storage
│   ├── services/
│   │   └── chatbotService.js        # API service for chatbot
│   └── App.jsx                      # Updated with chatbot route
└── .env                             # Frontend environment variables
```

## 🔧 How It Works

1. **Flask Backend (Python)**:
   - Loads PDF documents from `data/pdf/` folder
   - Creates embeddings using `sentence-transformers`
   - Stores vectors in ChromaDB
   - Uses GROQ's LLM for RAG (Retrieval-Augmented Generation)
   - Exposes `/ask` endpoint for queries

2. **React Frontend**:
   - `chatbotService.js` - Handles API calls to Flask backend
   - `ChatbotWidget.jsx` - Beautiful chat interface with message history
   - `ChatbotPage.jsx` - Full-page wrapper for the chatbot

3. **Data Flow**:
   ```
   User Question → React UI → chatbotService.js → Flask API 
   → Vector Search → LLM Processing → Response with Sources → React UI
   ```

## 📝 Features

✅ Real-time chat interface  
✅ Source citations with page numbers  
✅ Service health monitoring  
✅ Loading states and error handling  
✅ Beautiful gradient UI matching your app theme  
✅ Responsive design  
✅ Message timestamps  
✅ Auto-scroll to latest message  

## 🎨 Customization

### Adding More Documents

Simply place PDF files in `frontend/src/pages/Chatbot/data/pdf/` folder. The vector store will be rebuilt automatically when the Flask server starts if it's empty.

### Changing the LLM Model

In `app.py`, update the model name:

```python
llm = ChatGroq(
    temperature=0,
    groq_api_key=groq_api_key,
    model_name="your-preferred-model"  # Change this
)
```

### Adjusting UI Colors

The chatbot UI uses your app's red gradient theme. To customize, edit the Tailwind classes in `ChatbotWidget.jsx`:

```jsx
// Current theme colors
from-[#e50914] via-[#b00020] to-[#8b0018]
```

## 🐛 Troubleshooting

### Chatbot shows "Offline"
- Ensure Flask server is running on port 5000
- Check if `python app.py` is active in the Chatbot directory
- Verify CORS is enabled in `app.py`

### No response from chatbot
- Check console for errors
- Verify GROQ_API_KEY is set correctly
- Ensure vector store has documents (check Flask console output)

### Import errors in Python
- Activate virtual environment: `venv\Scripts\activate`
- Reinstall dependencies: `pip install -r requirements.txt`

### Port 5000 already in use
- Change port in `app.py`: `app.run(debug=True, port=5001)`
- Update `VITE_CHATBOT_API_URL` in frontend `.env`

## 🚀 Production Deployment

For production, consider:

1. **Use Gunicorn** instead of Flask dev server:
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:5000 app:app
   ```

2. **Environment Variables**: Store API keys securely in your hosting platform

3. **CORS Configuration**: Update CORS origins to allow only your production domain

4. **Separate Services**: Host Flask backend separately from React frontend

## 💡 Tips

- The chatbot currently knows about ICT Fest 2024 based on the PDF in the data folder
- Add more PDFs to expand the knowledge base
- Clear the `data/vector_store/` folder to force rebuilding the index
- Use `top_k` parameter in API calls to get more/fewer source documents

## 📞 Support

If you encounter any issues, check:
1. Flask server logs in the terminal
2. Browser console for frontend errors
3. Network tab to see API request/response

---

**Happy Chatting! 🤖**
