const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');


app.use(cors());
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

let todos = [];

app.get('/api/todos', (req, res) => {
  res.json(todos);
});

app.post('/api/todos', (req, res) => {
  const { task } = req.body;
  if (task) {
    todos.push(task);
    res.status(201).json({ message: 'Task added.' });
  } else {
    res.status(400).json({ error: 'Task content is required.' });
  }
});

app.put('/api/todos/:index', (req, res) => {
  const index = parseInt(req.params.index);
  const { task } = req.body;
  if (task && todos[index]) {
    todos[index] = task;
    res.json({ message: 'Task updated.' });
  } else {
    res.status(400).json({ error: 'Invalid index or task content.' });
  }
});

app.delete('/api/todos/:index', (req, res) => {
  const index = parseInt(req.params.index);
  if (todos[index]) {
    todos.splice(index, 1);
    res.json({ message: 'Task deleted.' });
  } else {
    res.status(400).json({ error: 'Invalid index.' });
  }
});
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
