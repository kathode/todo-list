export class StorageService {
  constructor(key) {
    this.key = key;
  }

  save(data) {
    localStorage.setItem(this.key, JSON.stringify(data));
  }

  load() {
    return JSON.parse(localStorage.getItem(this.key)) || [];
  }
}
