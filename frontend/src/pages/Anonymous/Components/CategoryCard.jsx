// src/components/CategoryCard.jsx
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

export default function CategoryCard({ category }) {
    const navigate = useNavigate();

    const handleCategoryClick = () => {
        navigate(`/category/${encodeURIComponent(category)}`);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleCategoryClick();
        }
    };

    return (
        <div 
            role="button"
            tabIndex={0}
            onClick={handleCategoryClick}
            onKeyDown={handleKeyDown}
            aria-label={`View ${category} category`}
            className="
                group relative overflow-hidden
                flex items-center justify-center
                bg-white border-2 border-gray-200 
                p-4 rounded-lg min-h-[100px]
                cursor-pointer text-center font-semibold text-gray-800 uppercase tracking-wide
                transition-all duration-300 ease-in-out
                hover:border-red-600 hover:text-red-600
                hover:shadow-xl hover:shadow-red-100/40
                hover:-translate-y-1 
                active:scale-95 active:shadow-md
                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
            "
        >
            <div 
                className="
                    absolute inset-0 
                    bg-gradient-to-br from-red-50/0 to-red-100/0 
                    group-hover:from-red-50/50 group-hover:to-red-100/30 
                    transition-all duration-300
                " 
                aria-hidden="true"
            />
            
            <span className="relative z-10 text-sm leading-tight">
                {category}
            </span>
        </div>
    );
}

CategoryCard.propTypes = {
    category: PropTypes.string.isRequired,
};