export class Rank {
  public country: number = 0;

  constructor() {}

  getCountry(): number {
    return this.country;
  }

  setCountry(country: number): void {
    this.country = country;
  }

  getObject(): {
    country: number;
  } {
    return {
      country: this.country,
    };
  }
}
