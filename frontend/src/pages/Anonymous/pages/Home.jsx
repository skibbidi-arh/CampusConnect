// src/pages/Anonymous/pages/Home.jsx
import { CATEGORIES } from "../constants/categories";
import CategoryCard from "../components/CategoryCard";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import GoBackButton from "../../../components/GoBackButton";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();

    const handleSubmitClick = () => {
        navigate('/submit');
    };

    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-white via-red-50/20 to-gray-50">
            <Header showMenuButton={false} />

            <main className="container mx-auto flex-1 px-4 py-6 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-[1400px]">
                    
                    <div className="relative mb-10 overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 to-red-700 p-8 shadow-2xl shadow-red-500/20 sm:p-10 lg:p-12">
                        <div 
                            className="absolute inset-0 opacity-10"
                            style={{
                                backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)`,
                                backgroundSize: '50px 50px'
                            }}
                            aria-hidden="true"
                        />
                        
                        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex items-start gap-4">
                                <div className="mt-1">
                                    <GoBackButton />
                                </div>
                                <div className="space-y-3">
                                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                                        Anonymous Feedback
                                    </h1>
                                    <p className="max-w-2xl text-base text-red-50 sm:text-lg">
                                        Your voice matters. Browse feedback by category or share your thoughts safely and anonymously. Every opinion counts.
                                    </p>
                                    <div className="flex flex-wrap items-center gap-4 pt-2">
                                        <div className="flex items-center gap-2 text-white">
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                            <span className="text-sm font-medium">100% Anonymous</span>
                                        </div>
                                        <div className="h-4 w-px bg-white/30" />
                                        <div className="flex items-center gap-2 text-white">
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                            <span className="text-sm font-medium">Secure & Safe</span>
                                        </div>
                                        <div className="h-4 w-px bg-white/30" />
                                        <div className="flex items-center gap-2 text-white">
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                            <span className="text-sm font-medium">Quick & Easy</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleSubmitClick}
                                className="
                                    group inline-flex items-center justify-center gap-2 
                                    rounded-xl bg-white
                                    px-8 py-4 text-base font-bold text-red-600
                                    shadow-xl shadow-black/10
                                    transition-all duration-300 ease-in-out
                                    hover:scale-105 hover:shadow-2xl hover:shadow-black/20
                                    active:scale-95
                                    focus:outline-none focus:ring-4 focus:ring-white/50
                                    whitespace-nowrap
                                "
                                aria-label="Submit new feedback"
                            >
                                <svg 
                                    className="h-5 w-5 transition-transform group-hover:rotate-90" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2.5} 
                                        d="M12 4v16m8-8H4" 
                                    />
                                </svg>
                                Submit Feedback
                                <svg 
                                    className="h-5 w-5 transition-transform group-hover:translate-x-1" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2.5} 
                                        d="M9 5l7 7-7 7" 
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Browse Categories</h2>
                            <p className="mt-1 text-sm text-gray-600">Select a category to view feedback</p>
                        </div>
                        <div className="hidden items-center gap-2 text-sm text-gray-600 sm:flex">
                            <span className="font-medium text-red-600">{CATEGORIES.length}</span>
                            <span>Categories Available</span>
                        </div>
                    </div>

                    <div className="relative mb-10">
                        <div 
                            className="pointer-events-none absolute -inset-6 opacity-30"
                            style={{
                                backgroundImage: `radial-gradient(circle at 2px 2px, rgb(239 68 68 / 0.08) 1px, transparent 0)`,
                                backgroundSize: '40px 40px'
                            }}
                            aria-hidden="true"
                        />

                        <div className="relative grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                            {CATEGORIES.length > 0 ? (
                                CATEGORIES.map((category) => (
                                    <CategoryCard key={category} category={category} />
                                ))
                            ) : (
                                <div className="col-span-full rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-16 text-center">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                    </svg>
                                    <p className="mt-4 text-base font-medium text-gray-900">No categories available</p>
                                    <p className="mt-1 text-sm text-gray-500">Check back later for new categories</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="group relative overflow-hidden rounded-xl border-2 border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-red-200 hover:shadow-lg">
                            <div className="absolute right-0 top-0 h-20 w-20 translate-x-8 -translate-y-8 rounded-full bg-red-100 opacity-50 transition-transform group-hover:scale-150" />
                            <div className="relative">
                                <div className="mb-4 inline-flex rounded-lg bg-red-50 p-3">
                                    <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Complete Privacy</h3>
                                <p className="mt-2 text-sm text-gray-600">Your identity is never tracked or stored. Share freely without concerns.</p>
                            </div>
                        </div>

                        <div className="group relative overflow-hidden rounded-xl border-2 border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-red-200 hover:shadow-lg">
                            <div className="absolute right-0 top-0 h-20 w-20 translate-x-8 -translate-y-8 rounded-full bg-red-100 opacity-50 transition-transform group-hover:scale-150" />
                            <div className="relative">
                                <div className="mb-4 inline-flex rounded-lg bg-red-50 p-3">
                                    <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Open Communication</h3>
                                <p className="mt-2 text-sm text-gray-600">Express your thoughts honestly in a safe and judgment-free space.</p>
                            </div>
                        </div>

                        <div className="group relative overflow-hidden rounded-xl border-2 border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-red-200 hover:shadow-lg sm:col-span-2 lg:col-span-1">
                            <div className="absolute right-0 top-0 h-20 w-20 translate-x-8 -translate-y-8 rounded-full bg-red-100 opacity-50 transition-transform group-hover:scale-150" />
                            <div className="relative">
                                <div className="mb-4 inline-flex rounded-lg bg-red-50 p-3">
                                    <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Make an Impact</h3>
                                <p className="mt-2 text-sm text-gray-600">Your feedback helps create positive change and improvements.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}