import React, { useState, useEffect, useContext } from 'react';
import axios from "axios";
import { signInWithGoogle, auth } from '../../config.js';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { AlertTriangle, X } from 'lucide-react'; 
import '../index.css'

const ErrorToast = ({ isVisible, message, onClose }) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 5000); 
            return () => clearTimeout(timer); 
        }
    }, [isVisible, onClose]);

    const visibilityClasses = isVisible 
        ? 'translate-x-0 opacity-100' 
        : 'translate-x-full opacity-0 pointer-events-none';

    return (
        <div 
            className={`fixed top-6 right-6 z-[999] p-4 max-w-sm w-full 
                        bg-white border-l-4 border-red-600 rounded-lg shadow-xl 
                        transform transition-all duration-500 ease-in-out ${visibilityClasses}`}
            role="alert"
        >
            <div className="flex items-start">
                
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                
                <div className="ml-3 flex-1">
                    <p className="text-sm font-bold text-red-800">Authentication Error</p>
                    <p className="mt-1 text-sm text-gray-700">
                        {message}
                    </p>
                </div>
                
                <div className="ml-4 flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="p-1 rounded-md inline-flex text-gray-400 hover:text-red-500 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition"
                        aria-label="Close notification"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Login Component ---

const BACKEND_URL = 'http://localhost:4000/api/auth/verify-domain';
export default function Login() {
  const {User,setUser} = AuthContext()
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async() => {
    console.log('hocche');
    try {
      
      const userCredential = await signInWithGoogle();
      console.log(userCredential);
      const firebaseIdToken = await userCredential.user.getIdToken();
      
      const response = await axios.post(BACKEND_URL, {
        token: firebaseIdToken
      }, {
        withCredentials: true
      });
      console.log(response?.data);
      setUser(response?.data?.user);
      localStorage.setItem('user',JSON.stringify(response?.data?.user));
      navigate('/dashboard');

    } catch (error) {
      const backendErrorMsg = error.response?.data?.message;
      const msg = backendErrorMsg || error.message || 'An unknown sign-in error occurred.';
      console.log(msg);
      setErrorMessage(msg);
    }
  };

  const clearError = () => {
    setErrorMessage('');
  };

   return (
    <main className="grid min-h-screen w-full grid-cols-1 bg-white md:grid-cols-2">
      <section className="relative flex items-center justify-center bg-gradient-to-br from-[#e50914] via-[#b00020] to-[#8b0018] p-8 text-white">
        <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:20px_20px]" aria-hidden="true" />

        <div className="relative z-10 w-full max-w-md rounded-2xl bg-white/10 p-8 shadow-2xl backdrop-blur-md animate-[pop-in_550ms_cubic-bezier(0.22,1,0.36,1)_both]">
          <h2 className="mb-4 text-2xl font-bold tracking-wide">Sign in</h2>

          <button
            onClick={handleSubmit}
            type="button"
            aria-label="Login with Google"
            className="inline-flex w-full items-center gap-3 rounded-xl border-2 border-white bg-white px-4 py-3 text-[#b00020] shadow-xl transition-transform hover:-translate-y-0.5 hover:shadow-2xl active:translate-y-0 active:scale-[0.98]"
          >
            <span aria-hidden="true" className="grid h-5 w-5 place-items-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.04 12.261c0-.851-.076-1.669-.218-2.452H12v4.642h6.202c-.267 1.438-1.078 2.655-2.292 3.469v2.882h3.712c2.173-2.002 3.418-4.957 3.418-8.543z" fill="#4285F4"/>
                <path d="M12 24c3.096 0 5.69-1.026 7.587-2.782l-3.712-2.882c-1.033.695-2.352 1.104-3.875 1.104-2.982 0-5.51-2.013-6.413-4.72H1.779v2.968C3.665 21.44 7.512 24 12 24z" fill="#34A853"/>
                <path d="M5.587 14.72A7.246 7.246 0 014.96 12c0-.948.164-1.866.451-2.72V6.312H1.779A11.972 11.972 0 000 12c0 1.93.46 3.754 1.279 5.388l4.308-2.668z" fill="#FBBC05"/>
                <path d="M12 4.749c1.682 0 3.19.58 4.378 1.717l3.284-3.284C17.686 1.245 15.092 0 12 0 7.512 0 3.665 2.56 1.279 6.612l4.308 2.668C6.49 6.762 9.018 4.749 12 4.749z" fill="#EA4335"/>
              </svg>
            </span>
            <span className="font-semibold">Login with Google</span>
          </button>

          <p className="mt-3 text-sm italic text-[#ffdde3]">“login with only iut mail”</p>
        </div>
      </section>

      <section className="flex items-center justify-center bg-white p-8 text-[#b00020]">
        <div className="animate-[fade-up_700ms_ease-out_both] max-w-xl text-center">
          <h1 className="text-balance text-4xl font-extrabold tracking-wide capitalize md:text-6xl [text-shadow:0_0_0_rgba(176,0,32,0)] animate-[glow_3s_ease-in-out_infinite]">
            welcome to the iutians portal
          </h1>
          <div className="mx-auto mt-4 h-1 w-40 rounded-full bg-gradient-to-r from-[#e50914] to-[#b00020]" />
        </div>
      </section>

      <style>{`
        @keyframes pop-in { 0% { opacity: 0; transform: scale(0.92);} 100% { opacity: 1; transform: scale(1);} }
        @keyframes fade-up { 0% { opacity: 0; transform: translateY(12px);} 100% { opacity: 1; transform: translateY(0);} }
        @keyframes glow { 0% { text-shadow: 0 0 0 rgba(176,0,32,0); } 50% { text-shadow: 0 6px 24px rgba(176,0,32,0.25); } 100% { text-shadow: 0 0 0 rgba(176,0,32,0);} }
      `}</style>
    </main>
  )
}