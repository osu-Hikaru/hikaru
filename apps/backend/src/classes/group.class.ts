import { DatabaseModel } from "../models/model.js";

export class Group extends DatabaseModel {
  colour: string = "";
  has_listing: boolean = true;
  has_playmodes: boolean = false;
  id: number = 0;
  identifier: string = "";
  is_probationary: boolean = false;
  name: string = "";
  playmodes: string[] | null = null;
  short_name: string = "";

  constructor() {
    super();
  }

  getColour(): string {
    return this.colour;
  }

  setColour(colour: string): void {
    this.colour = colour;
  }

  getHasListing(): boolean {
    return this.has_listing;
  }

  setHasListing(hasListing: boolean): void {
    this.has_listing = hasListing;
  }

  getHasPlaymodes(): boolean {
    return this.has_playmodes;
  }

  setHasPlaymodes(hasPlaymodes: boolean): void {
    this.has_playmodes = hasPlaymodes;
  }

  getId(): number {
    return this.id;
  }

  setId(id: number): void {
    this.id = id;
  }

  getIdentifier(): string {
    return this.identifier;
  }

  setIdentifier(identifier: string): void {
    this.identifier = identifier;
  }

  getIsProbationary(): boolean {
    return this.is_probationary;
  }

  setIsProbationary(isProbationary: boolean): void {
    this.is_probationary = isProbationary;
  }

  getName(): string {
    return this.name;
  }

  setName(name: string): void {
    this.name = name;
  }

  getPlaymodes(): string[] | null {
    return this.playmodes;
  }

  setPlaymodes(playmodes: string[] | null): void {
    this.playmodes = playmodes;
  }

  getShortName(): string {
    return this.short_name;
  }

  setShortName(shortName: string): void {
    this.short_name = shortName;
  }
}
