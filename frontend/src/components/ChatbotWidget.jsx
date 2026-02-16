import { useState, useEffect, useRef } from 'react';
import { askChatbot, checkChatbotHealth } from '../services/chatbotService';

export default function ChatbotWidget() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Hello! I\'m here to help you with information about ICT Fest 2024. Ask me anything!',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isServiceActive, setIsServiceActive] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Check if chatbot service is running
    const checkHealth = async () => {
      const isHealthy = await checkChatbotHealth();
      setIsServiceActive(isHealthy);
    };
    checkHealth();
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await askChatbot(input);
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: response.answer,
        sources: response.sources,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: 'Sorry, I encountered an error. Please make sure the chatbot service is running.',
        isError: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsServiceActive(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex h-full flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#e50914] via-[#b00020] to-[#8b0018] px-6 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">IUT Assistant</h2>
              <div className="flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${
                    isServiceActive ? 'bg-green-400' : 'bg-red-400'
                  }`}
                ></div>
                <span className="text-xs text-white/80">
                  {isServiceActive ? 'Online' : 'Offline - Start the service'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-4xl space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.type === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-md ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-[#e50914] to-[#b00020] text-white'
                    : message.isError
                    ? 'bg-red-100 text-red-800'
                    : 'bg-white text-gray-800'
                }`}
              >
                <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                  {message.text}
                </p>
                
                {/* Sources */}
                {message.sources && message.sources.length > 0 && (
                  <div className="mt-3 border-t border-gray-200 pt-3">
                    <p className="mb-2 text-xs font-semibold text-gray-600">
                      Sources:
                    </p>
                    <div className="space-y-2">
                      {message.sources.map((source, idx) => (
                        <div
                          key={idx}
                          className="rounded-lg bg-gray-50 p-2 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-700">
                              {source.source_file}
                            </span>
                            <span className="text-gray-500">
                              Page {source.page}
                            </span>
                          </div>
                          <p className="mt-1 text-gray-600">
                            {source.content_preview}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <p className="mt-1 text-right text-xs opacity-70">
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-white px-4 py-3 shadow-md">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                  <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 delay-75"></div>
                  <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 delay-150"></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white px-4 py-4 shadow-lg">
        <div className="mx-auto max-w-4xl">
          {!isServiceActive && (
            <div className="mb-3 rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800">
              <p className="font-semibold">⚠️ Chatbot service is not running</p>
              <p className="mt-1 text-xs">
                Please start the Flask server: <code className="rounded bg-yellow-100 px-1">cd frontend/src/pages/Chatbot && python app.py</code>
              </p>
            </div>
          )}
          
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your question here..."
                className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-[#e50914] focus:outline-none focus:ring-2 focus:ring-[#e50914]/20"
                rows={1}
                disabled={isLoading || !isServiceActive}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim() || !isServiceActive}
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-[#e50914] to-[#b00020] text-white shadow-md transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <svg
                  className="h-5 w-5 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
