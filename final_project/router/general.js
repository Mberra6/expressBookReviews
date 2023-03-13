const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



const doesExist = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
};

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(403).send("Missing username/password.");
    } else if (doesExist(username)) {
        return res.status(403).json({message: "Username already exists."});
    } else {
        users.push({"username": username, "password": password});
        return res.status(200).json({message: "Customer successfully registered. Now you can login."});
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify({books}, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (isbn) {
      res.status(200).send(JSON.stringify(books[isbn], null, 4));
  } else {
      res.status(403).send("No ISBN provided.");
  }
 });
  
// Get book details based on author
public_users.get('/author/:author', (req, res) => {
    const author = req.params.author;
    let keys = Object.keys(books);
    let record;
    let recordwithisbn;
    let booksbyauthor = [];

    keys.forEach((key) => {
        if (books[key]["author"] === author) {
            record = Object.assign({}, books[key]);
            delete record.author;
            recordwithisbn = Object.assign({isbn: key}, record)
            booksbyauthor.push(recordwithisbn);
        }
    });

    if (booksbyauthor.length > 0) {
        res.status(200).send(JSON.stringify({booksbyauthor}, null, 4));
    } else {
        res.status(403).send("No book with such author.");
    }
});

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
    const title = req.params.title;
    let keys = Object.keys(books);
    let record;
    let recordwithisbn;
    let booksbytitle = [];

    keys.forEach((key) => {
        if (books[key]["title"] === title) {
            record = Object.assign({}, books[key]);
            delete record.title;
            recordwithisbn = Object.assign({isbn: key}, record);
            booksbytitle.push(recordwithisbn);
        }
    });

    if (booksbytitle.length > 0) {
        res.status(200).send(JSON.stringify({booksbytitle}, null, 4));
    } else {
        res.status(403).send("No book with such title.");
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]){
        res.status(200).send(JSON.stringify(books[isbn]["reviews"], null, 4));
    } else {
        res.status(403).send("Invalid ISBN number.")
    }
});

// Task 10 - Get the book list available in the shop using Promises
public_users.get('/books', (req, res) => {
    const get_books = new Promise((resolve, reject) => {
        resolve(res.status(200).send(JSON.stringify({books}, null, 4)));
    });
    get_books.then(() => console.log("Promise for Task 10 resolved"));
});

// Task 11 - Get the book details based on ISBN using Promises
public_users.get('/books/isbn/:isbn', (req, res) => {
    const get_book = new Promise((resolve, reject) => {
        const isbn = req.params.isbn;
        resolve(res.status(200).send(books[isbn], null, 4));
    });
    get_book.then(() => console.log("Promise for Task 11 resolved"));
});

// Task 12 - Get book details based on Author using Promises
public_users.get('/books/author/:author', (req, res) => {
    const get_book_author = new Promise((resolve, reject) => {
        const author = req.params.author;
        let keys = Object.keys(books);
        let record;
        let recordwithisbn;
        let booksbyauthor = [];

        keys.forEach((key) => {
            if (books[key]["author"] === author) {
                record = Object.assign({}, books[key]);
                delete record.author;
                recordwithisbn = Object.assign({isbn: key}, record)
                booksbyauthor.push(recordwithisbn);
            }
        });

        if (booksbyauthor.length > 0) {
            resolve(res.status(200).send(JSON.stringify({booksbyauthor}, null, 4)));
        } else {
            resolve(res.status(403).send("No book with such author."));
        }
    });
    get_book_author.then(() => console.log("Promise for Task 12 resolved"));
});

// Task 13 - Get book details based on Title using Promises
public_users.get('/books/title/:title', (req, res) => {
    const get_book_title = new Promise((resolve, reject) => {
        const title = req.params.title;
        let keys = Object.keys(books);
        let record;
        let recordwithisbn;
        let booksbytitle = [];

        keys.forEach((key) => {
            if (books[key]["title"] === title) {
                record = Object.assign({}, books[key]);
                delete record.title;
                recordwithisbn = Object.assign({isbn: key}, record);
                booksbytitle.push(recordwithisbn);
            }
        });

        if (booksbytitle.length > 0) {
            resolve(res.status(200).send(JSON.stringify({booksbytitle}, null, 4)));
        } else {
            resolve(res.status(403).send("No book with such title."));
        }
    });
    get_book_title.then(() => console.log("Promise for Task 13 resolved"));
});

module.exports.general = public_users;
