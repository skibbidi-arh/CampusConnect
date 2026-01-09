// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import "../styles/navbar.css";

export default function Navbar() {
    return (
        <nav className="navbar">
            <h1>IUT Anonymous Feedback</h1>
            <div>
                <Link to="/">Home</Link>
                <Link to="/submit">Give Feedback</Link>
            </div>
        </nav>
    );
}
