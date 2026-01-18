// src/pages/Home.jsx
import { CATEGORIES } from "../constants/categories";
import CategoryCard from "../components/CategoryCard";

export default function Home() {
    return (
        <div className="category-grid">
            {CATEGORIES.map((cat) => (
                <CategoryCard key={cat} category={cat} />
            ))}
        </div>
    );
}
