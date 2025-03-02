// this is an example dashboard copied from chatGPT

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:4000/protected", { withCredentials: true }) // ✅ Sends cookies automatically
            .then(response => {
                setUser(response.data.user); // ✅ Backend returns user info
            })
            .catch(error => {
                console.error("Access denied", error);
                navigate("/"); // Redirect to login if unauthorized
            });
    }, [navigate]);

    return (
        <div>
            {user ? (
                <div>
                    <h1>Welcome, {user.name}!</h1>
                    <p>Email: {user.email}</p>
                    <img src={user.picture} alt="Profile" width="100" />
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Dashboard;
