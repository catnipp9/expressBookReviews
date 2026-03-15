const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const books = require("./booksdb.js");

const regd_users = express.Router();
let users = [];

const JWT_SECRET = "your_jwt_secret_key_2024";

// Helper: check if username exists
const isValid = (username) => {
  return users.some((u) => u.username === username);
};

// Helper: authenticate username & password
const authenticatedUser = (username, password) => {
  const user = users.find((u) => u.username === username);
  if (!user) return false;
  return bcrypt.compareSync(password, user.password);
};

// POST /customer/login — Login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }
  if (!isValid(username)) {
    return res.status(401).json({ message: "User not found. Please register first." });
  }
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid password." });
  }

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });
  req.session.authorization = { token };

  return res.status(200).json({
    message: "Customer successfully logged in",
    token,
  });
});

// JWT verification middleware for protected routes
regd_users.use((req, res, next) => {
  if (!req.session.authorization) {
    return res.status(403).json({ message: "User not logged in." });
  }
  const token = req.session.authorization.token;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
});

// PUT /customer/auth/review/:isbn — Add or modify a review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const { review } = req.query;
  const username = req.user.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
  }
  if (!review) {
    return res.status(400).json({ message: "Provide review as a query param: ?review=..." });
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: `Review for ISBN ${isbn} added/updated by ${username}.`,
    reviews: books[isbn].reviews,
  });
});

// DELETE /customer/auth/review/:isbn — Delete own review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
  }
  if (!books[isbn].reviews[username]) {
    return res.status(404).json({ message: `No review by ${username} for ISBN ${isbn}.` });
  }

  delete books[isbn].reviews[username];

  return res.status(200).json({
    message: `Review for ISBN ${isbn} deleted`,
  });
});

module.exports = { regd_users, isValid, authenticatedUser, users, JWT_SECRET };
