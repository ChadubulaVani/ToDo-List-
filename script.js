const taskInput = document.getElementById("taskInput");
const prioritySelect = document.getElementById("prioritySelect");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const clearAll = document.getElementById("clearAll");
const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const searchInput = document.getElementById("searchInput");
const progressBar = document.getElementById("progressBar");
const themeToggle = document.getElementById("themeToggle");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let darkMode = localStorage.getItem("darkMode") === "true";
document.body.classList.toggle("dark", darkMode);
themeToggle.checked = darkMode;

themeToggle.addEventListener("change", () => {
  darkMode = themeToggle.checked;
  document.body.classList.toggle("dark", darkMode);
  localStorage.setItem("darkMode", darkMode);
});

// Add Task
function addTask() {
  const text = taskInput.value.trim();
  const priority = prioritySelect.value;
  if (!text) return alert("Enter a task");
  tasks.push({ text, completed: false, priority });
  taskInput.value = "";
  saveTasks();
}

// Save & Render Tasks
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

// Render Tasks with Priority Colors & Drag & Drop
function renderTasks(filter = "") {
  taskList.innerHTML = "";
  let completedCount = 0;

  tasks.forEach((task, index) => {
    if (!task.text.toLowerCase().includes(filter.toLowerCase())) return;

    const li = document.createElement("li");
    li.draggable = true;
    li.dataset.index = index;

    const left = document.createElement("div");
    left.className = "task-left";

    const checkbox = document.createElement("div");
    checkbox.className = "checkbox";
    if (task.completed) checkbox.classList.add("checked");
    checkbox.innerHTML = task.completed ? "✓" : "";

    const text = document.createElement("span");
    text.textContent = task.text;
    text.className = "task-text";
    if (task.completed) text.classList.add("completed");

    // Priority color
    if (!task.completed) {
      text.style.color =
        task.priority === "high"
          ? "var(--high)"
          : task.priority === "medium"
          ? "var(--medium)"
          : "var(--low)";
    }

    checkbox.onclick = () => {
      task.completed = !task.completed;
      saveTasks();
    };

    const delBtn = document.createElement("button");
    delBtn.innerHTML = "🗑";
    delBtn.onclick = (e) => {
      e.stopPropagation();
      tasks.splice(index, 1);
      saveTasks();
    };

    left.appendChild(checkbox);
    left.appendChild(text);
    li.appendChild(left);
    li.appendChild(delBtn);

    // Drag & Drop events
    li.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("index", index);
    });
    li.addEventListener("dragover", (e) => e.preventDefault());
    li.addEventListener("drop", (e) => {
      const fromIndex = e.dataTransfer.getData("index");
      const toIndex = index;
      tasks.splice(toIndex, 0, tasks.splice(fromIndex, 1)[0]);
      saveTasks();
    });

    taskList.appendChild(li);

    if (task.completed) completedCount++;
  });

  totalTasks.textContent = `Total: ${tasks.length}`;
  completedTasks.textContent = `Completed: ${completedCount}`;
  progressBar.style.width = tasks.length
    ? `${(completedCount / tasks.length) * 100}%`
    : "0%";
}

// Clear All
clearAll.onclick = () => {
  tasks = [];
  saveTasks();
};

// Search Filter
searchInput.addEventListener("input", () => {
  renderTasks(searchInput.value);
});

// Enter key adds task
taskInput.addEventListener("keypress", (e) => e.key === "Enter" && addTask());
addBtn.onclick = addTask;

// Initial Render
renderTasks();
