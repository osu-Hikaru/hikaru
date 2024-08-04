import { pino, Logger } from "pino";

export class LoggerService {
  private static instance: LoggerService;
  private logger: Logger | undefined;

  private constructor() {
    if (!LoggerService.instance) {
      LoggerService.instance = this;
      this.logger = pino();
    }

    return LoggerService.instance;
  }

  public static getInstance(): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService();
    }
    return LoggerService.instance;
  }

  getLogger(): Logger {
    if (!this.logger) throw new Error("Logger not initialized");

    return this.logger;
  }
}
