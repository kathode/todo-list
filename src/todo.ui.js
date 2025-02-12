import { createElement } from "./helper";

export const displayTodoItem = (data, TodoClass) => {
  const checkbox = createElement("input", { className: "todo-checkbox", type: "checkbox", checked: data.isComplete });
  const titleDisplay = createElement("div", { className: `todo-title  ${data.isComplete ? "todo-complete" : ""}`, innerText: data.title });
  const dueDateDisplay = createElement("div", { className: "todo-due-date", innerText: data.dueDate });
  const column1 = createElement("div", { className: "todo-wrapper" }, checkbox, titleDisplay);
  const column2 = createElement("div", { className: "todo-wrapper" }, dueDateDisplay);
  const todo = createElement("div", { className: `todo-item ${data.priority}`, id: `todo-item-${data.id}` }, column1, column2);

  checkbox.addEventListener("click", (event) => {
    const isComplete = event.target.checked;
    TodoClass.completeTodo(data.id, isComplete);

    if (isComplete) {
      titleDisplay.classList.add("todo-complete");
    } else {
      titleDisplay.classList.remove("todo-complete");
    }
  });

  todo.addEventListener("click", (event) => {
    if (event.target.type === "checkbox") return;
    displayModal(data, TodoClass);
  });

  const todoList = document.querySelector("#todo-list");
  todoList.append(todo);
};

export const displayModal = (data, TodoClass) => {
  const body = document.querySelector("body");

  const titleLabel = createElement("label", { innerText: "Title", for: "title" });
  const titleInput = createElement("input", { type: "text", id: "title", name: "title", value: data?.title ?? "" });
  const titleFormGroup = createElement("form-group", {}, titleLabel, titleInput);

  const descriptionLabel = createElement("label", { innerText: "Description", for: " description" });
  const descriptionInput = createElement("input", { type: "text", id: " description", name: "description", value: data?.description ?? "" });
  const descriptionFormGroup = createElement("form-group", {}, descriptionLabel, descriptionInput);

  const dueDateLabel = createElement("label", { innerText: "Due Date", for: "dueDate" });
  const dueDateInput = createElement("input", { type: "date", id: "dueDate", name: "dueDate", value: data?.dueDate ?? "" });
  const dueDateFormGroup = createElement("form-group", {}, dueDateLabel, dueDateInput);

  const priorityLabel = createElement("label", { innerText: "Priority", for: "priority" });
  const lowOption = createElement("option", { innerText: "Low", value: "low" });
  const medOption = createElement("option", { innerText: "Medium", value: "medium" });
  const highOption = createElement("option", { innerText: "High", value: "high" });
  const priorityInput = createElement(
    "select",
    { id: "priority", name: "priority", value: data?.priority ?? "low" },
    lowOption,
    medOption,
    highOption
  );
  const priorityFormGroup = createElement("form-group", {}, priorityLabel, priorityInput);

  const projectLabel = createElement("label", { innerText: "Project", for: "project" });
  const defaultOption = createElement("option", { innerText: "Default", value: "default" });
  const projectInput = createElement("select", { id: "project", name: "project", value: data?.project ?? "default" }, defaultOption);
  const projectFormGroup = createElement("form-group", {}, projectLabel, projectInput);

  const removeButton = createElement("button", { innerText: "remove", type: "button" });
  const closeButton = createElement("button", { innerText: "close", type: "button" });
  const saveButton = createElement("input", { value: "ss", type: "submit" });

  removeButton.addEventListener("click", () => {
    const todoItem = document.querySelector(`#todo-item-${data.id}`);
    todoItem.remove();
    TodoClass.removeTodo(data.id);
    modal.close();
  });

  const form = createElement(
    "form",
    { className: "form", id: data.id },
    titleFormGroup,
    descriptionFormGroup,
    dueDateFormGroup,
    priorityFormGroup,
    projectFormGroup,
    removeButton,
    closeButton,
    saveButton
  );

  const modal = createElement("dialog", { className: "modal" }, form);

  body.append(modal);
  modal.showModal();

  closeButton.addEventListener("click", () => {
    modal.close();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const newData = { ...data };
    for (const [key, value] of formData.entries()) {
      newData[key] = value;
    }

    TodoClass.editTodo(newData);
    updateTodoItemInDOM(newData);
    modal.close();
  });
};

const updateTodoItemInDOM = (updatedTodo) => {
  const todoElement = document.getElementById(`todo-item-${updatedTodo.id}`);

  if (todoElement) {
    todoElement.querySelector(".todo-title").innerText = updatedTodo.title;
    todoElement.querySelector(".todo-due-date").innerText = updatedTodo.dueDate;
    todoElement.className = `todo-item ${updatedTodo.priority.toLowerCase()}`;
  }
};
