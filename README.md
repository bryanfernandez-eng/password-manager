# 🔐 Password Manager

A secure full-stack password management application built with the MERN stack (MongoDB, Express, React, Node.js).

## 🌟 Overview

This password manager application allows users to securely store, generate, and manage their passwords. It features user authentication with email verification, secure password storage, and a password generator with customization options.

## ✨ Features

- **🔑 User Authentication**
  - Signup with email verification
  - Login/logout functionality
  - JWT-based authentication with HttpOnly cookies

- **📋 Password Management**
  - Store passwords for different websites
  - Add, delete, and update stored passwords
  - Search through saved passwords

- **🎲 Password Generation**
  - Customizable password length
  - Include/exclude character types (uppercase, lowercase, numbers, symbols)
  - Add specific strings to passwords
  - Exclude specific characters
  - Password shuffling

- **🛡️ Security**
  - Passwords encrypted using bcrypt
  - Secure HTTP-only cookies
  - CORS protection
  - Helmet for security headers

## 🛠️ Tech Stack

- ⚛️ React.js
- 🚂 Express.js
- 🍃 MongoDB

## 📥 Installation

### 📋 Prerequisites

- Node.js (v14 or later)
- npm or yarn
- MongoDB (local or Atlas)
- Git

### 🖥️ Backend Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd password-manager
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Create a `.env` file in the backend directory (see Environment Variables section)

4. Start the backend server:
```bash
npm run dev
```

### 💻 Frontend Setup

1. Install frontend dependencies:
```bash
cd frontend
npm install
```

2. Start the frontend development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`, and the backend API at `http://localhost:3000`.

### 🔧 Environment Variables

Create a `.env` file in the backend directory with the following variables:

```
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/password-manager

# JWT Authentication
JWT_SECRET=your_secret_key_here

# Email Configuration (for verification)
EMAIL=your_email@gmail.com
EMAIL_PASSWORD=your_email_app_password
```

## 📝 Usage

1. Register a new account with email verification
2. Log in to your account
3. Generate secure passwords using the password generator
4. Save passwords for different websites
5. View, edit, or delete your saved passwords

## 👥 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request
