# 🌟 LittleSteps — Daycare Discovery Management System

A full-stack web application built during my internship at **Uptoskills**. This module handles **Parent Authentication** — including Login, Register, and Forgot Password functionality — for the LittleSteps Daycare Discovery Management System.

## 📌 Features

- 🔐 Parent Registration with form validation
- 🔑 Secure Login with JWT authentication
- 📧 Forgot Password flow
- 🔒 Password hashing using bcryptjs
- 🎨 Responsive UI built with React + Tailwind CSS
- 🌙 Glassmorphism dark theme design

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| Auth | JWT, bcryptjs |


## 📁 Project Structure

```
littlesteps/

├── server/                  # Express backend

│   ├── controllers/

│   │   └── authController.js

│   ├── db/

│   │   └── index.js

│   ├── middleware/

│   │   └── verifyToken.js

│   ├── routes/

│   │   └── auth.js

│   ├── .env

│   ├── index.js

│   └── package.json

├── src/                     # React frontend

│   ├── components/

│   │   ├── BackLink.jsx

│   │   ├── Btn.jsx

│   │   ├── Card.jsx

│   │   ├── Input.jsx

│   │   ├── Logo.jsx

│   │   ├── MethodToggle.jsx

│   │   ├── OtpBoxes.jsx

│   │   ├── RoleTabs.jsx

│   │   ├── Steps.jsx

│   │   └── Toast.jsx

│   ├── pages/

│   │   ├── DashboardScreen.jsx

│   │   ├── ForgotPasswordScreen.jsx

│   │   ├── LoginScreen.jsx

│   │   ├── OtpVerifyScreen.jsx

│   │   ├── RegisterComplete.jsx

│   │   └── RegisterScreen.jsx

│   ├── api.js

│   ├── App.jsx

│   ├── index.css

│   └── main.jsx

├── index.html

├── tailwind.config.js

├── postcss.config.js

├── vite.config.js

└── package.json
```
## ⚙️ Getting Started

### Installation

1. Clone the repo and install frontend dependencies
   ```bash
   npm install
   ```
2. Install backend dependencies
   ```bash
   cd server && npm install
   ```
3. Create `server/.env` with your DB credentials and JWT secret
4. Run backend: `node index.js` and frontend: `npm run dev`

## 🙋‍♀️ Author
**Arushi** — Intern at Uptoskills
