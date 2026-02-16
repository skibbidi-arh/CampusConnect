import os
from dotenv import load_dotenv
from src.vectorstore import ChromaVectorStore
from langchain_groq import ChatGroq

load_dotenv()

class RAGSearch:
    def __init__(self, persist_dir: str = "./data/vector_store", embedding_model: str = "all-MiniLM-L6-v2", llm_model: str = "llama-3.3-70b-versatile"):
        self.vectorstore = ChromaVectorStore(persist_dir=persist_dir, embedding_model=embedding_model)
        
        # Check if vector store has documents, if not build it
        if self.vectorstore.collection.count() == 0:
            from src.dataloader import load_all_documents
            print("[INFO] Vector store is empty. Building from documents...")
            docs = load_all_documents("data")
            self.vectorstore.build_from_documents(docs)
        
        groq_api_key = os.getenv("GROQ_API_KEY")
        if not groq_api_key:
            raise ValueError("GROQ_API_KEY environment variable is not set")
        
        # Initialize LLM with proper temperature for consistent, factual responses
        self.llm = ChatGroq(
            groq_api_key=groq_api_key, 
            model_name=llm_model,
            temperature=0.1,  # Low temperature for factual, consistent responses
            max_tokens=1024
        )
        print(f"[INFO] Groq LLM initialized: {llm_model}")

    def search_and_summarize(self, query: str, top_k: int = 5) -> str:
        results = self.vectorstore.query(query, top_k=top_k)
        texts = [r["content"] for r in results]
        context = "\n\n".join(texts)
        if not context:
            return "No relevant documents found."
        prompt = f"""Summarize the following context for the query: '{query}'\n\nContext:\n{context}\n\nSummary:"""
        response = self.llm.invoke(prompt)
        return response.content
    
    def ask(self, query: str, top_k: int = 5) -> dict:
        """
        Advanced RAG function that returns answer with sources and context.
        
        Args:
            query: The user's question
            top_k: Number of documents to retrieve (default: 5)
            
        Returns:
            dict with keys: answer, sources, context
        """
        results = self.vectorstore.query(query, top_k=top_k)
        
        if not results:
            return {
                "answer": "I don't have information about that in my knowledge base. Please ask questions related to ICT Fest 2024, IUT Computer Society, events, or sponsorships.",
                "sources": [],
                "context": ""
            }
        
        # Extract context from results
        context = "\n\n".join([result['content'] for result in results])
        
        # Create improved prompt with clear instructions
        prompt = f"""You are a helpful assistant for IUT Computer Society and ICT Fest 2024. 
Answer the question based ONLY on the context provided below. Be specific, accurate, and informative.

If the context doesn't contain relevant information to answer the question, say "I don't have specific information about that in my knowledge base."

Context:
{context}

Question: {query}

Answer:"""
        
        try:
            response = self.llm.invoke(prompt)
            answer = response.content
        except Exception as e:
            print(f"[ERROR] LLM invocation failed: {str(e)}")
            answer = "I encountered an error processing your question. Please try again."
        
        # Prepare source information
        sources = []
        for result in results:
            metadata = result.get('metadata', {})
            content = result.get('content', '')
            source_info = {
                "source_file": metadata.get('source_file', 'Unknown'),
                "page": metadata.get('page', 'Unknown'),
                "similarity_score": result.get('similarity_score', 0),
                "content_preview": content[:200] + "..." if len(content) > 200 else content
            }
            sources.append(source_info)
        
        return {
            "answer": answer,
            "sources": sources,
            "context": context
        }