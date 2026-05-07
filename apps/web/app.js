import { createTaskStore } from "./store.js";

const STORAGE_KEY = "ai-enderun-frontops-v1";

function loadSeed() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const store = createTaskStore(loadSeed());

const taskForm = document.querySelector("#task-form");
const titleInput = document.querySelector("#task-title");
const listEl = document.querySelector("#task-list");
const statusEl = document.querySelector("#status");

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store.list()));
}

function setStatus(text, type = "info") {
  statusEl.textContent = text;
  statusEl.dataset.type = type;
}

function taskItemTemplate(task) {
  const li = document.createElement("li");
  li.className = "task-item";

  const title = document.createElement("span");
  title.className = "task-title";
  title.textContent = task.title;

  const editBtn = document.createElement("button");
  editBtn.type = "button";
  editBtn.className = "ghost";
  editBtn.textContent = "Düzenle";

  editBtn.addEventListener("click", () => {
    const newTitle = window.prompt("Yeni görev başlığı", task.title);
    if (newTitle === null) return;

    try {
      store.edit(task.id, newTitle);
      persist();
      render();
      setStatus("Görev düzenlendi.", "success");
    } catch (error) {
      setStatus(error.message, "error");
    }
  });

  li.append(title, editBtn);
  return li;
}

function render() {
  const items = store.list();
  listEl.innerHTML = "";

  if (items.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = "Henüz görev yok. İlk görevi ekle.";
    listEl.appendChild(empty);
    return;
  }

  for (const task of items) {
    listEl.appendChild(taskItemTemplate(task));
  }
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  try {
    store.add(titleInput.value);
    titleInput.value = "";
    persist();
    render();
    setStatus("Görev eklendi.", "success");
  } catch (error) {
    setStatus(error.message, "error");
  }
});

render();
setStatus("Hazır: Ekle ve düzenle işlemlerini test edebilirsin.");
