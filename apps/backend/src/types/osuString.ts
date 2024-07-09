import { osuBase } from "./osuBase.js";

export class osuString extends osuBase {
  value: string;

  constructor(value: string) {
    super();

    this.value = value;
  }

  getValue(): string {
    return this.value;
  }

  toString(): string {
    return this.value;
  }
}
