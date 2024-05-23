export class Country {
  public countryName: string = "";
  public countryCode: string = "";

  constructor() {}

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

  getObject(): {
    countryName: string;
    countryCode: string;
  } {
    return {
      countryName: this.countryName,
      countryCode: this.countryCode,
    };
  }
}
