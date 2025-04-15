const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://mongodb:27017/todoapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Define Mongoose schema and model
const todoSchema = new mongoose.Schema({
  task: { type: String, required: true },
});

const Todo = mongoose.model('Todo', todoSchema);

// Routes

// GET: Fetch all todos
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch todos.' });
  }
});

// POST: Create a new todo
app.post('/api/todos', async (req, res) => {
  const { task } = req.body;
  if (!task) {
    return res.status(400).json({ error: 'Task content is required.' });
  }
  try {
    const newTodo = new Todo({ task });
    await newTodo.save();
    res.status(201).json({ message: 'Task added.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add todo.' });
  }
});

// PUT: Update a todo
app.put('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { task } = req.body;
  if (!task) {
    return res.status(400).json({ error: 'Task content is required.' });
  }
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(id, { task }, { new: true });
    if (!updatedTodo) {
      return res.status(404).json({ error: 'Todo not found.' });
    }
    res.json({ message: 'Task updated.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update todo.' });
  }
});

// DELETE: Remove a todo
app.delete('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTodo = await Todo.findByIdAndDelete(id);
    if (!deletedTodo) {
      return res.status(404).json({ error: 'Todo not found.' });
    }
    res.json({ message: 'Task deleted.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete todo.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
