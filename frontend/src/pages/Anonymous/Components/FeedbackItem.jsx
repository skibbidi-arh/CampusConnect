import { formatDate } from "../utils/formatDate";
import { MoreHorizontal } from "lucide-react";

export default function FeedbackItem({ feedback }) {
    return (
        <div className="group relative bg-white border-2 border-red-50 rounded-2xl p-8 transition-all duration-300 hover:border-red-600 hover:shadow-2xl hover:shadow-red-100 hover:-translate-y-1 h-full flex flex-col">

            {/* Action Bar */}
            <div className="flex justify-end items-start mb-4">
                <button className="text-red-200 hover:text-red-600 transition-colors">
                    <MoreHorizontal size={20} />
                </button>
            </div>

            {/* Data Sections */}
            <div className="flex-1 space-y-8">

                {/* 1. SUBJECT SECTION */}
                <div className="relative pl-6 border-l-2 border-red-600">
                    <span className="block text-[11px] font-black uppercase tracking-widest text-red-600 mb-1">
                        SUBJECT:
                    </span>
                    <h4 className="text-black font-extrabold text-xl leading-tight group-hover:text-red-700 transition-colors">
                        {feedback.title || "No Title Provided"}
                    </h4>
                </div>

                {/* 2. MESSAGE SECTION */}
                <div className="bg-red-50/20 p-5 rounded-xl border border-red-100/50">
                    <span className="block text-[11px] font-black uppercase tracking-widest text-red-600 mb-2">
                        FEEDBACK DETAIL:
                    </span>
                    <p className="text-black leading-relaxed text-sm font-medium italic">
                        "{feedback.message}"
                    </p>
                </div>

            </div>

            {/* 3. FOOTER SECTION */}
            <div className="mt-10 pt-6 border-t-2 border-red-50 flex items-center justify-between">

                {/* Author Label & Value */}
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-red-400 mb-1">
                        AUTHOR:
                    </span>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white text-xs font-black shadow-md">
                            {feedback.title?.charAt(0) || "U"}
                        </div>
                        <span className="text-sm font-bold text-black uppercase tracking-tight">
                            Anonymous
                        </span>
                    </div>
                </div>

                {/* Date Label & Value */}
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black uppercase tracking-widest text-red-400 mb-1">
                        SUBMITTED ON:
                    </span>
                    <span className="text-xs font-black text-red-600 bg-red-50 px-3 py-1 rounded-md border border-red-100">
                        {formatDate(feedback.createdAt)}
                    </span>
                </div>

            </div>
        </div>
    );
}