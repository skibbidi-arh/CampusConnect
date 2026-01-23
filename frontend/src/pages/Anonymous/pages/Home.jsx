// src/pages/Anonymous/pages/Home.jsx (or your main category page)
import { CATEGORIES } from "../constants/categories";
import CategoryCard from "../components/CategoryCard";

export default function Home() {
    return (
        <div className="w-full max-w-7xl mx-auto px-6 py-10">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-[20px]">
                {CATEGORIES.map((cat) => (
                    <CategoryCard key={cat} category={cat} />
                ))}
            </div>
        </div>
    );
}