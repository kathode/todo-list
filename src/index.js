import { Todo } from "./todo.logic";
import { LocalStorageService } from "./localStorage.service";
import "./styles.css";
import { displayTaskModal, displayTodoItem } from "./todo.ui";

const newTodo = document.querySelector(".new-todo-button");
const todoList = document.querySelector(".todo-list");

(function () {
  const todoClass = new Todo(new LocalStorageService("todo"));

  for (const todo of todoClass.getArray()) {
    displayTodoItem(todo, todoClass);
  }

  newTodo.addEventListener("click", () => {
    displayTaskModal(null, todoClass);
  });

  const all = document.querySelector("#all");
  const today = document.querySelector("#today");

  all.style.setProperty("--all-view", todoClass.getTodoType("ALL").length);
  today.style.setProperty("--today-view", todoClass.getTodoType("TODAY").length);

  newTodo.addEventListener("click", () => {
    all.style.setProperty("--all-view", todoClass.getTodoType("ALL").length);
    today.style.setProperty("--today-view", todoClass.getTodoType("TODAY").length);
  });

  all.addEventListener("click", () => {
    todoList.innerHTML = "";
    for (const todo of todoClass.getTodoType("ALL")) {
      displayTodoItem(todo, todoClass);
    }
  });

  today.addEventListener("click", () => {
    todoList.innerHTML = "";
    for (const todo of todoClass.getTodoType("TODAY")) {
      displayTodoItem(todo, todoClass);
    }
  });
})();
