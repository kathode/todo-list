import { ToDoList } from "./logic";
import { LocalStorageService } from "./localStorage.service";
import "./styles.css";
import { displayTodoItem } from "./todo.ui";

const button = document.querySelector(".new-todo-button");

(function () {
  const todos = new ToDoList(new LocalStorageService());

  for (const todo of todos.getTodos()) {
    displayTodoItem(todo, todos);
  }

  // create hardcoded todo tasks for now
  button.addEventListener("click", () => {
    const newTodo = {
      id: todos.getIdCounter(),
      title: "abc",
      description: "description",
      notes: "notes",
      dueDate: "3 December",
      priority: "high",
      isComplete: false,
    };

    displayTodoItem(newTodo, todos);
    todos.addTodo(newTodo);
  });
})();
