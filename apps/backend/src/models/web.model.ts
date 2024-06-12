import { web } from "@prisma/client";

import DbService from "../services/db.service.js";

export class WebSetting {
  private setting: string;
  private value: string | null;

  constructor(setting: string, value: string | null = null) {
    this.setting = setting;
    this.value = value;
  }

  public getSetting(): string {
    return this.setting || "";
  }

  public getValue(): string {
    return this.value || "";
  }

  public fetchSetting(setting: string = this.setting): Promise<WebSetting> {
    return new Promise((resolve, reject) => {
      const dbService = DbService.getInstance();

      dbService
        .getClient()
        .web.findFirstOrThrow({
          where: {
            setting: setting,
          },
        })
        .then((result) => {
          this.setting = result.setting;
          this.value = result.value;
          resolve(this);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  public updateSetting(
    setting: string = this.setting,
    value: string
  ): Promise<WebSetting> {
    return new Promise((resolve, reject) => {
      const dbService = DbService.getInstance();

      dbService
        .getClient()
        .web.update({
          where: {
            setting: setting,
          },
          data: {
            value: value,
          },
        })
        .then((result) => {
          this.setting = result.setting;
          this.value = result.value;
          resolve(this);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
