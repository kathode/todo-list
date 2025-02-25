import { format } from "date-fns";
import { BaseClass } from "./base.logic";

export class Todo extends BaseClass {
  constructor(storageService) {
    super(storageService);
    this.todos = this.storageService.load();
  }

  getTodoType(type) {
    switch (type) {
      case "ALL":
        return this.todos;
      case "TODAY":
        return this.todos.filter((todo) => format(new Date(todo.dueDate), "EEE, dd MMM yyy") === format(new Date(), "EEE, dd MMM yyy"));
    }
  }
}
