import { createElement } from "./helper";
import { format } from "date-fns";

export const displayTodoItem = (data, TodoClass) => {
  const checkbox = createElement("input", { className: "todo-checkbox", type: "checkbox", checked: data?.isComplete });
  const titleDisplay = createElement("div", { className: `todo-title  ${data?.isComplete ? "todo-complete" : ""}`, innerText: data?.title });
  const dueDateDisplay = createElement("div", {
    className: "todo-due-date",
    innerText: data?.dueDate ? format(new Date(data?.dueDate), "EEE, dd MMM yyy") : "",
  });
  const column1 = createElement("div", { className: "todo-wrapper" }, checkbox, titleDisplay);
  const column2 = createElement("div", { className: "todo-wrapper" }, dueDateDisplay);
  const todo = createElement("div", { className: `todo-item ${data?.priority}`, id: `todo-item-${data?.id}` }, column1, column2);

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
    displayModal(data.id, TodoClass);
  });

  const todoList = document.querySelector(".todo-list");
  todoList.append(todo);
};

export const displayModal = (id, TodoClass) => {
  const isNew = id === null;
  const all = document.querySelector("#all");
  const today = document.querySelector("#today");

  const defaultData = {
    id: TodoClass.getIdCounter(),
    title: "",
    description: "",
    notes: "notes",
    dueDate: "",
    priority: "low",
    isComplete: false,
  };

  const data = id ? TodoClass.getTodo(id) : defaultData;
  const body = document.querySelector("body");
  const { form, closeButton, removeButton } = taskForm(data, isNew);

  const modal = createElement("dialog", { className: "modal" }, form);

  body.append(modal);
  modal.showModal();

  closeButton.addEventListener("click", () => {
    modal.close();
  });

  removeButton.addEventListener("click", () => {
    const todoItem = document.querySelector(`#todo-item-${data.id}`);
    todoItem.remove();
    TodoClass.removeTodo(data.id);

    all.style.setProperty("--all-view", TodoClass.getTodoType("ALL").length);
    today.style.setProperty("--today-view", TodoClass.getTodoType("TODAY").length);
    modal.close();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const newData = { ...data };
    for (const [key, value] of formData.entries()) {
      newData[key] = value;
    }

    if (isNew) {
      TodoClass.addTodo(newData);
      displayTodoItem(newData, TodoClass);
    } else {
      TodoClass.editTodo(newData);
    }

    updateTodoItemInDOM(newData);
    all.style.setProperty("--all-view", TodoClass.getTodoType("ALL").length);
    today.style.setProperty("--today-view", TodoClass.getTodoType("TODAY").length);
    modal.close();
  });
};

const taskForm = (data, isNew) => {
  const titleLabel = createElement("label", { innerText: "Title", for: "title" });
  const titleInput = createElement("input", { type: "text", id: "title", name: "title", required: true, value: data?.title ?? "" });
  const titleFormGroup = createElement("form-group", {}, titleLabel, titleInput);

  const descriptionLabel = createElement("label", { innerText: "Description", for: " description" });
  const descriptionInput = createElement("input", { type: "text", id: " description", name: "description", value: data?.description ?? "" });
  const descriptionFormGroup = createElement("form-group", {}, descriptionLabel, descriptionInput);

  const dueDateLabel = createElement("label", { innerText: "Due Date", for: "dueDate" });
  const dueDateInput = createElement("input", { type: "date", id: "dueDate", name: "dueDate", required: true, value: data?.dueDate ?? "" });
  const dueDateFormGroup = createElement("form-group", {}, dueDateLabel, dueDateInput);

  const priorityLabel = createElement("label", { innerText: "Priority", for: "priority" });
  const lowOption = createElement("option", {
    id: "low-option",
    innerText: "Low",
    value: "low",
    selected: `${data?.priority === "low" ? "selected" : ""}`,
  });
  const medOption = createElement("option", {
    id: "medium-option",
    innerText: "Medium",
    value: "medium",
    selected: `${data?.priority === "medium" ? "selected" : ""}`,
  });
  const highOption = createElement("option", {
    id: "high-option",
    innerText: "High",
    value: "high",
    selected: `${data?.priority === "high" ? "selected" : ""}`,
  });

  const priorityInput = createElement("select", { id: "priority", name: "priority" }, lowOption, medOption, highOption);
  const priorityFormGroup = createElement("form-group", {}, priorityLabel, priorityInput);

  const projectLabel = createElement("label", { innerText: "Project", for: "project" });
  const defaultOption = createElement("option", { innerText: "Default", value: "default" });
  const projectInput = createElement("select", { id: "project", name: "project", value: data?.project ?? "default" }, defaultOption);
  const projectFormGroup = createElement("form-group", {}, projectLabel, projectInput);

  const removeButton = createElement("button", { innerText: "delete", type: "button" });
  const closeButton = createElement("button", { innerText: "close", type: "button" });
  const saveButton = createElement("button", { innerText: "save", type: "submit" });

  let formButtonChildren = [removeButton, closeButton, saveButton];
  if (isNew) formButtonChildren = formButtonChildren.filter((child) => child.innerText !== "delete");

  const formButtons = createElement("div", {}, ...formButtonChildren);
  const formChildren = [titleFormGroup, descriptionFormGroup, dueDateFormGroup, priorityFormGroup, projectFormGroup, formButtons];
  const form = createElement("form", { className: "form", id: data.id }, ...formChildren);

  return { form, closeButton, removeButton };
};

const updateTodoItemInDOM = (updatedTodo) => {
  const todoElement = document.getElementById(`todo-item-${updatedTodo.id}`);

  if (todoElement) {
    todoElement.querySelector(".todo-title").innerText = updatedTodo.title;
    todoElement.querySelector(".todo-due-date").innerText = format(new Date(updatedTodo.dueDate), "EEE, dd MMM yyy");
    todoElement.className = `todo-item ${updatedTodo.priority.toLowerCase()}`;
  }
};
