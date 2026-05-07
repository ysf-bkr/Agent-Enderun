import assert from "node:assert/strict";
import { createTaskStore } from "./store.js";

const store = createTaskStore();
const first = store.add("İlk görev");
assert.equal(store.list().length, 1, "Add operation should create one record");
assert.equal(store.list()[0].title, "İlk görev");

store.edit(first.id, "Güncellenmiş görev");
assert.equal(store.list()[0].title, "Güncellenmiş görev", "Edit operation should update title");

let failed = false;
try {
  store.add("   ");
} catch {
  failed = true;
}
assert.equal(failed, true, "Empty add must fail");

console.log("STORE_TEST_OK");
