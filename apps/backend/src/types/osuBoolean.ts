import { osuBase } from "./osuBase.js";

export class osuBoolean extends osuBase {
  value: boolean;

  constructor(value: boolean) {
    super();

    this.value = value;
  }

  getValue(): boolean {
    return this.value;
  }

  toString(): string {
    return this.value.toString();
  }
}
