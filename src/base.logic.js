export class BaseClass {
  constructor(storageService) {
    this.storageService = storageService;
    this.array = this.storageService.load();
    this.idCounter = this.array.length ? Math.max(...this.array.map((t) => t.id)) + 1 : 1;
  }

  getIdCounter() {
    return this.idCounter;
  }

  getArray() {
    return this.array;
  }

  getItem(id) {
    return this.array.find((item) => item.id === id);
  }

  addItem(data) {
    const item = {
      id: this.idCounter++,
      ...data,
    };

    this.array.push(item);
    this.storageService.save(this.array);
    return item;
  }

  removeItem(id) {
    const index = this.array.findIndex((t) => t.id === id);
    if (index !== -1) {
      const removedItem = this.array.splice(index, 1)[0];
      this.storageService.save(this.array);

      return removedItem;
    }

    return null;
  }

  editItem(data) {
    const index = this.array.findIndex((t) => t.id === data.id);

    if (index !== -1) {
      const editedItem = this.array.splice(index, 1, data)[0];
      this.storageService.save(this.array);

      return editedItem;
    }
  }
}
