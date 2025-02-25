import { format } from "date-fns";
import { BaseClass } from "./base.logic";

export class Todo extends BaseClass {
  constructor(storageService) {
    super(storageService);
  }

  getTodoType(type) {
    switch (type) {
      case "ALL":
        return this.array;
      case "TODAY":
        return this.array.filter((todo) => format(new Date(todo.dueDate), "EEE, dd MMM yyy") === format(new Date(), "EEE, dd MMM yyy"));
    }
  }
}
