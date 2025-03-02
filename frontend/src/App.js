import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GoogleLoginButton from "./components/GoogleLoginButton";
import Callback from "./pages/Callback";
import Dashboard from "./pages/Dashboard";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<GoogleLoginButton />} />
                <Route path="/callback" element={<Callback />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </Router>
    );
}

export default App;
