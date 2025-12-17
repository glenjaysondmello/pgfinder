# 🏠 PG Finder: Simplifying Paying Guest Accommodations

PG Finder is a **full-stack web application** designed to make discovering, booking, and managing **Paying Guest (PG) accommodations** seamless. With secure payments, AI-powered assistance, and role-based access, PG Finder provides both **users and admins** with a smooth and reliable experience.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Stars](https://img.shields.io/github/stars/pgfinder/pgfinder?style=social)
![Forks](https://img.shields.io/github/forks/pgfinder/pgfinder?style=social)
![Languages](https://img.shields.io/badge/languages-JS%2C%20Node%2C%20MongoDB%2C%20Docker%2C%20Redis-blueviolet)
![Contributors](https://img.shields.io/badge/contributors-1-orange)

![Project Preview](/preview_example.png)

---

## ✨ Key Features

* 🔑 **Secure Authentication** – Firebase signup/login with Google Sign-In support.
* 👨‍💼 **Role-Based Access** – Admins manage PG listings & payments, users explore & book accommodations.
* 💬 **AI-Powered Chatbot** – Built with Qdrant, Groq Cloud API, and Meta-LLaMA to answer queries.
* 💳 **Payments & Invoicing** – Razorpay INR payments with **auto-generated PDF invoices** (sent to both user & PG owner).
* 🏘 **PG Listings & Favorites** – Users can search, filter, and save their favorite PGs.
* 💬 **Community Comments** – Comment & reply system with user ownership.
* ☁️ **Optimized Storage** – Cloudinary for image handling.
* 📧 **Smart Notifications** – Nodemailer for booking confirmations.
* ⚡ **High Performance** – Redis caching with Upstash for optimized backend ops.

---

## 🛠️ Tech Stack

* **Frontend:** React, Vite, Redux, Tailwind CSS, React Hook Form *(deployed via Vercel)*
* **Backend:** Node.js, Express, Docker, Redis *(deployed via Render)*
* **Database:** MongoDB Atlas
* **Authentication:** Firebase
* **Payments:** Razorpay
* **File Handling:** Cloudinary, PDFKit
* **AI & Chatbot:** Qdrant, Groq Cloud API, Xenova Transformers
* **APIs & Services:** REST APIs, Nodemailer

---

## ⚙️ Installation Guide

### Prerequisites

* Git
* Node.js (LTS) & npm/yarn
* Docker & Docker Compose *(recommended)*
* MongoDB Atlas account
* Firebase project setup
* Razorpay API keys

### Clone Repository

```bash
git clone https://github.com/glenjaysondmello/pgfinder.git
cd pgfinder
```

### Option 1: Run with Docker (Recommended)

```bash
docker-compose up --build
```

Frontend → [http://localhost:5173](http://localhost:5173)
Backend → [http://localhost:5000](http://localhost:5000)

### Option 2: Manual Setup

#### Backend Setup

```bash
cd backend
npm install
npm run dev
```

Create a `.env` file in `/backend`:

```env
PORT=5000
FIREBASE_ADMIN_SDK_PATH="./serviceAccount.json"
MONGO_URI=""
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
RAZORPAY_KEY_ID=""
RAZORPAY_KEY_SECRET=""
EMAIL_USER=""
EMAIL_PASS=""
GROQ_API_KEY=""
UPSTASH_REDIS_REST_URL=""
UPSTASH_REDIS_REST_TOKEN=""
REDIS_URL=""
QDRANT_URL=""
QDRANT_API_KEY=""
FRONTEND_URL="http://localhost:5173"
```

#### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Create a `.env` file in `/frontend`:

```env
VITE_FIREBASE_API_KEY=""
VITE_FIREBASE_AUTH_DOMAIN=""
VITE_FIREBASE_PROJECT_ID=""
VITE_FIREBASE_STORAGE_BUCKET=""
VITE_FIREBASE_MESSAGING_SENDER_ID=""
VITE_FIREBASE_APP_ID=""
VITE_FIREBASE_MEASUREMENT_ID=""
VITE_RAZORPAY_KEY_ID=""
VITE_BACKEND_URL="http://localhost:5000"
```

---

## 🚀 Usage

### Book a PG

1. Sign up or log in via Firebase/Google.
2. Browse available PG listings.
3. Select a PG and proceed to booking.
4. Make payment securely via Razorpay.
5. Receive booking confirmation & invoice by email.

### Admin Dashboard

* Manage PG listings.
* Track and view user payments.
* Send notifications to users.

---

## 🛣️ Roadmap

* 🔐 User authentication with advanced role permissions.
* 📝 Custom template-based PG listings.
* 📊 Analytics dashboard for owners.
* ☁️ Cloud deployment automation.
* 🤝 Real-time collaboration & chat support.

---

## 🤝 Contribution Guidelines

1. Fork the repo & create a branch: `feature/your-feature`
2. Follow coding standards:

   * **Frontend:** ESLint + Prettier
   * **Backend:** ESLint + standard commit messages
3. Write tests (Jest / Mocha / Pytest equivalents).
4. Submit PR with clear description & issue references.

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 📧 Contact

**Author:** Glen Jayson Dmello
📩 Email: [glendmello04@gmail.com](mailto:glendmello04@gmail.com)

---

> 🚀 PG Finder – Making PG accommodation booking seamless, secure, and smarter with AI.
