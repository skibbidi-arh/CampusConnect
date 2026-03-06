// src/pages/Anonymous/pages/Home.jsx (or your main category page)
import { CATEGORIES } from "../constants/categories";
import CategoryCard from "../components/CategoryCard";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import GoBackButton from "../../../components/GoBackButton";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 to-gray-100">
            <Header showMenuButton={false} />

            <main className="container mx-auto flex-1 p-4 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-8 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <GoBackButton />
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Anonymous Feedback</h1>
                                <p className="mt-1 text-sm text-gray-600">Browse feedback by category or submit your own</p>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/submit')}
                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#e50914] to-[#b00020] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Submit Feedback
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {CATEGORIES.map((cat) => (
                            <CategoryCard key={cat} category={cat} />
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}