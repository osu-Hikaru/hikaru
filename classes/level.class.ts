import { DatabaseModel } from "../models/model.js";

export class Level extends DatabaseModel {
  public current: number = 0;
  public progress: number = 0;

  constructor() {
    super();
  }

  getCurrent(): number {
    return this.current;
  }

  getProgress(): number {
    return this.progress;
  }

  setCurrent(current: number): void {
    this.current = current;
  }

  setProgress(progress: number): void {
    this.progress = progress;
  }
}
