export class RankHistory {
  public data: Array<number> = [];
  public mode: string = "";

  constructor() {}

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

  getObject(): {
    data: Array<number>;
    mode: string;
  } {
    return {
      data: this.data,
      mode: this.mode,
    };
  }
}
