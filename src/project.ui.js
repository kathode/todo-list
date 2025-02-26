import { BaseClass } from "./base.logic";
import { createElement, displayModal } from "./helper";
import { LocalStorageService } from "./localStorage.service";

export const displayProjectItem = (projectItemData, projectClass) => {
  const baseClass = new BaseClass(new LocalStorageService("todo"));
  const count = baseClass.getArray().reduce((total, arr) => (arr.project === projectItemData.id ? total + 1 : total), 0);

  const projectCount = createElement("div", { innerText: count });
  const projectTitle = createElement("div", { innerText: projectItemData.title });
  const project = createElement("div", { className: "project-name", id: `project-${projectItemData?.id}` }, projectTitle, projectCount);

  project.addEventListener("click", () => {
    displayProjectModal(projectItemData.id, projectClass);
  });

  const projectList = document.querySelector(".projects-view");
  projectList.append(project);
};

export const displayProjectModal = (id, projectClass) => {
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
    const todoItem = document.querySelector(`#project-${projectData.id}`);
    todoItem.remove();
    projectClass.removeItem(projectData.id);

    // all.style.setProperty("--all-view", projectClass.getTodoType("ALL").length);
    // today.style.setProperty("--today-view", projectClass.getTodoType("TODAY").length);
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
    }

    // updateTodoItemInDOM(newData);
    // all.style.setProperty("--all-view", projectClass.getTodoType("ALL").length);
    // today.style.setProperty("--today-view", projectClass.getTodoType("TODAY").length);
    modal.close();
  });
};

const projectForm = (data, isNew) => {
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

  let formButtonChildren = [removeButton, closeButton, saveButton];
  if (isNew || data.id === 1) formButtonChildren = formButtonChildren.filter((child) => child.innerText !== "delete");

  const form = createElement("form", { className: "form", id: data.id }, titleFormGroup, ...formButtonChildren);

  return { form, closeButton, removeButton };
};
