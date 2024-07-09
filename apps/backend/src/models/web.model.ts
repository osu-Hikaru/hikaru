import { DatabaseModel } from "./model.js";

export class WebSetting extends DatabaseModel {
  private static instance: WebSetting;
  private settingCache: Map<string, string> = new Map<string, string>();

  private constructor() {
    super();
    if (!WebSetting.instance) {
      WebSetting.instance = this;
    }

    return WebSetting.instance;
  }

  public static getInstance(): WebSetting {
    if (!WebSetting.instance) {
      WebSetting.instance = new WebSetting();
    }
    return WebSetting.instance;
  }

  public getCache(): Map<string, string> {
    return this.settingCache;
  }

  public async getSetting(setting: string): Promise<string> {
    let retrieved;

    if (this.settingCache.has(setting)) {
      this.settingCache.get(setting);

      if (retrieved) {
        return retrieved;
      }
    }

    retrieved = await this.fetchSetting(setting);
    return retrieved;
  }

  private fetchSetting(setting: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this._databaseService
        .getClient()
        .web.findFirstOrThrow({
          where: {
            setting: setting,
          },
        })
        .then((result) => {
          this.settingCache.set(result.setting, result.value);
          resolve(result.value);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  public updateSetting(setting: string, value: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this._databaseService
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
          this.settingCache.set(result.setting, result.value);
          resolve(result.value);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
