class ToDoList {
  constructor() {
    this.todos = [];
    this.idCounter = 1;
  }

  addTodo(title, description, notes, date, priority, isComplete) {
    const todo = {
      id: this.idCounter++,
      title,
      description,
      notes,
      date,
      priority,
      isComplete,
    };

    this.todos.push(todo);
    return todo;
  }

  getTodos() {
    return this.todos;
  }

  completeTodo(id) {
    const todo = this.todos.find((t) => t.id === id);
    if (todo) todo.isComplete = true;

    return todo || null;
  }

  removeTodo(id) {
    const index = this.todos.findIndex((t) => t.id === id);
    if (index !== -1) {
      return this.todos.splice(index, 1)[0];
    }

    return null;
  }
}
