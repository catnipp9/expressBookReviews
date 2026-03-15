# Express Book Review Application - IBM Final Project

This repository contains the final project for the **"Back-End Development with Node.js and Express"** course, part of the **IBM Full Stack Developer Professional Certificate** on **Coursera**.

## 📚 Project Overview
The **Express Book Review Application** is a server-side back-end system designed to manage a library of books and user-generated reviews. This project serves as a comprehensive evaluation of building RESTful APIs, managing state with sessions, and securing endpoints with JSON Web Tokens (JWT).

## ✨ Key Learning Objectives
As part of the IBM Skills Network curriculum, this project implements:
- **Authentication & Authorization:** Restricting access to review management using JWT and session-based authentication.
- **Asynchronous Programming:** Implementing four distinct CRUD operations using **Async/Await** and **Promises** with Axios.
- **Middleware Integration:** Using Express middleware for request logging and security checks.
- **Data Management:** Performing CRUD (Create, Read, Update, Delete) operations on a book dataset.

## 🛠️ Features

### Public Access (General User)
- **Retrieve All Books:** Using an async callback function to get the full inventory.
- **Search by ISBN:** Using Promises to locate specific book details.
- **Search by Author/Title:** Filtering the collection to find specific works.
- **View Reviews:** Accessing public feedback for any book in the system.

### Registered User (Authenticated)
- **Secure Registration & Login:** User account creation with session persistence.
- **Review Management:** Registered users can **Add**, **Modify**, and **Delete** their own book reviews.

## 🚀 Installation & Setup
1. **Fork and Clone** the repository to your environment.
2. **Install Dependencies:**
   ```bash
   npm install
