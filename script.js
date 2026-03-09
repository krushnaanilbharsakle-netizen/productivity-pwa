const STORAGE_KEY = "tasks";
const RESET_FLAG_KEY = "tasks_reset_done_v1";
const VALID_IMPORTANCE = new Set(["high", "mid", "low"]);

function normalizeTask(task) {
  if (typeof task === "string") {
    return { text: task, done: false, dueDate: "", importance: "mid" };
  }

  const text = typeof task?.text === "string" ? task.text : "";
  const dueDate = typeof task?.dueDate === "string" ? task.dueDate : "";
  const importance = VALID_IMPORTANCE.has(task?.importance) ? task.importance : "mid";

  return {
    text,
    done: Boolean(task?.done),
    dueDate,
    importance
  };
}

function loadTasks() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeTask).filter((task) => task.text.trim() !== "");
  } catch {
    return [];
  }
}

function initializeTasks() {
  const isResetDone = localStorage.getItem(RESET_FLAG_KEY) === "1";
  if (!isResetDone) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    localStorage.setItem(RESET_FLAG_KEY, "1");
    return [];
  }
  return loadTasks();
}

function formatDueDate(dateValue) {
  if (!dateValue) return "Not set";
  const parts = dateValue.split("-");
  if (parts.length !== 3) return dateValue;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

let tasks = initializeTasks();

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function displayTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");

    const content = document.createElement("div");
    content.className = "task-content";

    const title = document.createElement("div");
    title.className = "task-text";
    title.textContent = task.text;
    if (task.done) {
      title.classList.add("done");
    }

    title.addEventListener("click", () => {
      tasks[index].done = !tasks[index].done;
      saveTasks();
      displayTasks();
    });

    const meta = document.createElement("div");
    meta.className = "task-meta";

    const dueDate = document.createElement("span");
    dueDate.textContent = `Due: ${formatDueDate(task.dueDate)}`;

    const importance = document.createElement("span");
    importance.className = `importance-badge importance-${task.importance}`;
    importance.textContent = task.importance.toUpperCase();

    meta.appendChild(dueDate);
    meta.appendChild(importance);

    content.appendChild(title);
    content.appendChild(meta);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.type = "button";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
      tasks.splice(index, 1);
      saveTasks();
      displayTasks();
    });

    li.appendChild(content);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
}

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const dueDateInput = document.getElementById("dueDateInput");
  const importanceInput = document.getElementById("importanceInput");

  const text = taskInput.value.trim();
  const dueDate = dueDateInput.value;
  const importance = importanceInput.value;

  if (!text || !dueDate || !VALID_IMPORTANCE.has(importance)) return;

  tasks.push({ text, dueDate, importance, done: false });
  saveTasks();

  taskInput.value = "";
  dueDateInput.value = "";
  importanceInput.value = "mid";

  displayTasks();
}

const taskForm = document.getElementById("taskForm");
taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addTask();
});

displayTasks();
