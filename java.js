// Task array to store tasks
let tasks = [];

// DOM Elements
const taskInput = document.getElementById('task-input');
const taskForm = document.querySelector('.task-form');
const tasksContainer = document.querySelector('.tasks');
const itemsLeft = document.getElementById('items-left');
const allTasksButton = document.getElementById('all-tasks');
const activeTasksButton = document.getElementById('active-tasks');
const completedTasksButton = document.getElementById('completed-tasks');
const clearAllButton = document.getElementById('clearAll');
const toggleButton = document.getElementById('toggle');
const toggleImg = document.getElementById('toggle-img');
const bgImg = document.getElementById('bg-img');

// Load tasks from localStorage
function loadTasks() {
  const storedTasks = localStorage.getItem('tasks');
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
  }
  renderTasks();
  updateItemsLeft();
}

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Add a new task
function addTask(title) {
  const newTask = {
    id: Date.now(),
    title,
    status: 'pending',
  };
  tasks.push(newTask);
  saveTasks();
  renderTasks();
  updateItemsLeft();
}

// Remove a task by id
function removeTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
  updateItemsLeft();
}

// Mark a task as complete
function markTaskComplete(id) {
  const task = tasks.find(task => task.id === id);
  if (task) {
    task.status = task.status === 'completed' ? 'pending' : 'completed';
    saveTasks();
    renderTasks();
    updateItemsLeft();
  }
}

// Clear all completed tasks
function clearCompletedTasks() {
  tasks = tasks.filter(task => task.status !== 'completed');
  saveTasks();
  renderTasks();
  updateItemsLeft();
}

// Render tasks to the DOM
function renderTasks(filter = 'all') {
  tasksContainer.innerHTML = '';

  let filteredTasks = tasks;
  if (filter === 'active') {
    filteredTasks = tasks.filter(task => task.status === 'pending');
  } else if (filter === 'completed') {
    filteredTasks = tasks.filter(task => task.status === 'completed');
  }

  filteredTasks.forEach(task => {
    const taskElement = document.createElement('div');
    taskElement.className = `task ${task.status === 'completed' ? 'completed' : ''}`;
    taskElement.innerHTML = `
      <div class="custom-check" data-id="${task.id}">
        <span></span>
      </div>
      <span class="task-title">${task.title}</span>
      <img src="images/icon-cross.svg" alt="Delete" class="delete-btn" data-id="${task.id}">
    `;
    tasksContainer.appendChild(taskElement);
  });
}

// Update the "items left" counter
function updateItemsLeft() {
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;
  itemsLeft.textContent = pendingTasks;
}

// Event Listeners

// Add task on pressing Enter
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const title = taskInput.value.trim();
    if (title) {
      addTask(title);
      taskInput.value = '';
    }
  }
});

// Mark task as complete or delete task
tasksContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('custom-check')) {
    const id = Number(e.target.dataset.id);
    markTaskComplete(id);
  } else if (e.target.classList.contains('delete-btn')) {
    const id = Number(e.target.dataset.id);
    removeTask(id);
  }
});

// Filter tasks
allTasksButton.addEventListener('click', () => {
  allTasksButton.classList.add('active');
  activeTasksButton.classList.remove('active');
  completedTasksButton.classList.remove('active');
  renderTasks('all');
});

activeTasksButton.addEventListener('click', () => {
  activeTasksButton.classList.add('active');
  allTasksButton.classList.remove('active');
  completedTasksButton.classList.remove('active');
  renderTasks('active');
});

completedTasksButton.addEventListener('click', () => {
  completedTasksButton.classList.add('active');
  allTasksButton.classList.remove('active');
  activeTasksButton.classList.remove('active');
  renderTasks('completed');
});

// Clear completed tasks
clearAllButton.addEventListener('click', () => {
  clearCompletedTasks();
});

// Toggle theme (light/dark)
toggleButton.addEventListener('click', () => {
  document.body.classList.toggle('light-theme');
  const isLightTheme = document.body.classList.contains('light-theme');
  toggleImg.src = isLightTheme ? 'images/icon-moon.svg' : 'images/icon-sun.svg';
  bgImg.src = isLightTheme ? 'images/bg-desktop-light.jpg' : 'images/bg-desktop-dark.jpg';
});

// Initial load
loadTasks();