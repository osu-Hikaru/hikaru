import {ClassModel} from "./base.class.js";

export class Country extends ClassModel {
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
