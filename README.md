# FashioNXT

FashioNXT is a full-featured EJS + Express e-commerce platform built on the MERN ecosystem (MongoDB, Express, Node).
It Express routing and middleware to deliver a smooth server-side–rendered shopping experience.
The application includes secure user authentication, session-based login, product browsing, cart/checkout flow, order management, address handling, and secure online payments through Razorpay. It uses Multer for image uploads, MongoDB/Mongoose for data modeling, and a clean modular MVC structure for scalability and maintainability.

---

## 🚀 Live Demo

**https://rjun.space**

## 📦 GitHub Repository

**https://github.com/Arjunexe/FashioNXT.git**

---

## 🛠️ Tech Stack

- **MongoDB** – Database
- **Express.js** – Backend Framework
- **React.js** – Frontend
- **Node.js** – Runtime
- Additional tools: Axios, Multer, Nodemon, Sessions, Razorpay, Twilio

---

## ▶️ Running the Project

### **1. Clone the repo**

```bash
git clone https://github.com/Arjunexe/FashioNXT.git
cd FashioNXT
```

### **2. Install dependencies**

```bash
npm install
```

### **3. Start the server**

```bash
npm start
```

This uses nodemon to run `./bin/www`.

---

## 🌐 Environment Variables

Your `.env` file should contain:

```env
TWILIO_ACCOUNT_SID="YOUR_TWILIO_SID"
TWILIO_AUTH_TOKEN="YOUR_AUTH_TOKEN"
TWILIO_SERVICES_SID="YOUR_SERVICE_SID"

RZP_SECRET_KEY="YOUR_RAZORPAY_SECRET"
RZP_KEY_ID="YOUR_RAZORPAY_ID"

MONGO_URL="YOUR_MONGODB_CONNECTION_STRING"
```

⚠️ **Important**: Never commit real API keys or secrets to GitHub.

---

## 📄 package.json Overview

The project includes major dependencies like:

- express
- mongoose
- multer
- axios
- dotenv
- nodemon
- razorpay
- twilio

---

## 📚 Description

A full‑stack social platform intended to scale, with:

- User authentication
- Media upload
- MongoDB-based data modeling
- Secure API routing
- Sessions and caching
- EJS-based admin views

---

## 📝 License

MIT License
