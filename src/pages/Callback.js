import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const Callback = () => {
    console.log("redirected successfuly")
    const [searchParams] = useSearchParams();
    const code = searchParams.get("code");

    useEffect(() => {
        if (code) {
            const codeVerifier = localStorage.getItem("code_verifier");
            console.log("frontend call back")
            axios
                .post("http://localhost:4000/auth/google/callback", { code, codeVerifier }, { withCredentials: true })
                .then((response) => {
                    window.location.href = "/dashboard";
                })
                .catch((err) => console.error("Login failed", err));
        }
    }, [code]);

    return <p>Processing login...</p>;
};

export default Callback;
