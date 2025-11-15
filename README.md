# 🎬 Movie Community App — React Native

A modern, animated **Movie Community Application** built with **React Native**, **Redux Toolkit**, **Reanimated**, and **TMDB API**.  
Users can explore trending movies, view detailed information, manage a watchlist, write reviews, and track their movie preferences.

## 🚀 Features

### 🔐 Authentication

- Local Login & Register
- User data stored securely in AsyncStorage
- Persistent login session
- Logout clears all local authentication data

### 🎥 Movie Feed

- Fetch trending movies using TMDB API
- Animated card grid (Reanimated)
- Infinite scrolling
- Pull-to-refresh support
- Smooth entry animations & poster loading

### 📄 Movie Detail Screen

- Animated poster transitions
- Movie title, overview, ratings, popularity, genres
- Add/Remove from Watchlist
- Review bottom sheet ready

### ⭐ Watchlist

- Add or remove movies
- Fully persistent via AsyncStorage
- Swipe-to-delete support
- Clean empty state UI

### 👤 Profile

- User details & profile stats
- Watchlist count
- Genre-based chart (react-native-svg)
- Clean, minimal UI

## 📚 Libraries Used

### Navigation

- @react-navigation/native
- @react-navigation/native-stack
- @react-navigation/bottom-tabs

### State Management

- @reduxjs/toolkit
- react-redux

### Storage

- @react-native-async-storage/async-storage

### Animations

- react-native-reanimated
- react-native-gesture-handler

### Networking

- axios

### UI, Icons & Charts

- react-native-svg
- react-native-linear-gradient
- react-native-vector-icons

## 🧱 Project Architecture (Clean & Scalable)

src/
│
├── api/ # TMDB API service handlers  
├── app/ # Redux store configuration  
├── components/ # Reusable UI components  
├── features/ # Redux slices (auth, movies, watchlist)  
├── navigation/ # Stacks & tab navigators  
├── screens/ # App screens grouped by feature  
├── utils/ # storage utils

## 📦 Installation & Setup

### 1️⃣ Clone the repository

git clone https://github.com/i-nirbhay10/MovieCommunityApp.git
cd MovieCommunityApp

### 2️⃣ Install dependencies

npm install or npm install --force

## 🔐 Environment Variables

Create a `.env` file in the root directory:
TMDB_KEY=YOUR_TMDB_API_KEY

## ▶️ Run the App

npm start
npm run android

## 🧹 Clear Cache

npm start -- --reset-cache
cd android && ./gradlew clean && cd ..
npm run android
