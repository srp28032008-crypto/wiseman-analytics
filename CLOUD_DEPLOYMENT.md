# 🌐 WISEMAN ANALYTICS - 24/7 CLOUD DEPLOYMENT GUIDE
## 🐉 (वाईजमन ॲनालिटिक्स - २४/७ क्लाउड डिप्लॉयमेंट मार्गदर्शिका)

To keep your trading application running **24/7** for free, we deploy the **Frontend (Static UI)** on **Vercel** and the **Backend (Secure Database & WebSocket Server)** on **Render**. This eliminates the need to keep your personal computer running or handle local setup issues.

---

## 📋 PRE-REQUISITES (पूर्व-अटी)
1. **GitHub Account**: Create a free account at [github.com](https://github.com/) if you don't have one.
2. **Git installed** (or you can upload files directly via the GitHub website in your browser).

---

## 📤 STEP 1: UPLOAD CODE TO GITHUB (कोड गिटहबवर अपलोड करा)
1. Initialize a Git repository in your project directory:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit for 24/7 cloud deployment"
   ```
2. Create a new repository on your GitHub account named `wiseman-analytics`.
3. Push your local files to GitHub:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/wiseman-analytics.git
   git branch -M main
   git push -u origin main
   ```
   *(Alternative: If you do not have Git command line, create a repository on the GitHub website and upload the folders `css`, `js`, `lib`, `backend` and files `index.html`, `prototype.html` directly using your web browser).*

---

## 🖥️ STEP 2: DEPLOY FRONTEND ON VERCEL (वेबसाईट व्हर्सेलवर होस्ट करा)
Vercel is a free, high-speed hosting provider for frontend files. It will run 24/7.

1. Go to [vercel.com](https://vercel.com/) and Sign Up using your **GitHub account**.
2. Click **Add New** ➔ **Project**.
3. Import your `wiseman-analytics` repository.
4. Keep the default settings:
   - **Framework Preset**: Other / None
   - **Root Directory**: `./` (Root directory of the project)
5. Click **Deploy**.
6. After 1 minute, Vercel will give you a public URL (e.g., `https://wiseman-analytics.vercel.app`).
   * **Marathi Note**: ही लिंक तुम्ही तुमच्या मोबाईलवर किंवा कोणत्याही डिव्हाइसवर उघडू शकता. ती २४/७ चालू राहील!

---

## ⚡ STEP 3: DEPLOY BACKEND ON RENDER (सुरक्षित बॅकएंड रेंडरवर होस्ट करा)
Render is a free cloud platform to run Node.js backend servers.

1. Go to [render.com](https://render.com/) and Sign Up using your **GitHub account**.
2. Click **New +** ➔ **Web Service**.
3. Connect your `wiseman-analytics` repository.
4. Configure the Web Service settings exactly:
   - **Name**: `wiseman-backend`
   - **Language**: `Node`
   - **Root Directory**: `backend` (This points to the backend sub-folder)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: **Free** ($0/month)
5. Under **Environment Variables**, click **Add Environment Variable** and enter:
   - `JWT_SECRET` = `YourSuperSecretCustomKeyHere2026!`
   - `ADMIN_API_KEY` = `BlackDragon_AdminSecretKey_98765`
6. Click **Create Web Service**.
7. Render will build and launch your backend server. Once complete, it will provide a public URL (e.g., `https://wiseman-backend.onrender.com`).

---

## 🔗 STEP 4: LINK FRONTEND AND BACKEND (दोन्ही एकत्र लिंक करा)
To direct your live quantitative workspace to pull authentication and logs from your Render cloud instead of local machine:

1. Open `js/app.js` or `js/config.js`.
2. Locate the backend API server variable (defaulting to `http://localhost:5000`).
3. Replace the `localhost` URL with your Render live backend link:
   ```javascript
   // Replace localhost with your live Render backend URL:
   const BACKEND_API_URL = "https://wiseman-backend.onrender.com/api";
   const BACKEND_WS_URL = "wss://wiseman-backend.onrender.com";
   ```
4. Commit and push the changes to GitHub. Vercel will automatically re-deploy the updated client in 10 seconds!

---

## 🚀 SUMMARY OF BENEFITS (फायदे)
* **Zero Cost**: Vercel and Render free tiers cost $0.
* **Always Alive**: 24/7 server activity. No local computer dependencies.
* **Security Shield**: Full **Terminator Security Core V2** remains active on the Render cloud instance protecting all authentication calls and WebSockets.
