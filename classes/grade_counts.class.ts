import { DatabaseModel } from "../models/model.js";

export class GradeCounts extends DatabaseModel {
  public a: number = 0;
  public s: number = 0;
  public sh: number = 0;
  public ss: number = 0;
  public ssh: number = 0;

  constructor() {
    super();
  }

  getA(): number {
    return this.a;
  }

  getS(): number {
    return this.s;
  }

  getSh(): number {
    return this.sh;
  }

  getSs(): number {
    return this.ss;
  }

  getSsh(): number {
    return this.ssh;
  }

  setA(a: number): void {
    this.a = a;
  }

  setS(s: number): void {
    this.s = s;
  }

  setSh(sh: number): void {
    this.sh = sh;
  }

  setSs(ss: number): void {
    this.ss = ss;
  }

  setSsh(ssh: number): void {
    this.ssh = ssh;
  }
}
