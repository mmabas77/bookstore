const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON and form data
app.use(express.json()); // For JSON
app.use(express.urlencoded({ extended: true })); // For form data

// In-memory array to store books
let books = [
    { id: 1, title: "1984", author: "George Orwell" },
    { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee" }
];

// 1. Get all books
app.get('/books', (req, res) => {
    res.json(books);
});

// 2. Add a new book (Supports both JSON & Form Data)
app.post('/books', (req, res) => {
    const { title, author } = req.body; // Works for both JSON and form data
    if (!title || !author) {
        return res.status(400).json({ message: "Title and author are required" });
    }

    const newBook = {
        id: books.length + 1,
        title,
        author
    };

    books.push(newBook);
    res.status(201).json(newBook);
});

// 3. Get a book by ID
app.get('/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const book = books.find(b => b.id === bookId);

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    res.json(book);
});

// 4. Delete a book by ID
app.delete('/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    books = books.filter(b => b.id !== bookId);

    res.json({ message: "Book deleted successfully" });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
