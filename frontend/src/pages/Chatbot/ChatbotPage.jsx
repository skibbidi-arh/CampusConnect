import { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ChatbotWidget from '../../components/ChatbotWidget';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router';

export default function ChatbotPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { User, logout } = AuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('Logging out user:', User);
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        showMenuButton={false}
        handlelogout={handleLogout}
        onProfileClick={() => navigate('/profile')}
      />

      <main className="flex-1">
        <div className="mx-auto h-[calc(100vh-8rem)] max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">IUT Assistant Chatbot</h1>
            <p className="mt-2 text-gray-600">
              Ask me anything about ICT Fest 2024, sponsorships, events, and more!
            </p>
          </div>

          <div className="h-[calc(100%-5rem)] overflow-hidden rounded-2xl shadow-2xl">
            <ChatbotWidget />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
