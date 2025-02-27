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

  getProjectCount(id) {
    return this.array.reduce((total, arr) => (arr.project === id ? total + 1 : total), 0);
  }

  removeItemsByProject(id) {
    const removedItems = [];
    this.array = this.array.filter((arr) => {
      if (arr.project !== id) {
        return true;
      } else {
        removedItems.push(arr);
        return false;
      }
    });

    this.storageService.save(this.array);

    return removedItems;
  }
}
