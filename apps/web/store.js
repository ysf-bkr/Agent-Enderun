const DEFAULT_ITEMS = [];

function normalizeText(value) {
  return String(value || "").trim();
}

function createId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `task-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

export function createTaskStore(seed = DEFAULT_ITEMS) {
  const state = {
    items: Array.isArray(seed)
      ? seed.map((item) => ({ ...item }))
      : [],
  };

  function list() {
    return state.items.map((item) => ({ ...item }));
  }

  function add(text) {
    const title = normalizeText(text);
    if (!title) {
      throw new Error("Task title cannot be empty.");
    }

    const item = {
      id: createId(),
      title,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    state.items = [item, ...state.items];
    return { ...item };
  }

  function edit(id, text) {
    const title = normalizeText(text);
    if (!title) {
      throw new Error("Updated task title cannot be empty.");
    }

    let updated = null;
    state.items = state.items.map((item) => {
      if (item.id !== id) return item;
      updated = {
        ...item,
        title,
        updatedAt: new Date().toISOString(),
      };
      return updated;
    });

    if (!updated) {
      throw new Error("Task not found.");
    }
    return { ...updated };
  }

  return { list, add, edit };
}
