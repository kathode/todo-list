import { createElement } from "./helper";

export const ToDoItemUI = (title, dueDate) => {
  const checkbox = createElement("input", { type: "checkbox" });
  const title = createElement("div", { innerText: "hello" });
  const edit = createElement("button", { className: "", innerText: "View" });
  const dueDate = createElement("div", { innerText: "17 June" });
  const removeButton = createElement("button", { innerText: "Remove" });

  const column1 = createElement("div", { className: "todo-wrapper" }, checkbox, title);
  const column2 = createElement("div", { className: "todo-wrapper" }, edit, dueDate, removeButton);
  const todo = createElement("div", { className: "todo-item" }, column1, column2);

  const todoList = document.querySelector("#todo-list");
  todoList.append(todo);
};
