import { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ChatbotWidget from '../../components/ChatbotWidget';
import GoBackButton from '../../components/GoBackButton';
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
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 via-red-50 to-gray-50">
      <Header
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        showMenuButton={false}
        handlelogout={handleLogout}
        onProfileClick={() => navigate('/profile')}
      />

      <main className="flex-1">
        <div className="mx-auto flex h-[calc(100vh-6rem)] max-w-3xl flex-col px-4 py-4 sm:px-6">
          <div className="mb-3 flex items-start gap-4">
            <GoBackButton />
            <div className="flex-1 text-center">
              <div className="mb-2 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-red-600 to-rose-600 p-2 shadow-lg">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Campus AI Assistant</h1>
              <p className="mt-1 text-xs text-gray-600">
                Your intelligent companion for campus information
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-hidden rounded-3xl shadow-2xl ring-1 ring-gray-900/5">
            <ChatbotWidget />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
