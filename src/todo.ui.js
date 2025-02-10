import { createElement } from "./helper";

export const createTodoItem = (data, ToDoList) => {
  const checkbox = createElement("input", { className: "todo-checkbox", type: "checkbox", checked: data.isComplete });
  const titleDisplay = createElement("div", { className: "todo-title", innerText: data.title });
  const editButton = createElement("button", { className: "todo-edit-button", innerText: "View" });
  const dueDateDisplay = createElement("div", { className: "todo-due-date", innerText: data.dueDate });
  const removeButton = createElement("button", { className: "todo-remove-button", innerText: "Remove" });

  removeButton.addEventListener("click", () => {
    ToDoList.removeTodo(data.id);
    removeButton.closest(".todo-item").remove();
  });

  const column1 = createElement("div", { className: "todo-wrapper" }, checkbox, titleDisplay);
  const column2 = createElement("div", { className: "todo-wrapper" }, editButton, dueDateDisplay, removeButton);
  const todo = createElement("div", { className: "todo-item" }, column1, column2);

  const todoList = document.querySelector("#todo-list");
  todoList.append(todo);
};
