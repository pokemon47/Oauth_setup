import React from "react";

const GOOGLE_CLIENT_ID = "766966137410-nh4htb3v4eb9h23do96oim87pso6c7p7.apps.googleusercontent.com";
const REDIRECT_URI = "http://localhost:3000/callback";

const generateCodeChallenge = async (verifier) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
};

const generateCodeVerifier = () => {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
};

const GoogleLoginButton = () => {
    const handleLogin = async () => {
        const codeVerifier = generateCodeVerifier();
        localStorage.setItem("code_verifier", codeVerifier);

        const codeChallenge = await generateCodeChallenge(codeVerifier);
        console.log("STARTING AT THE BUTTON")
        // const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?
        // client_id=${GOOGLE_CLIENT_ID}
        // &redirect_uri=${encodeURIComponent(REDIRECT_URI)}
        // &response_type=code
        // &scope=openid%20email%20profile
        // &code_challenge_method=S256
        // &code_challenge=${codeChallenge}`;
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
            `client_id=${encodeURIComponent(GOOGLE_CLIENT_ID)}` +
            `&redirect_uri=${encodeURIComponent("http://localhost:3000/callback")}` +
            `&response_type=code` +
            `&scope=openid%20email%20profile` +
            `&code_challenge_method=S256` +
            `&code_challenge=${codeChallenge}`
        console.log(authUrl)
        window.location.href = authUrl;
    };

    return <button onClick={handleLogin}>Continue with Google</button>;
};

export default GoogleLoginButton;
