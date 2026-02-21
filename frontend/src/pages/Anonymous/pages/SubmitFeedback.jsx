// src/pages/SubmitFeedback.jsx
import FeedbackForm from "../components/FeedbackForm";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import GoBackButton from "../../../components/GoBackButton";

export default function SubmitFeedback() {
    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 to-gray-100">
            <Header showMenuButton={false} />

            <main className="container mx-auto flex-1 p-4 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-8 flex items-center gap-4">
                        <GoBackButton />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Submit Anonymous Feedback</h1>
                            <p className="mt-1 text-sm text-gray-600">Share your thoughts anonymously and help improve IUT</p>
                        </div>
                    </div>

                    <FeedbackForm />
                </div>
            </main>

            <Footer />
        </div>
    );
}
