import { ToDoList } from "./logic";
import { LocalStorageService } from "./localStorage.service";
import "./styles.css";
import { displayModal, displayTodoItem } from "./todo.ui";

const newTodo = document.querySelector(".new-todo-button");
const todoList = document.querySelector(".todo-list");

(function () {
  const todos = new ToDoList(new LocalStorageService());

  for (const todo of todos.getTodos()) {
    displayTodoItem(todo, todos);
  }

  newTodo.addEventListener("click", () => {
    displayModal(null, todos);
  });

  const all = document.querySelector("#all");
  const today = document.querySelector("#today");

  all.style.setProperty("--all-view", todos.getTodoType("ALL").length);
  today.style.setProperty("--today-view", todos.getTodoType("TODAY").length);

  newTodo.addEventListener("click", () => {
    all.style.setProperty("--all-view", todos.getTodoType("ALL").length);
    today.style.setProperty("--today-view", todos.getTodoType("TODAY").length);
  });

  all.addEventListener("click", () => {
    todoList.innerHTML = "";
    for (const todo of todos.getTodoType("ALL")) {
      displayTodoItem(todo, todos);
    }
  });

  today.addEventListener("click", () => {
    todoList.innerHTML = "";
    for (const todo of todos.getTodoType("TODAY")) {
      displayTodoItem(todo, todos);
    }
  });
})();
