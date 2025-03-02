Okay so everything I have written so far is for localhost, there are a few key changes to make 
when changing from localhost to production (deployed on the internet)

the changes to be made are:

1) In login2.js, at the start
From:
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

To:
app.use(cors({ origin: "https://yourfrontend.com", credentials: true }));


2) In login2.js, /auth/google/callback
From:
res.cookie("jwt", token, {
    httpOnly: true,
    secure: false,
    sameSite: "Strict",
});

To:
res.cookie("jwt", token, {
    httpOnly: true,
    secure: true, // Requires HTTPS in production
    sameSite: "None", // Must be "None" if frontend & backend are on different domains
});


3) OAuth Redirect URI in Google Cloud Console
From:
http://localhost:3000/callback

To:
https://yourfrontend.com/callback


4) Change your origin in google cloud console
To:
http://localhost:3000
From:
https://yourfrontend.com



Okay so since I will be having to use HTTPS when going from localhost to production.
This is because the httpOnly cookie has "secure: true" set which means the cookie cannot be used unless its over HTTPS and not HTTP
Since I would most likely be using vercel for backend and frontend, the following steps are necessary
* copied fron chatGPT

To deploy your frontend and backend on Vercel with HTTPS, follow these steps:

### **1. Deploy the Backend on Vercel**
1. **Create a Vercel Account**  
   - Sign up at [Vercel](https://vercel.com/) if you haven't already.
   - Install the Vercel CLI:  
     ```sh
     npm install -g vercel
     ```
   
2. **Initialize the Backend for Deployment**  
   - Navigate to your backend project folder and run:
     ```sh
     vercel init
     ```
   - It will prompt you to configure the project. Follow the steps:
     - Choose `Create a new project`
     - Select your GitHub repository (if connected) or continue manually
     - Set the root directory to your backend folder
     - Select "Other" as the framework
     - Set `build command` to `npm install`
     - Set `output directory` to `.`

3. **Set Up Environment Variables**  
   - Go to your Vercel dashboard → Select your backend project.
   - Navigate to **Settings** → **Environment Variables** and add:
     ```
     GOOGLE_CLIENT_ID=your_google_client_id
     GOOGLE_CLIENT_SECRET=your_google_client_secret
     JWT_SECRET=your_jwt_secret
     ```
   
4. **Modify Your Express Server for Vercel**
   - Create a new file **`api/index.js`** and move your Express app code inside.
   - Modify the `package.json` to ensure it runs correctly:
     ```json
     {
       "scripts": {
         "start": "node api/index.js"
       }
     }
     ```
   - Ensure your `cors` setup allows your frontend domain, e.g.:
     ```js
     app.use(cors({ origin: "https://yourfrontend.vercel.app", credentials: true }));
     ```
   
5. **Deploy the Backend**
   - Run:
     ```sh
     vercel deploy --prod
     ```
   - Once deployed, Vercel will give you a public HTTPS URL (e.g., `https://yourbackend.vercel.app`).

---

### **2. Deploy the Frontend on Vercel**
1. **Navigate to Your Frontend Project Folder**
   ```sh
   cd your-frontend-folder
   ```

2. **Modify API Calls to Use the Vercel Backend**
   - Update all API calls in your frontend code to use the deployed backend URL:
     ```js
     axios.post("https://yourbackend.vercel.app/auth/google/callback", ...)
     ```

3. **Initialize and Deploy the Frontend**
   - Run:
     ```sh
     vercel init
     vercel deploy --prod
     ```
   - Vercel will provide a public HTTPS URL (e.g., `https://yourfrontend.vercel.app`).

---

### **3. Update Google Cloud Console Redirect URIs**
1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Navigate to **OAuth 2.0 Client IDs** → Select your OAuth Client.
3. Update **Authorized Redirect URIs** with your deployed frontend URL:
   ```
   https://yourfrontend.vercel.app/callback
   ```
4. Save the changes.

---

### **4. Final Changes to Cookies**
- Now that you're using HTTPS, update your cookie settings:
  ```js
  res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,  // ✅ Now safe to enable on Vercel
      sameSite: "Strict",
  });
  ```

---

After following these steps, your authentication system will work securely on Vercel with HTTPS. 🚀