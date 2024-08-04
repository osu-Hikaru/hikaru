import { DatabaseModel } from "../models/model.js";

export class Cover extends DatabaseModel {
  public custom_url: string = "";
  public id: null | number = null;
  public url: string = "";

  constructor() {
    super();
  }

  getCustomUrl(): string {
    return this.custom_url;
  }

  setCustomUrl(url: string): void {
    this.custom_url = url;
  }

  getId(): null | number {
    return this.id;
  }

  setId(id: null | number): void {
    this.id = id;
  }

  getUrl(): string {
    return this.url;
  }

  setUrl(url: string): void {
    this.url = url;
  }
}
