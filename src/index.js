import { Todo } from "./todo.logic";
import { LocalStorageService } from "./localStorage.service";
import "./styles.css";
import { displayTaskModal, displayTodoItem } from "./todo.ui";
import { Project } from "./project.logic";
import { displayProjectItem, displayProjectModal } from "./project.ui";

const newTodo = document.querySelector(".new-todo-button");
const newProject = document.querySelector(".new-project-button");
const todoList = document.querySelector(".todo-list");

(function () {
  const todoClass = new Todo(new LocalStorageService("todo"));
  const projectClass = new Project(new LocalStorageService("project"));

  // adds the Default project when the default project is not defined in memory
  if (!projectClass.getItem(1)) {
    projectClass.addItem({ id: 1, title: "Default" });
  }

  for (const todo of todoClass.getArray()) {
    displayTodoItem(todo, todoClass);
  }

  for (const project of projectClass.getArray()) {
    displayProjectItem(project, projectClass);
  }

  newTodo.addEventListener("click", () => {
    displayTaskModal(null, todoClass);
  });

  newProject.addEventListener("click", () => {
    displayProjectModal(null, projectClass);
  });

  const all = document.querySelector("#all");
  const today = document.querySelector("#today");
  const projectsView = document.querySelector(".projects-view");

  all.style.setProperty("--all-view", todoClass.getTodoType("ALL").length);
  today.style.setProperty("--today-view", todoClass.getTodoType("TODAY").length);

  newTodo.addEventListener("click", () => {
    all.style.setProperty("--all-view", todoClass.getTodoType("ALL").length);
    today.style.setProperty("--today-view", todoClass.getTodoType("TODAY").length);
  });

  all.addEventListener("click", () => {
    const todoClass = new Todo(new LocalStorageService("todo"));
    all.classList.add("active");
    today.classList.remove("active");
    for (const proj of projectsView.children) {
      proj.classList.remove("active");
    }

    todoList.innerHTML = "";
    for (const todo of todoClass.getTodoType("ALL")) {
      displayTodoItem(todo, todoClass);
    }
  });

  today.addEventListener("click", () => {
    const todoClass = new Todo(new LocalStorageService("todo"));
    today.classList.add("active");
    all.classList.remove("active");
    for (const proj of projectsView.children) {
      proj.classList.remove("active");
    }

    todoList.innerHTML = "";
    for (const todo of todoClass.getTodoType("TODAY")) {
      displayTodoItem(todo, todoClass);
    }
  });
})();
