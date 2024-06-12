import { PrismaClient } from "@prisma/client";

export default class DatabaseService {
  private static prismaClient: PrismaClient;
  private static instance: DatabaseService;

  private constructor() {
    if (!DatabaseService.instance) {
      DatabaseService.instance = this;
      DatabaseService.prismaClient = new PrismaClient();
    }
    return DatabaseService.instance;
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public getClient(): PrismaClient {
    return DatabaseService.prismaClient;
  }
}
