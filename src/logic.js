export class ToDoList {
  constructor(storageService) {
    this.storageService = storageService;
    this.todos = this.storageService.load();
    this.idCounter = this.todos.length ? Math.max(...this.todos.map((t) => t.id)) + 1 : 1;
  }

  getIdCounter() {
    return this.idCounter;
  }

  getTodos() {
    return this.todos;
  }

  addTodo(data) {
    const todo = {
      id: this.idCounter++,
      ...data,
    };

    this.todos.push(todo);
    this.storageService.save(this.todos);
    return todo;
  }

  completeTodo(id, isComplete) {
    const todo = this.todos.find((t) => t.id === id);
    if (todo) {
      todo.isComplete = isComplete;
      this.storageService.save(this.todos);
    }

    return todo || null;
  }

  removeTodo(id) {
    const index = this.todos.findIndex((t) => t.id === id);
    if (index !== -1) {
      const removedTodo = this.todos.splice(index, 1)[0];
      this.storageService.save(this.todos);

      return removedTodo;
    }

    return null;
  }

  editTodo(data) {
    const index = this.todos.findIndex((t) => t.id === data.id);

    if (index !== -1) {
      const editedTodo = this.todos.splice(index, 1, data)[0];
      this.storageService.save(this.todos);

      return editedTodo;
    }
  }
}
