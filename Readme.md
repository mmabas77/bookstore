# 📚 Simple Bookstore API

## 🧑‍🏫 Basic Concepts Explained

Before diving into the code, let's understand some key terms:

- **API (Application Programming Interface)**: A way for different software applications to communicate with each other.
- **Node.js**: A runtime environment that allows JavaScript to run outside of a browser, often used for backend development.
- **Express.js**: A framework for building web applications and APIs with Node.js.
- **MongoDB**: A NoSQL database that stores data in JSON-like documents.
- **Mongoose**: A library for interacting with MongoDB using JavaScript.
- **CRUD Operations**: The four basic operations performed on data:
    - **C**reate (Add new data)
    - **R**ead (Retrieve data)
    - **U**pdate (Modify existing data)
    - **D**elete (Remove data)
- **Middleware**: A function that runs between receiving a request and sending a response, often used for processing data (like parsing JSON).
- **JSON (JavaScript Object Notation)**: A lightweight format for storing and transporting data.

## 📖 Project Overview

This is a simple **Bookstore API** built with **Node.js** and **Express.js**. The API provides functionalities to:

- Get all books
- Add a new book
- Get a book by ID
- Delete a book by ID

The project includes **two approaches**:
1. **Without a Database** (Using an in-memory array)
2. **With MongoDB** (Using Mongoose to store books persistently)

---

## 📌 1️⃣ Approach 1: Without a Database

In this approach, books are stored **in an array in memory**, meaning data will be lost when the server restarts.

### **🛠️ Setup**
1. **Install Node.js** (if not installed)
2. **Initialize the project**
   ```sh
   npm init -y
   npm install express
   ```
3. **Create `server.js`** with the following content:

```javascript
const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory array to store books
let books = [
    { id: 1, title: "1984", author: "George Orwell" },
    { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee" }
];

// Routes
app.get('/books', (req, res) => res.json(books));
app.post('/books', (req, res) => {
    const { title, author } = req.body;
    if (!title || !author) return res.status(400).json({ message: "Title and author are required" });
    const newBook = { id: books.length + 1, title, author };
    books.push(newBook);
    res.status(201).json(newBook);
});
app.get('/books/:id', (req, res) => {
    const book = books.find(b => b.id === parseInt(req.params.id));
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
});
app.delete('/books/:id', (req, res) => {
    books = books.filter(b => b.id !== parseInt(req.params.id));
    res.json({ message: "Book deleted successfully" });
});

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
```

### **📌 How to Run**
```sh
node server.js
```

### **📌 Test the API (Using Postman or cURL)**
- **Get all books:** `GET http://localhost:3000/books`
- **Add a book:** `POST http://localhost:3000/books`
    - Body (x-www-form-urlencoded): `{ title: "The Hobbit", author: "J.R.R. Tolkien" }`
- **Get a book by ID:** `GET http://localhost:3000/books/1`
- **Delete a book by ID:** `DELETE http://localhost:3000/books/1`

---

## 📌 2️⃣ Approach 2: With MongoDB

In this approach, books are stored **in a MongoDB database** using **Mongoose** for data persistence.

### **🛠️ Setup**
1. **Install Dependencies**
   ```sh
   npm install express mongoose
   ```
2. **Run MongoDB** (Ensure MongoDB is running locally or via Docker)
   ```sh
   mongod
   ```
3. **Create `server-withmongo.js`** with the following content:

```javascript
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/bookstore', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Define Book Schema
const bookSchema = new mongoose.Schema({ title: String, author: String });
const Book = mongoose.model('Book', bookSchema);

// Routes
app.get('/books', async (req, res) => res.json(await Book.find()));
app.post('/books', async (req, res) => {
    const { title, author } = req.body;
    if (!title || !author) return res.status(400).json({ message: "Title and author are required" });
    const newBook = new Book({ title, author });
    await newBook.save();
    res.status(201).json(newBook);
});
app.get('/books/:id', async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
});
app.delete('/books/:id', async (req, res) => {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) return res.status(404).json({ message: "Book not found" });
    res.json({ message: "Book deleted successfully" });
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
```

### **📌 How to Run**
```sh
node server-withmongo.js
```

### **📌 Test the API**
- **Get all books:** `GET http://localhost:3000/books`
- **Add a book:** `POST http://localhost:3000/books`
- **Get a book by ID:** `GET http://localhost:3000/books/{BOOK_ID}`
- **Delete a book:** `DELETE http://localhost:3000/books/{BOOK_ID}`
---
