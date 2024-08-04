import {ClassModel} from "./base.class.js";

export class Rank extends ClassModel {
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
