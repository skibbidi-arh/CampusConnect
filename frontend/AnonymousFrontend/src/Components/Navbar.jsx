import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "../styles/navbar.css";

export default function Navbar() {
    const DASHBOARD_URL = "http://localhost:5173/dashboard";

    return (
        <nav className="navbar">
            {/* LEFT: BACK ARROW */}
            <div className="nav-left">
                <a href={DASHBOARD_URL} className="back-button">
                    <ArrowLeft size={24} strokeWidth={3} />
                </a>
            </div>

            {/* CENTER: BOLD HEADING */}
            <div className="nav-center">
                <h1>IUT ANONYMOUS FEEDBACK</h1>
            </div>

            {/* RIGHT: LINKS */}
            <div className="nav-right">
                <Link to="/" className="nav-link">HOME</Link>
                <Link to="/submit" className="nav-link">GIVE FEEDBACK</Link>
            </div>
        </nav>
    );
}