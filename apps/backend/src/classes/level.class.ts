export class Level {
  public current: number = 0;
  public progress: number = 0;

  constructor() {}

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

  getObject(): {
    current: number;
    progress: number;
  } {
    return {
      current: this.current,
      progress: this.progress,
    };
  }
}
