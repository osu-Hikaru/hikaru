export class RankHighest {
  public rank: number = 0;
  public updated_at: Date = new Date();

  constructor() {}

  getRank(): number {
    return this.rank;
  }

  getUpdatedAt(): Date {
    return this.updated_at;
  }

  setRank(rank: number): void {
    this.rank = rank;
  }

  setUpdatedAt(updated_at: Date): void {
    this.updated_at = updated_at;
  }

  getObject(): {
    rank: number;
    updated_at: string;
  } {
    return {
      rank: this.rank,
      updated_at: this.updated_at.toISOString(),
    };
  }
}
