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

function renderCompletedTasks() {
  const completedTaskList = document.getElementById("completedTaskList");
  const completedEmptyState = document.getElementById("completedEmptyState");

  if (!completedTaskList || !completedEmptyState) return;

  const completed = tasks.filter((task) => task.done);
  completedTaskList.innerHTML = "";

  if (completed.length === 0) {
    completedEmptyState.hidden = false;
    return;
  }

  completedEmptyState.hidden = true;

  completed.forEach((task) => {
    const item = document.createElement("li");
    item.className = "completed-item";

    const title = document.createElement("div");
    title.className = "completed-title";
    title.textContent = task.text;

    const meta = document.createElement("div");
    meta.className = "completed-meta";

    const due = document.createElement("span");
    due.textContent = `Due: ${formatDueDate(task.dueDate)}`;

    const level = document.createElement("span");
    level.className = `importance-badge importance-${task.importance}`;
    level.textContent = task.importance.toUpperCase();

    meta.appendChild(due);
    meta.appendChild(level);

    item.appendChild(title);
    item.appendChild(meta);
    completedTaskList.appendChild(item);
  });
}

function displayTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  if (tasks.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty-row";
    empty.textContent = "No tasks yet. Add your first task.";
    list.appendChild(empty);
    renderCompletedTasks();
    return;
  }

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "task-item";

    const completeBtn = document.createElement("button");
    completeBtn.className = "complete-btn";
    completeBtn.type = "button";
    completeBtn.innerHTML = "<span aria-hidden=\"true\">&#10003;</span><span class=\"sr-only\">Completed</span>";
    completeBtn.setAttribute("aria-label", task.done ? "Task completed" : "Mark task as completed");

    if (task.done) {
      completeBtn.classList.add("is-done");
      completeBtn.disabled = true;
    }

    completeBtn.addEventListener("click", () => {
      tasks[index].done = true;
      saveTasks();
      displayTasks();
    });

    const content = document.createElement("div");
    content.className = "task-content";

    const title = document.createElement("div");
    title.className = "task-text";
    title.textContent = task.text;
    if (task.done) {
      title.classList.add("done");
    }

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

    li.appendChild(completeBtn);
    li.appendChild(content);
    list.appendChild(li);
  });

  renderCompletedTasks();
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

function openSettingsModal() {
  const modal = document.getElementById("settingsModal");
  if (!modal) return;
  renderCompletedTasks();
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
}

function closeSettingsModal() {
  const modal = document.getElementById("settingsModal");
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
}

const taskForm = document.getElementById("taskForm");
const settingsBtn = document.getElementById("settingsBtn");
const closeSettingsBtn = document.getElementById("closeSettingsBtn");
const settingsModal = document.getElementById("settingsModal");

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addTask();
});

settingsBtn.addEventListener("click", openSettingsModal);
closeSettingsBtn.addEventListener("click", closeSettingsModal);

settingsModal.addEventListener("click", (event) => {
  if (event.target === settingsModal) {
    closeSettingsModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeSettingsModal();
  }
});

displayTasks();
