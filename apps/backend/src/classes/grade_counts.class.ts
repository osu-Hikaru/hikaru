export class GradeCounts {
  public a: number = 0;
  public s: number = 0;
  public sh: number = 0;
  public ss: number = 0;
  public ssh: number = 0;

  constructor() {}

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

  getObject(): {
    a: number;
    s: number;
    sh: number;
    ss: number;
    ssh: number;
  } {
    return {
      a: this.a,
      s: this.s,
      sh: this.sh,
      ss: this.ss,
      ssh: this.ssh,
    };
  }
}
