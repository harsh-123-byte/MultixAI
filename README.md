<h1 align="center">✨🚀 MULTIX AI 🚀✨</h1>

<p align="center">
  A full-stack AI-powered SaaS web app with<br>
  <b>Content Generation</b>,<br>
  <b>Image Editing</b>, and<br>
  <b>Resume Analysis</b> tools.
</p>

<p align="center">
  Built using<br>
  <b>MERN Stack + Clerk + Gemini AI + Clipdrop + Cloudinary + Neon PostgreSQL</b>
</p>

---

## 🚀 MultixAI – AI SaaS Platform

MultixAI is a full-stack AI SaaS application built using the MERN stack + AI APIs.

It offers multiple powerful AI-driven tools for productivity, content creation, and media editing — all in one platform.

---

## ✨ Features

🔹 Authentication & Authorization  
Secure login/signup using Clerk

🔹 Content Tools  
Generate Articles  
Generate Blog Titles  
Resume Analysis using Gemini AI

🔹 Image Tools  
Text to Image (Clipdrop + Cloudinary)  
Background Remover  
Object Remover

🔹 Community  
Browse AI creations  
Like & Share creations

🔹 Database  
Store prompts, creations, and user data  
PostgreSQL (Neon DB)

🔹 Responsive UI  
Modern mobile-friendly UI  
React + Tailwind CSS

🔹 Real-Time Actions  
Secure API handling  
Express + Clerk Middleware

---

## 🛠️ Tech Stack

Frontend  
React (Vite)  
Tailwind CSS  
Clerk Auth  
Axios

Backend  
Node.js  
Express.js  
REST APIs  
Clerk Middleware

Database  
Neon PostgreSQL (Serverless)

AI & Cloud APIs  
Gemini AI  
Clipdrop API  
Cloudinary

Other Tools  
JWT  
CORS  
Multer  
dotenv

---

## 📂 Project Structure

MultixAI/
│── client/         # Frontend (React + Vite + Tailwind + Clerk)
│── server/         # Backend (Express + PostgreSQL + APIs)
│── README.md       # Documentation

---

## ⚡ Installation & Setup

### 1️⃣ Clone the Repository

git clone https://github.com/harsh-123-byte/MultixAI.git

---

### 2️⃣ Setup Backend

cd server  
npm install

Create `.env` file in `server/` and add:

PORT=3000  
DATABASE_URL=your_neon_postgres_url  
CLERK_SECRET_KEY=your_clerk_secret  
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key  
CLOUDINARY_CLOUD_NAME=your_cloud_name  
CLOUDINARY_API_KEY=your_api_key  
CLOUDINARY_API_SECRET=your_api_secret  

Start server:

npm run server

Server will run on:  
http://localhost:3000

---

### 3️⃣ Setup Frontend

cd client  
npm install

Create `.env` file in `client/` and add:

VITE_BASE_URL=http://localhost:3000  
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key  

Start frontend:

npm run dev

Frontend will run on:  
http://localhost:5173

---

## 🎯 Usage

Signup/Login using Clerk Auth.

Explore tools:

✍️ Generate Articles & Blog Titles  
🖼️ Generate AI Images  
🎨 Remove Background/Object  
📄 Analyze Resume with Gemini AI

Community Features:

💾 Save creations  
❤️ Like others’ work  
🔗 Share content

---

## 🚀 Future Enhancements

💳 Payment Gateway for Premium Tools  
📊 Advanced Resume Scoring  
🤖 AI-powered Job Recommendations

---

## 🤝 Contributing

Contributions are welcome!

Steps:

1. Fork this repository  
2. Create a new branch  
3. Make your changes  
4. Submit a Pull Request  

---

⭐ If you like this project, don’t forget to give it a star!
