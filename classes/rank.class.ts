import { DatabaseModel } from "../models/model.js";

export class Rank extends DatabaseModel {
  public country: number = 0;

  constructor() {
    super();
  }

  getCountry(): number {
    return this.country;
  }

  setCountry(country: number): void {
    this.country = country;
  }
}
