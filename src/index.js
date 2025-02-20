import { ToDoList } from "./logic";
import { LocalStorageService } from "./localStorage.service";
import "./styles.css";
import { displayModal, displayTodoItem } from "./todo.ui";

const newTodo = document.querySelector(".new-todo-button");

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

  all.style.setProperty("--all-view", todos.getTodoType("ALL"));
  today.style.setProperty("--today-view", todos.getTodoType("TODAY"));

  newTodo.addEventListener("click", () => {
    all.style.setProperty("--all-view", todos.getTodoType("ALL"));
    today.style.setProperty("--today-view", todos.getTodoType("TODAY"));
  });
})();
