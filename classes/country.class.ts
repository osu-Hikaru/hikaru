import { DatabaseModel } from "../models/model.js";

export class Country extends DatabaseModel {
  public countryName: string = "";
  public countryCode: string = "";

  constructor() {
    super();
  }

  getCountryName(): string {
    return this.countryName;
  }

  getCountryCode(): string {
    return this.countryCode;
  }

  setCountryName(countryName: string): void {
    this.countryName = countryName;
  }

  setCountryCode(countryCode: string): void {
    this.countryCode = countryCode;
  }
}
