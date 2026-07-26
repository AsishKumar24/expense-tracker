# 💸 XpenseLog – Smart Expense Tracker

[![Backend on GitHub](https://img.shields.io/badge/backend-xpenselog--backend-blue?logo=github)](https://github.com/AsishKumar24/expense-tracker-backend)

**XpenseLog** is a full-stack, cross-platform mobile application built using **React Native**, **Expo Router**, and a **Node.js + AI-powered backend**. It helps users **track, manage, and analyze** their expenses intelligently through powerful visualizations and AI-generated insights. Receipt image uploads are handled on the **frontend using Cloudinary**.

---

## 🚀 Features

- 📊 Interactive charts for visualizing spending  
- 📅 Native date picker for filtering expenses  
- 💾 Persistent local storage with AsyncStorage  
- 🔍 Filter expenses by category, type, and time  
- 🧠 AI-powered analysis of spending patterns  
- 💬 Conversational AI assistant — log expenses in plain English (e.g. "spent 200 on coffee")  
- 📤 Upload receipts and images via Cloudinary (frontend)  
- 🔐 Firebase integration for backend services  
- 🌙 Dark/light mode support  
- 📱 Cross-platform support: Android, iOS, and Web  

---

## 🧰 Tech Stack

### Frontend (React Native + Expo)
- **Framework**: React Native, Expo SDK 53, Expo Router  
- **UI & UX**: `@expo/vector-icons`, `react-native-gifted-charts`, `@shopify/flash-list`, `phosphor-react-native`, `expo-linear-gradient`, `expo-haptics`  
- **Navigation**: `@react-navigation/native`, `@react-navigation/bottom-tabs`  
- **Storage**: `@react-native-async-storage/async-storage`  
- **Utilities**: `lodash`, `axios`, `cloudinary` (for uploads)  
- **Firebase**: Realtime Database or Auth  
- **Image Uploads**: Cloudinary (integrated directly in frontend)

### Backend (Node.js + AI)
- **Server**: Express.js  
- **AI Service**: Google Generative AI (`@google/genai`)  
- **Firebase**: User data and optional storage  
- **Dev Tools**: Nodemon, dotenv, CORS  
- **Source**: [xpenselog-backend](https://github.com/asishxp/xpenselog-backend)

---

## 💬 AI Assistant (Conversational Logging)

The app includes a chat-style assistant (the **Assistant** tab) that lets users record money in natural language instead of filling out a form. It talks to two endpoints on the Node backend:

- **`POST /analyze`** — takes the user's transactions, computes income/expense totals, and asks Google Gemini for short, friendly budgeting advice.
- **`POST /chat`** — takes a chat message plus recent history, the user's category list, and wallet names. Gemini classifies whether the user is **logging a transaction** or **just chatting** and returns a structured JSON object. When the intent is "log", the app resolves the wallet and writes a real transaction to Firestore through the existing transaction service, so wallet balances and totals stay consistent.

The Gemini API key lives only on the backend (in an environment variable), never in the mobile app bundle.

---

## 📁 Project Structure

```bash
root/
│
├── frontend/               # React Native App
│   ├── app/                # Routes with Expo Router
│   ├── components/         # UI Components
│   ├── screens/            # Screen Views
│   ├── utils/              # Utility Functions
│   ├── firebase/           # Firebase Config
│   ├── assets/             # Images, Fonts
│   └── cloudinary/         # Upload logic (e.g., useUploadImage.js)
│
├── backend/                # Node.js Backend
│   ├── src/
│   │   ├── app.js          # Express App Entry
│   │   ├── routes/         # API Routes
│   │   ├── controllers/    # Business Logic
│   │   └── ai/             # GenAI Integration
│   └── .env                # Environment Config
