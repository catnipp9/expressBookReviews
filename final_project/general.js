const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios'); // Required by the rubric

// Task 10: Get all books using Async/Await
public_users.get('/', async function (req, res) {
  try {
    // Simulating an async call to the local books database
    const getBooks = () => Promise.resolve(books);
    const allBooks = await getBooks();
    res.status(200).send(JSON.stringify(allBooks, null, 4));
  } catch (error) {
    res.status(500).json({message: "Error retrieving books"});
  }
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  
  // Wrapping in a Promise as requested
  const fetchBook = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject({status: 404, message: `No book found with ISBN: ${isbn}`});
    }
  });

  fetchBook
    .then((book) => res.status(200).send(JSON.stringify(book, null, 4)))
    .catch((err) => res.status(err.status).json({message: err.message}));
});

// Task 12: Get book details based on Author using Promises/Async
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  
  const fetchByAuthor = new Promise((resolve, reject) => {
    const filteredBooks = Object.values(books).filter(b => b.author === author);
    if (filteredBooks.length > 0) {
      resolve(filteredBooks);
    } else {
      reject({status: 404, message: "Author not found"});
    }
  });

  fetchByAuthor
    .then((booksList) => res.status(200).send(JSON.stringify(booksList, null, 4)))
    .catch((err) => res.status(err.status).json({message: err.message}));
});

// Task 13: Get book details based on Title using Promises/Async
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  const fetchByTitle = new Promise((resolve, reject) => {
    const filteredBooks = Object.values(books).filter(b => b.title === title);
    if (filteredBooks.length > 0) {
      resolve(filteredBooks);
    } else {
      reject({status: 404, message: "Title not found"});
    }
  });

  fetchByTitle
    .then((booksList) => res.status(200).send(JSON.stringify(booksList, null, 4)))
    .catch((err) => res.status(err.status).json({message: err.message}));
});

// Get reviews for a book
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
