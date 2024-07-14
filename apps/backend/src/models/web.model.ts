import { DatabaseModel } from "./model.js";

export type WebSettings = Map<string, string>;

export class WebSetting extends DatabaseModel {
  private static instance: WebSetting;
  private settingCache: WebSettings = new Map<string, string>();

  private constructor() {
    super();
    if (!WebSetting.instance) {
      WebSetting.instance = this;

      this.fetchSettings()
    }

    return WebSetting.instance;
  }

  public static getInstance(): WebSetting {
    if (!WebSetting.instance) {
      WebSetting.instance = new WebSetting();
    }
    return WebSetting.instance;
  }

  public async getSetting(
    setting: string,
    forceRefresh: boolean = false
  ): Promise<string> {
    let retrieved;

    if (this.settingCache.has(setting) && !forceRefresh) {
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
      const dbClient = this._databaseService.getClient();

      dbClient.web
        .findFirstOrThrow({
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

  public async getSettings(
    forceRefresh: boolean = false
  ): Promise<WebSettings> {
    if (!forceRefresh) {
      return this.getCache();
    }

    return this.fetchSettings();
  }

  private fetchSettings(): Promise<WebSettings> {
    return new Promise((resolve, reject) => {
      const dbClient = this._databaseService.getClient();

      dbClient.web
        .findMany()
        .then((results) => {
          for (const result of results) {
            this.settingCache.set(result.setting, result.value);
          }

          resolve(this.getCache());
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  private getCache(): Map<string, string> {
    return this.settingCache;
  }

  public updateSetting(setting: string, value: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const dbClient = this._databaseService.getClient();
        const res = await dbClient.web.update({
          where: {
            setting: setting,
          },
          data: {
            value: value,
          },
        });

        if (!res) {
          throw new Error("Failed to update setting.");
        }

        this.settingCache.set(res.setting, res.value);
        resolve(res.value);
      } catch (err) {
        reject(this.identifyErrorType(err));
      }
    });
  }
}
