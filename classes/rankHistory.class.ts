import { DatabaseModel } from "../models/model.js";

export class RankHistory extends DatabaseModel {
  public data: Array<number> = [];
  public mode: string = "";

  constructor() {
    super()
  }

  getData(): Array<any> {
    return this.data;
  }

  getMode(): string {
    return this.mode;
  }

  setData(data: Array<number>): void {
    this.data = data;
  }

  setMode(mode: string): void {
    this.mode = mode;
  }
}
