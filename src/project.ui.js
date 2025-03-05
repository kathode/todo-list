import { createElement, displayModal } from "./helper";
import { LocalStorageService } from "./localStorage.service";
import { Todo } from "./todo.logic";
import { displayTodoItem } from "./todo.ui";

// Add titles to project, todo modals
// Fix modal button styles
// Fix reassigning projects not being updated in DOM

export const displayProjectItem = (projectItemData, projectClass) => {
  const todo = new Todo(new LocalStorageService("todo"));
  const count = todo.getProjectCount(projectItemData.id);

  const projectTitle = createElement("div", { innerText: projectItemData.title, className: "project-title" });
  const projectCount = createElement("div", { innerText: count, className: "project-count" });
  const project = createElement("div", { className: "project-name", id: `project-${projectItemData?.id}` }, projectTitle, projectCount);
  const todoList = document.querySelector(".todo-list");

  project.addEventListener("click", (event) => {
    const edit = event.target.className === "project-count";
    const projectsView = document.querySelector(".projects-view");
    const all = document.querySelector("#all");
    const today = document.querySelector("#today");

    if (edit) {
      displayProjectModal(projectItemData.id, projectClass);
    } else {
      for (const proj of projectsView.children) {
        proj.classList.remove("active");
      }
      today.classList.remove("active");
      all.classList.remove("active");
      todoList.innerHTML = "";

      for (const todoItem of todo.getTodoType(projectItemData.id)) {
        displayTodoItem(todoItem, todo);
      }

      project.classList.add("active");
    }
  });

  const projectList = document.querySelector(".projects-view");
  projectList.append(project);
};

export const displayProjectModal = (id, projectClass) => {
  const todo = new Todo(new LocalStorageService("todo"));
  const isNew = id === null;

  const defaultData = {
    id: projectClass.getIdCounter(),
    title: "",
  };

  const projectData = id ? projectClass.getItem(id) : defaultData;

  const { form, closeButton, removeButton } = projectForm(projectData, isNew);
  const modal = displayModal(form);

  closeButton.addEventListener("click", () => {
    modal.close();
  });

  removeButton.addEventListener("click", () => {
    const projectItem = document.querySelector(`#project-${projectData.id}`);
    projectItem.remove();
    projectClass.removeItem(projectData.id);
    const removedTodoItems = todo.removeItemsByProject(projectData.id);

    for (const todoItemData of removedTodoItems) {
      const todoItem = document.querySelector(`#todo-item-${todoItemData.id}`);
      todoItem.remove();
    }

    const all = document.querySelector("#all");
    const today = document.querySelector("#today");
    all.style.setProperty("--all-view", todo.getTodoType("ALL").length);
    today.style.setProperty("--today-view", todo.getTodoType("TODAY").length);
    modal.close();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const newData = { ...projectData };
    for (const [key, value] of formData.entries()) {
      newData[key] = value;
    }

    if (isNew) {
      projectClass.addItem(newData);
      displayProjectItem(newData, projectClass);
    } else {
      projectClass.editItem(newData);
      updateProjectTitleInDOM(newData);
    }
    modal.close();
  });
};

const projectForm = (data, isNew) => {
  const modalTitle = createElement("h5", { innerText: "Add Project" });
  const titleLabel = createElement("label", { innerText: "Title", for: "title" });
  const titleInput = createElement("input", {
    type: "text",
    id: "title",
    name: "title",
    required: true,
    value: data?.title ?? "",
    disabled: data.id === 1,
  });
  const titleFormGroup = createElement("form-group", {}, titleLabel, titleInput);
  const removeButton = createElement("button", { innerText: "delete", type: "button" });
  const closeButton = createElement("button", { innerText: "close", type: "button" });
  const saveButton = createElement("button", { innerText: "save", type: "submit" });
  modalTitle.style.margin = "0 0 1rem 0";

  let formButtonChildren = [removeButton, closeButton, saveButton];
  if (isNew || data.id === 1) formButtonChildren = formButtonChildren.filter((child) => child.innerText !== "delete");

  const form = createElement("form", { className: "form", id: data.id }, modalTitle, titleFormGroup, ...formButtonChildren);

  return { form, closeButton, removeButton };
};

const updateProjectTitleInDOM = (newData) => {
  const projectTitle = document.querySelector(`#project-${newData.id} .project-title`);
  projectTitle.innerText = newData.title;
};
