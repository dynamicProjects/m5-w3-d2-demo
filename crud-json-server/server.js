const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoURI = "mongodb://localhost:27017/bookapp";
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

  const postSchema = new mongoose.Schema({
    title: String,
    author: String,
    id: String
  });
  
  const bookSchema = new mongoose.Schema({
    posts: [postSchema]
  });
  
  const Book = mongoose.model("Book", bookSchema);

// API Endpoints

// Get all posts
app.get("/posts", async (req, res) => {
  try {
    const document = await Book.findOne();
    const posts = document ? document.posts : [];
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Get a single post
app.get("/posts/:id", async (req, res) => {
  try {
    const document = await Book.findOne();
    const post = document ? document.posts.find(p => p.id === req.params.id) : null;
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// Create a new post
app.post("/posts", async (req, res) => {
  try {
    const document = await Book.findOne();
    if (document) {
      document.posts.push(req.body);
      await document.save();
      res.status(201).json(req.body);
    } else {
      res.status(404).json({ message: 'Document not found' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// Update a post
app.put("/posts/:id", async (req, res) => {
  try {
    const document = await Book.findOne();
    if (document) {
      const post = document.posts.id(req.params.id);
      if (post) {
        post.title = req.body.title || post.title;
        post.author = req.body.author || post.author;
        await document.save();
        res.json(post);
      } else {
        res.status(404).json({ message: 'Post not found' });
      }
    } else {
      res.status(404).json({ message: 'Document not found' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// Delete a post
app.delete("/posts/:id", async (req, res) => {
  try {
    const document = await Book.findOne();
    if (document) {
      const post = document.posts.id(req.params.id);
      if (post) {
        post.remove();
        await document.save();
        res.json({ message: 'Post deleted' });
      } else {
        res.status(404).json({ message: 'Post not found' });
      }
    } else {
      res.status(404).json({ message: 'Document not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Start the server
const port = 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
