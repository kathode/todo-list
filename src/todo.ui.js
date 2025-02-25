import { createElement, displayModal, selectOptions } from "./helper";
import { format } from "date-fns";

export const displayTodoItem = (todoItemData, TodoClass) => {
  const checkbox = createElement("input", { className: "todo-checkbox", type: "checkbox", checked: todoItemData?.isComplete });
  const titleDisplay = createElement("div", {
    className: `todo-title  ${todoItemData?.isComplete ? "todo-complete" : ""}`,
    innerText: todoItemData?.title,
  });
  const dueDateDisplay = createElement("div", {
    className: "todo-due-date",
    innerText: todoItemData?.dueDate ? format(new Date(todoItemData?.dueDate), "EEE, dd MMM yyy") : "",
  });
  const column1 = createElement("div", { className: "todo-wrapper" }, checkbox, titleDisplay);
  const column2 = createElement("div", { className: "todo-wrapper" }, dueDateDisplay);
  const todo = createElement("div", { className: `todo-item ${todoItemData?.priority}`, id: `todo-item-${todoItemData?.id}` }, column1, column2);

  checkbox.addEventListener("click", (event) => {
    const isComplete = event.target.checked;
    TodoClass.editItem({ ...todoItemData, isComplete });

    if (isComplete) {
      titleDisplay.classList.add("todo-complete");
    } else {
      titleDisplay.classList.remove("todo-complete");
    }
  });

  todo.addEventListener("click", (event) => {
    if (event.target.type === "checkbox") return;
    displayTaskModal(todoItemData.id, TodoClass);
  });

  const todoList = document.querySelector(".todo-list");
  todoList.append(todo);
};

export const displayTaskModal = (id, TodoClass) => {
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
    project: 1,
    isComplete: false,
  };

  const todoItemData = id ? TodoClass.getItem(id) : defaultData;
  const { form, closeButton, removeButton } = taskForm(todoItemData, isNew);
  const modal = displayModal(form);

  closeButton.addEventListener("click", () => {
    modal.close();
  });

  removeButton.addEventListener("click", () => {
    const todoItem = document.querySelector(`#todo-item-${todoItemData.id}`);
    todoItem.remove();
    TodoClass.removeTodo(todoItemData.id);

    all.style.setProperty("--all-view", TodoClass.getTodoType("ALL").length);
    today.style.setProperty("--today-view", TodoClass.getTodoType("TODAY").length);
    modal.close();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const newData = { ...todoItemData };
    for (const [key, value] of formData.entries()) {
      newData[key] = value;
    }

    if (isNew) {
      TodoClass.addItem(newData);
      displayTodoItem(newData, TodoClass);
    } else {
      TodoClass.editItem(newData);
    }

    updateTodoItemInDOM(newData);
    all.style.setProperty("--all-view", TodoClass.getTodoType("ALL").length);
    today.style.setProperty("--today-view", TodoClass.getTodoType("TODAY").length);
    modal.close();
  });
};

const projectForm = (data, isNew) => {
  const titleLabel = createElement("label", { innerText: "Title", for: "title" });
  const titleInput = createElement("input", { type: "text", id: "title", name: "title", required: true });
  const titleFormGroup = createElement("form-group", {}, titleLabel, titleInput);

  const removeButton = createElement("button", { innerText: "delete", type: "button" });
  const closeButton = createElement("button", { innerText: "close", type: "button" });
  const saveButton = createElement("button", { innerText: "save", type: "submit" });

  let formButtonChildren = [removeButton, closeButton, saveButton];
  if (isNew) formButtonChildren = formButtonChildren.filter((child) => child.innerText !== "delete");

  const form = createElement("form", { className: "form", id: data.id }, titleFormGroup, ...formButtonChildren);

  return { form, closeButton, removeButton };
};

const taskForm = (data, isNew) => {
  const priorityOptions = [
    { innerText: "Low", value: "low" },
    { innerText: "Medium", value: "medium" },
    { innerText: "High", value: "high" },
  ];

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
  const priorityInput = createElement("select", { id: "priority", name: "priority" }, ...selectOptions(priorityOptions, data.priority));
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
