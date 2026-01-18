import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import SubmitFeedback from "./pages/SubmitFeedback";
import CategoryFeedback from "./pages/CategoryFeedback";

export default function App() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/submit" element={<SubmitFeedback />} />
                <Route path="/category/:category" element={<CategoryFeedback />} />
            </Routes>
        </>
    );
}
