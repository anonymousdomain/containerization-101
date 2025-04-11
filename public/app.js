document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('todo-form');
  const input = document.getElementById('todo-input');
  const list = document.getElementById('todo-list');

  // Fetch todos from the server and render them on the UI.
  async function fetchTodos() {
    try {
      const response = await fetch('/api/todos');
      const todos = await response.json();
      renderTodos(todos);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  }

  // Render the list of todos.
  function renderTodos(todos) {
    list.innerHTML = '';
    todos.forEach((todo) => {
      const li = document.createElement('li');

      const span = document.createElement('span');
      span.textContent = todo.task; // Access the 'task' field from the object
      li.appendChild(span);

      // Create Edit button
      const editBtn = document.createElement('button');
      editBtn.textContent = 'Edit';
      editBtn.onclick = () => editTodo(todo._id, todo.task); // Pass _id and task
      li.appendChild(editBtn);

      // Create Delete button
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.onclick = () => deleteTodo(todo._id); // Pass _id only
      li.appendChild(deleteBtn);

      list.appendChild(li);
    });
  }

  // Add a new todo task
  async function addTodo(task) {
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task })
      });
      if (response.ok) {
        await fetchTodos();
      } else {
        console.error('Error adding task:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  }

  // Edit an existing todo task using its _id
  async function editTodo(id, currentTask) {
    const newTask = prompt('Edit task:', currentTask);
    if (!newTask || newTask.trim() === '') return;
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: newTask })
      });
      if (response.ok) {
        await fetchTodos();
      } else {
        console.error('Error editing task:', response.statusText);
      }
    } catch (error) {
      console.error('Error editing task:', error);
    }
  }

  // Delete a todo task using its _id
  async function deleteTodo(id) {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        await fetchTodos();
      } else {
        console.error('Error deleting task:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }

  // Handle form submission to add a new todo task.
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newTask = input.value.trim();
    if (newTask) {
      await addTodo(newTask);
      input.value = '';
    }
  });

  // Initial fetch on page load.
  fetchTodos();
});
