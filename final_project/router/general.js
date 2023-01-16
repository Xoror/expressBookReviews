const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

//Return books
function fetchBooks() {
    return new Promise((resolve, reject) => {
        resolve(books);
    });
  }

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    fetchBooks().then((booksSent) => res.send(booksSent));
});


function fetchByISBN(isbnTest) {
    return new Promise((resolve, reject) => {
        let isbn = parseInt(isbnTest);
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject({status:404, message:"No books with this ISBN found."});
        }
    })
  }

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    fetchByISBN(req.params.isbn)
      .then(
          result => res.send(result),
          error => res.status(error.status).json({message: error.message})
      );
   });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    fetchBooks()
    .then((bookInfo) => Object.values(bookInfo))
    .then((booksAuthor) => booksAuthor.filter((bookAuthor) => bookAuthor.author === author))
    .then((filteredBooks) => res.send(filteredBooks));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    fetchBooks()
    .then((bookInfo) => Object.values(bookInfo))
    .then((booksTitle) => booksTitle.filter((bookTitle) => bookTitle.title === title))
    .then((filteredBooks) => res.send(filteredBooks));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    fetchByISBN(req.params.isbn)
    .then(
        result => res.send(result.reviews),
        error => res.status(error.status).json({message: error.message})
    );
});

module.exports.general = public_users;
