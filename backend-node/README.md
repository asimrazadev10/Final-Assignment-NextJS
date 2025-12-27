# 🧠 Subscription Management Platform — Backend

This is the **backend** of the *Subscription Management Platform for Freelancers*, built using **Node.js + Express**.  
It provides secure RESTful APIs for authentication, subscription management, budgeting, and analytics.

---

## 🛠️ Tech Stack

- 🟢 **Node.js** — JavaScript runtime
- 🚀 **Express.js** — Web framework for building APIs
- 🗄️ **MongoDB (Mongoose)** — NoSQL database
- 🔐 **JWT Authentication** — Secure user sessions
- ⚙️ **dotenv** — Environment variable configuration
- 🧪 **Postman** — API testing and debugging

---

## 📁 Folder Structure

backend/
|
├── controllers/ # Business logic for routes
├── middleware/ # Authentication, error handling
├── models/ # Mongoose schemas
├── routes/ # API route definitions
├── utils/ # Helper functions and constants
└── server.js # App entry point
└── db.js # Database connection
└── package.json

---

🔗 API Endpoints Overview
| Feature   | Method | Endpoint                  | Description                |
|-----------|--------|---------------------------|----------------------------|
| 👤 Auth   | POST   | /api/auth/register        | Register a new user        |
| 👤 Auth   | POST   | /api/auth/login           | Login user                 |
| 🧑‍💼 User   | GET    | /api/users/:username      | Get user by username       |
| 🧑‍💼 User   | PUT    | /api/users/:username      | Update user                |
| 🧑‍💼 User   | GET    | /api/users/search         | Search user                |

🧩 Key Features
🔐 Secure JWT-based authentication

📦 CRUD APIs for user (for now)

📡 CORS-enabled for frontend integration

🧠 Developer Info
Framework: Node.js + Express
Database: MongoDB
Authors: ASAD TAUQEER, ASIM RAZA, KHAWAR HUSSAIN
Course: Advanced Web Development