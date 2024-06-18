import { DatabaseModel } from "./model.js";

export class WebSetting extends DatabaseModel {
  private setting: string;
  private value: string | null;

  constructor(setting: string, value: string | null = null) {
    super();

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
      this.databaseService
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
      this.databaseService
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
