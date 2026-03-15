const express = require("express");
const bcrypt = require("bcryptjs");
const books = require("./booksdb.js");
const { isValid, users } = require("./auth_users.js");

const public_users = express.Router();

// POST /register — Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }
  if (isValid(username)) {
    return res.status(409).json({ message: `User '${username}' already exists.` });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  users.push({ username, password: hashedPassword });

  return res.status(201).json({ message: "User successfully registered. Now you can login" });
});

// GET / — Get all books
public_users.get("/", (req, res) => {
  return res.status(200).json(books);
});

// GET /isbn/:isbn — Get book by ISBN
public_users.get("/isbn/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: `No book found with ISBN: ${isbn}` });
  }
  return res.status(200).json(book);
});

// GET /author/:author — Get all books by author
public_users.get("/author/:author", (req, res) => {
  const authorParam = req.params.author.toLowerCase();
  const result = {};

  Object.keys(books).forEach((isbn) => {
    if (books[isbn].author.toLowerCase().includes(authorParam)) {
      result[isbn] = books[isbn];
    }
  });

  if (Object.keys(result).length === 0) {
    return res.status(404).json({ message: `No books found by author: ${req.params.author}` });
  }
  return res.status(200).json(result);
});

// GET /title/:title — Get all books by title
public_users.get("/title/:title", (req, res) => {
  const titleParam = req.params.title.toLowerCase();
  const result = {};

  Object.keys(books).forEach((isbn) => {
    if (books[isbn].title.toLowerCase().includes(titleParam)) {
      result[isbn] = books[isbn];
    }
  });

  if (Object.keys(result).length === 0) {
    return res.status(404).json({ message: `No books found with title: ${req.params.title}` });
  }
  return res.status(200).json(result);
});

// GET /review/:isbn — Get reviews for a book
public_users.get("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: `No book found with ISBN: ${isbn}` });
  }
  return res.status(200).json({ reviews: book.reviews });
});

module.exports.general = public_users;
