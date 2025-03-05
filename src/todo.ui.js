import { createElement, displayModal, selectOptions } from "./helper";
import { format } from "date-fns";
import { LocalStorageService } from "./localStorage.service";

const priorityOptions = [
  { id: 1, innerText: "Low", value: "low" },
  { id: 2, innerText: "Medium", value: "medium" },
  { id: 3, innerText: "High", value: "high" },
];

const getPriority = (todo) => priorityOptions.find((p) => p.id === todo.priority).value;

export const displayTodoItem = (todoItemData, todoClass) => {
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
  const todo = createElement("div", { className: `todo-item ${getPriority(todoItemData)}`, id: `todo-item-${todoItemData?.id}` }, column1, column2);

  checkbox.addEventListener("click", (event) => {
    const isComplete = event.target.checked;
    todoClass.editItem({ ...todoItemData, isComplete });

    if (isComplete) {
      titleDisplay.classList.add("todo-complete");
    } else {
      titleDisplay.classList.remove("todo-complete");
    }
  });

  todo.addEventListener("click", (event) => {
    if (event.target.type === "checkbox") return;
    displayTaskModal(todoItemData.id, todoClass);
  });

  const todoList = document.querySelector(".todo-list");
  todoList.append(todo);
};

export const displayTaskModal = (id, todoClass) => {
  const isNew = id === null;
  const all = document.querySelector("#all");
  const today = document.querySelector("#today");

  const defaultData = {
    id: todoClass.getIdCounter(),
    title: "",
    description: "",
    notes: "notes",
    dueDate: "",
    priority: "low",
    project: 1,
    isComplete: false,
  };

  const todoItemData = id ? todoClass.getItem(id) : defaultData;
  const { form, closeButton, removeButton } = taskForm(todoItemData, isNew);
  const modal = displayModal(form);

  closeButton.addEventListener("click", () => {
    modal.close();
  });

  removeButton.addEventListener("click", () => {
    const todoItem = document.querySelector(`#todo-item-${todoItemData.id}`);
    todoItem.remove();
    todoClass.removeItem(todoItemData.id);

    updateProjectCountInDOM(todoClass);
    all.style.setProperty("--all-view", todoClass.getTodoType("ALL").length);
    today.style.setProperty("--today-view", todoClass.getTodoType("TODAY").length);
    modal.close();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const find = document.querySelector(".active");
    const todoList = document.querySelector(".todo-list");
    let todoType = "";

    if (find.id.includes("project")) {
      todoType = Number(find.id.replace("project-", ""));
    }
    if (find.id.includes("all")) {
      todoType = "ALL";
    }
    if (find.id.includes("today")) {
      todoType = "TODAY";
    }

    const newData = { ...todoItemData };
    for (const [key, value] of formData.entries()) {
      if (key === "project" || key === "priority") {
        const select = event.target.querySelector(`select[name=${key}]`);
        const selectedOption = select.options[select.selectedIndex];
        newData[key] = Number(selectedOption.id);
      } else newData[key] = value;
    }

    if (isNew) {
      todoClass.addItem(newData);
      displayTodoItem(newData, todoClass);
    } else {
      todoClass.editItem(newData);

      todoList.innerHTML = "";
      for (const todo of todoClass.getTodoType(todoType)) {
        displayTodoItem(todo, todoClass);
      }
    }

    updateTodoItemInDOM(newData);
    updateProjectCountInDOM(todoClass);
    all.style.setProperty("--all-view", todoClass.getTodoType("ALL").length);
    today.style.setProperty("--today-view", todoClass.getTodoType("TODAY").length);
    modal.close();
  });
};

// prettier-ignore
const taskForm = (data, isNew) => {
  const projectList = new LocalStorageService("project");
  const projectListParsed = projectList.load().map((p) => ({id:p.id, value: p.title, innerText: p.title }));
  const getProjectName = projectListParsed.find(p => p.id === data.project).value
  const modalTitle = createElement("h5", { innerText:isNew? "Add Todo": "Edit Todo"});
  modalTitle.style.margin = "0 0 1rem 0";

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
  const projectInput = createElement("select",{ id: "project", name: "project", value: getProjectName }, ...selectOptions(projectListParsed, data.project));
  const projectFormGroup = createElement("form-group", {}, projectLabel, projectInput);

  const removeButton = createElement("button", { innerText: "delete", type: "button" });
  const closeButton = createElement("button", { innerText: "close", type: "button" });
  const saveButton = createElement("button", { innerText: "save", type: "submit" });

  let formButtonChildren = [removeButton, closeButton, saveButton];
  if (isNew) formButtonChildren = formButtonChildren.filter((child) => child.innerText !== "delete");

  const formButtons = createElement("div", {}, ...formButtonChildren);
  const formChildren = [modalTitle, titleFormGroup, descriptionFormGroup, dueDateFormGroup, priorityFormGroup, projectFormGroup, formButtons];
  const form = createElement("form", { className: "form", id: data.id }, ...formChildren);

  return { form, closeButton, removeButton };
};

const updateTodoItemInDOM = (updatedTodo) => {
  const todoElement = document.getElementById(`todo-item-${updatedTodo.id}`);

  if (todoElement) {
    todoElement.querySelector(".todo-title").innerText = updatedTodo.title;
    todoElement.querySelector(".todo-due-date").innerText = format(new Date(updatedTodo.dueDate), "EEE, dd MMM yyy");
    todoElement.className = `todo-item ${getPriority(updatedTodo)}`;
  }
};

const updateProjectCountInDOM = (todoClass) => {
  const projectList = new LocalStorageService("project");

  for (const project of projectList.load()) {
    const projectCount = document.querySelector(`#project-${project.id} .project-count`);
    projectCount.innerText = todoClass.getProjectCount(project.id);
  }
};
