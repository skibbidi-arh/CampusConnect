// src/components/CategoryCard.jsx
import { useNavigate } from "react-router-dom";
import "../styles/category.css";

export default function CategoryCard({ category }) {
    const navigate = useNavigate();

    return (
        <div className="category-card" onClick={() => navigate(`/category/${category}`)}>
            {category}
        </div>
    );
}
