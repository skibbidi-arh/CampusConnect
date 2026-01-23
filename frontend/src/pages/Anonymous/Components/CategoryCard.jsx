// src/components/CategoryCard.jsx
import { useNavigate } from "react-router-dom";

export default function CategoryCard({ category }) {
    const navigate = useNavigate();

    return (
        <div 
            onClick={() => navigate(`/category/${encodeURIComponent(category)}`)}
            className="
                flex items-center justify-center
                bg-white border border-gray-200 
                p-8 rounded-xl 
                cursor-pointer text-center font-bold text-gray-800 uppercase tracking-tight
                transition-all duration-300 ease-in-out
                hover:border-red-500 hover:text-red-600
                hover:shadow-xl hover:shadow-red-100/50 
                hover:-translate-y-1 active:scale-95
            "
        >
            {category}
        </div>
    );
}