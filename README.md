
# 📂 Filemoon

Filemoon is a full-stack web application that provides user authentication, file management, and history tracking.  
The frontend is built with **React + Vite + TailwindCSS**, and the backend APIs are tested in **Postman** (can be extended with Node.js/Express).

---

## 🚀 Live Demo
[![GitHub Pages](https://img.shields.io/badge/Live-Filemoon-blue?style=flat-square)](https://annpurna04.github.io/Filemoon/)

---

## ⚙️ Tech Stack
- **Frontend:** React + Vite + TailwindCSS + React Router DOM  
- **Backend:** Postman API (can be extended with Node.js/Express)  
- **Deployment:** GitHub Pages  

---

## 📂 Project Structure
```
Filemoon/
├── public/          # Static assets (404.html, favicon, etc.)
├── src/             # React source code
│   ├── pages/       # Pages (Login, Signup, Dashboard, Files, History)
│   ├── context/     # Auth context
│   └── App.jsx      # Main app entry
├── package.json
├── vite.config.js
└── README.md
```

---

## 🛠️ Setup & Installation

### Clone the repository
```bash
git clone https://github.com/annpurna04/Filemoon.git
cd Filemoon
```

### Install dependencies
```bash
npm install
```

### Configure environment variables (if your backend requires it)
Create a `.env` file in the root:
```env
VITE_API_URL=https://your-backend-api-url
```

### Run locally
```bash
npm run dev
```
App will be available at `http://localhost:5173`.

---

## 🏗️ Build & Deployment

### Build for production
```bash
npm run build
```

### Deploy to GitHub Pages
```bash
npm run deploy
```

### GitHub Pages Settings
Make sure `vite.config.js` has:
```js
export default defineConfig({
  base: '/Filemoon/',
  plugins: [react()],
});
```

Add `404.html` in `public/` folder for SPA routing:
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Redirecting…</title>
    <meta http-equiv="refresh" content="0; url=/Filemoon/" />
  </head>
  <body>
    <p>If you are not redirected automatically, <a href="/Filemoon/">click here</a>.</p>
  </body>
</html>
```

---

## 🔑 Features
- ✅ User authentication (Login / Signup)  
- ✅ Dashboard for managing files  
- ✅ Upload & view files  
- ✅ File history tracking  
- ✅ Frontend deployed on GitHub Pages  
- ✅ React Router configured for GitHub Pages (`basename="/Filemoon"`)


## 👩‍💻 Author
**Annpurna Gupta**

---

## 📜 License
This project is licensed under the **MIT License**.  
See [LICENSE](LICENSE) for details.

---

## 🔗 Useful Links
- **GitHub Repo:** [https://github.com/annpurna04/Filemoon](https://github.com/annpurna04/Filemoon)  
- **Live Demo:** [https://annpurna04.github.io/Filemoon/](https://annpurna04.github.io/Filemoon/)
