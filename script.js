const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const filters = document.querySelectorAll(".filters button");
const emptyState = document.getElementById("empty-state");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// Save to localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render Tasks
function renderTasks() {
    taskList.innerHTML = "";

    const filteredTasks = tasks.filter(task => {
        if (currentFilter === "active") return !task.completed;
        if (currentFilter === "completed") return task.completed;
        return true;
    });

    if (filteredTasks.length === 0) {
        emptyState.style.display = "block";
    } else {
        emptyState.style.display = "none";
    }

    filteredTasks.forEach(task => {
        const li = document.createElement("li");
        li.className = task.completed ? "completed" : "";

        const span = document.createElement("span");
        span.textContent = task.text;
        span.addEventListener("click", () => toggleTask(task.id));

        const actions = document.createElement("div");
        actions.className = "actions";

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.onclick = () => editTask(task.id);

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "X";
        deleteBtn.onclick = () => deleteTask(task.id);

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        li.appendChild(span);
        li.appendChild(actions);
        taskList.appendChild(li);
    });
}

// Add Task
form.addEventListener("submit", e => {
    e.preventDefault();

    const newTask = {
        id: Date.now(),
        text: input.value.trim(),
        completed: false
    };

    tasks.push(newTask);
    input.value = "";
    saveTasks();
    renderTasks();
});

// Toggle Complete
function toggleTask(id) {
    tasks = tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks();
    renderTasks();
}

// Delete Task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

// Edit Task
function editTask(id) {
    const task = tasks.find(t => t.id === id);
    const newText = prompt("Edit task:", task.text);
    if (newText !== null && newText.trim() !== "") {
        task.text = newText.trim();
        saveTasks();
        renderTasks();
    }
}

// Filter
filters.forEach(button => {
    button.addEventListener("click", () => {
        filters.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
        currentFilter = button.dataset.filter;
        renderTasks();
    });
});

// Initial Load
renderTasks();