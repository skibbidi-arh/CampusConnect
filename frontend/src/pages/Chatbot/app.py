from flask import Flask, request, jsonify
from flask_cors import CORS
from src.search import RAGSearch

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize RAG Search (handles vectorstore, LLM, and document loading)
rag_search = RAGSearch(
    persist_dir="./data/vector_store",
    embedding_model="all-MiniLM-L6-v2",
    llm_model="llama-3.3-70b-versatile"  # Llama 3.3 70B via Groq API
)

print(f"[INFO] RAG Search initialized with {rag_search.vectorstore.collection.count()} documents.")

@app.route('/')
def home():
    return jsonify({
        'status': 'running',
        'message': 'CampusConnect Chatbot API is running',
        'endpoints': {
            '/ask': 'POST - Send a query to the chatbot'
        }
    })

@app.route('/ask', methods=['POST'])
def ask():
    data = request.json
    query = data.get('query', '')
    top_k = data.get('top_k', 5)  # Increased from 3 to 5 for better context
    
    if not query:
        return jsonify({'error': 'Query cannot be empty'}), 400
    
    result = rag_search.ask(query, top_k=top_k)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
