const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;

// Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/bookstore').then(
    () => console.log("✅ Connected to MongoDB")
)
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Define Book Schema
const bookSchema
    = new mongoose.Schema({
    title: String,
    author: String
});

// Create Book Model
const Book = mongoose.model('Book', bookSchema);

// 1. Get all books
app.get('/books', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 2. Add a new book
app.post('/books', async (req, res) => {
    const { title, author } = req.body;
    if (!title || !author) {
        return res.status(400).json({ message: "Title and author are required" });
    }

    try {
        const newBook
            = new Book({ title, author });
        await newBook.save();
        res.status(201).json(newBook);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 3. Get a book by ID
app.get('/books/:id', async (req, res) => {
    try {
        const book =
            await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 4. Delete a book by ID
app.delete('/books/:id', async (req, res) => {
    try {
        const deletedBook =
            await Book.findByIdAndDelete(req.params.id);
        if (!deletedBook) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.json({ message: "Book deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
