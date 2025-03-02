// require("dotenv").config();
import "dotenv/config";
import express, { json } from "express";
import axios from "axios";

import pkg from 'jsonwebtoken';
const { verify, sign } = pkg;
import cors from "cors";
import cookieParser from "cookie-parser";
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_BLACKLIST = new Set();

const authenticate = (req, res, next) => {
    const token = req.cookies.jwt;
    console.log("THE AUTHENTCATION")
    console.log(req.cookies)
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        const decoded = verify(token, JWT_SECRET);
        if (TOKEN_BLACKLIST.has(decoded.jti)) {
            return res.status(403).json({ error: "Token has been revoked" });
        }
        req.user = decoded;
        next();
    } catch {
        res.status(403).json({ error: "Invalid token" });
    }
};

app.post("/auth/google/callback", async (req, res) => {
    const { code, codeVerifier } = req.body;
    try {
        // exchange authorization code for ID token
        const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", {
            code,
            client_id: GOOGLE_CLIENT_ID,
            client_secret: GOOGLE_CLIENT_SECRET,
            redirect_uri: "http://localhost:3000/callback",
            grant_type: "authorization_code",
            code_verifier: codeVerifier,
        });

        const { id_token } = tokenResponse.data;

        // verify ID token
        const userInfo = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${id_token}`);
        const { email, name, picture } = userInfo.data;

        // create a unique identifier for this token (jti)
        const jti = uuidv4();
        
        // create a JWT for the frontend
        const token = sign({ email, name, picture, jti }, JWT_SECRET, { expiresIn: "1h" });

        res.cookie("jwt", token, {
            httpOnly: true, // prevents JavaScript access (protects against XSS attacks)
            secure: true, // ensures cookie is only sent over HTTPS (false for localhost)
            sameSite: "None", // prevents CSRF attacks (adjust as needed)
        });
        // some debugging comments.
        // The backend fails to set the cookie if sameSit is set to None but secure is also set to false. 
        // got around this by just using secure as true which shouldn't work because that is reserved only for HTTPS but yea idk how it works
        // The error I saw on browser dev tool:
        //
        // This attemp to set a cookie via Set-Cookie header was blocked because it had the "SameSite=None" attribute but 
        // did not have the "Secure" attribute, which is required in order to use "SameSite=Nonde".
        console.log("login successful")
        console.log(token)
        res.json({ message: "Login successful" }); //  No need to send the JWT explicitly
        
    } catch (error) {
        console.error("Error exchanging code:", error.response?.data || error.message);
        res.status(500).json({ error: "Authentication failed" });
    }
});

app.post("/logout", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(400).json({ error: "No token provided" });

    try {
        const decoded = verify(token, JWT_SECRET);
        TOKEN_BLACKLIST.add(decoded.jti); // add token jti to blacklist
        res.json({ message: "Logged out successfully" });
    } catch {
        res.status(403).json({ error: "Invalid token" });
    }
});

app.get("/protected", authenticate, (req, res) => {
    console.log(authenticate)
    res.json({ message: "This is protected data", user: req.user });
});

app.listen(4000, () => console.log("Server running on port 4000"));
