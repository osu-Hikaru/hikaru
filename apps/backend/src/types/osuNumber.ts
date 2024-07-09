import { osuBase } from "./osuBase.js";

export class osuNumber extends osuBase {
  value: number;

  constructor(value: number | null) {
    super();
    this.value = value === null ? 0 : value;
  }

  setValue(value: number | null): void {
    this.value = value === null ? 0 : value;
  }

  getValue(): number {
    return this.value;
  }

  toString(): string {
    return this.value.toString();
  }
}
