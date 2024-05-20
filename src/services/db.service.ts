import { PrismaClient } from "@prisma/client";

export default class DbService {
  private static prismaClient: PrismaClient;
  private static instance: DbService;

  private constructor() {
    if (!DbService.instance) {
      DbService.instance = this;
      DbService.prismaClient = new PrismaClient();
    }
    return DbService.instance;
  }

  public static getInstance(): DbService {
    if (!DbService.instance) {
      DbService.instance = new DbService();
    }
    return DbService.instance;
  }

  public getClient(): PrismaClient {
    return DbService.prismaClient;
  }
}
