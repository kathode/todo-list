import { BaseClass } from "./base.logic";

export class Project extends BaseClass {
  constructor(storageService) {
    super(storageService);
    this.projects = this.storageService.load();
  }
}
