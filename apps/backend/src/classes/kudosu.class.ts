export class Kudosu {
  private available: number = 0;
  private total: number = 0;

  constructor() {}

  getAvailable(): number {
    return this.available;
  }

  getTotal(): number {
    return this.total;
  }

  setAvailable(available: number): void {
    this.available = available;
  }

  setTotal(total: number): void {
    this.total = total;
  }

  getObject(): {
    available: number;
    total: number;
  } {
    return {
      available: this.available,
      total: this.total,
    };
  }
}
