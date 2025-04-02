# 🔐 Secure Password Manager

A comprehensive full-stack password management application built with the MERN stack (MongoDB, Express, React, Node.js).


## 🌟 Overview

This password manager application allows users to securely store, generate, and manage their passwords. It features a modern, responsive UI with animations, robust user authentication with email verification, secure password storage with encryption, and an AI-powered chatbot assistant to help users with password-related questions.

## ✨ Key Features

### 🔑 User Authentication & Security
- **Secure Signup Flow**: Email verification with timed expiration codes
- **JWT Authentication**: Secure token-based auth with HTTP-only cookies
- **Password Reset**: Self-service password recovery with email verification
- **Account Management**: Update profile and delete account options
- **Security Headers**: Implemented with Helmet for enhanced protection
- **CORS Protection**: Configured for secure cross-origin requests

### 📋 Password Vault Management
- **Secure Storage**: All passwords encrypted using AES-256-CBC
- **CRUD Operations**: Add, view, update, and delete password entries
- **Search & Sort**: Find and organize passwords easily
- **Responsive UI**: Table view for desktop and card view for mobile
- **Password Visibility**: Toggle password visibility with a single click
- **Quick Copy**: Copy passwords to clipboard without revealing them

### 🎲 Password Generation
- **Customizable Generator**: Create strong passwords with specific requirements
- **Strength Meter**: Visual feedback on password security
- **Character Controls**: Include/exclude character types (uppercase, lowercase, numbers, symbols)
- **Advanced Options**: Add specific strings, exclude characters, and more
- **Password Shuffling**: Randomize existing passwords for better security

### 🤖 AI Chatbot Assistant
- **Password Help**: Get assistance with password-related questions
- **Security Tips**: Learn best practices for password management
- **Feature Guidance**: Help navigating the application's features

### 🛡️ Additional Security Features
- **Passwords Encrypted**: Using bcrypt for user passwords and AES for stored credentials
- **Session Management**: Secure login sessions with proper timeout handling
- **Input Validation**: Server-side validation for all user inputs
- **Protection Against Common Attacks**: XSS, CSRF, injection attacks

## 🛠️ Tech Stack

### Frontend
- **React 18**: Modern component-based UI architecture
- **React Router DOM 7**: Client-side routing with protected routes
- **Chakra UI**: Accessible and responsive component library
- **Framer Motion**: Smooth animations and transitions
- **Axios**: HTTP client for API communication
- **Context API**: Global state management

### Backend
- **Node.js & Express**: Fast, minimalist web framework
- **MongoDB & Mongoose**: NoSQL database with schema modeling
- **JWT**: JSON Web Tokens for stateless authentication
- **Bcrypt**: Password hashing and verification
- **Crypto**: AES-256-CBC encryption for stored passwords
- **Nodemailer**: Email services for verification and password reset
- **OpenAI API**: Integration for AI-powered chatbot assistant

### DevOps & Tooling
- **Vite**: Next-generation frontend build tool
- **ESLint**: Code quality and style consistency
- **dotenv**: Environment variable management
- **Helmet**: Security headers configuration
- **CORS**: Cross-Origin Resource Sharing protection

## 📥 Installation

### Prerequisites
- Node.js (v14 or later)
- npm or yarn
- MongoDB (local or Atlas)
- OpenAI API key (for chatbot functionality)

### Backend Setup
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

3. Create a `.env` file in the backend directory with the following variables:
```
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/password-manager

# JWT Authentication
JWT_SECRET=your_jwt_secret_key_here

# Password Encryption
SECRET_KEY_ENCRYPT=your_encryption_key_here

# Email Configuration (for verification)
EMAIL=your_email@gmail.com
EMAIL_PASSWORD=your_email_app_password

# OpenAI API (for chatbot)
OPENAI_API_KEY=your_openai_api_key
```

4. Start the backend server:
```bash
npm run dev
```

### Frontend Setup
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

## 🔒 Security Considerations

- All passwords are encrypted using AES-256-CBC before storage
- User authentication passwords are hashed using bcrypt
- JWT tokens are stored in HTTP-only cookies to prevent XSS attacks
- CORS is configured to restrict access to the API
- Email verification prevents unauthorized signups
- Security headers are set using Helmet middleware

## 🚀 Future Enhancements

- Two-factor authentication
- Password sharing with other users
- Password breach checking against known databases
- Browser extension for auto-fill functionality
- Mobile application version
- Offline access capabilities
- Import/export functionality for passwords
- Password categorization and tagging

## 👥 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request
