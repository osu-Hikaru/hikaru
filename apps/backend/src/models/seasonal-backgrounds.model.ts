import { DatabaseModel } from "./model.js";
import { User } from "./user.model.js";

type SeasonalBackground = {
  url: string;
  user: {
    avatar_url: string;
    country_code: string;
    default_group: string;
    id: number;
    is_active: boolean;
    is_bot: boolean;
    is_deleted: boolean;
    is_online: boolean;
    is_supporter: boolean;
    last_visit: string;
    pm_friends_only: boolean;
    profile_colour: null;
    username: string;
  };
};

type SeasonalBackgrounds = {
  backgrounds: SeasonalBackground[];
  ends_at: Date;
};

export class SeasonalBackgroundsModel extends DatabaseModel {
  private seasonalBackgrounds: SeasonalBackground[] = [];
  private minExpiry: Date;
  private static instance: SeasonalBackgroundsModel;

  private constructor() {
    super();
    if (!SeasonalBackgroundsModel.instance) {
      SeasonalBackgroundsModel.instance = this;
    }

    this.minExpiry = new Date();

    return SeasonalBackgroundsModel.instance;
  }

  public static getInstance(): SeasonalBackgroundsModel {
    if (!SeasonalBackgroundsModel.instance) {
      SeasonalBackgroundsModel.instance = new SeasonalBackgroundsModel();
    }
    return SeasonalBackgroundsModel.instance;
  }

  public async getBackgrounds(): Promise<SeasonalBackgrounds> {
    if (this.seasonalBackgrounds.length === 0) {
      await this.cacheBackgrounds();
    }

    return {
      backgrounds: this.seasonalBackgrounds,
      ends_at: this.minExpiry,
    };
  }

  async cacheBackgrounds(
    forceRecache: boolean = false
  ): Promise<SeasonalBackgrounds> {
    return new Promise(async (resolve, reject) => {
      if (
        (this.seasonalBackgrounds.length > 0 || this.minExpiry < new Date()) &&
        !forceRecache
      ) {
        resolve(this.getBackgrounds());
        return;
      }

      const prismaClient = this.databaseService.getClient();

      await prismaClient.seasonal_backgrounds
        .findMany({
          select: {
            internal_id: true,
            user: true,
            url: true,
            expiry: true,
          },
          where: {
            expiry: {
              gte: new Date(),
            },
          },
        })
        .then(async (backgrounds) => {
          this.minExpiry = new Date(
            Math.min(...backgrounds.map((bg) => bg.expiry.getTime()))
          );

          let userResolutionPromise = backgrounds.map(async (background) => {
            return new User().fetchUserById(background.user);
          });

          let bgUser = await Promise.all(userResolutionPromise);

          // TODO: Fix this
          this.seasonalBackgrounds = backgrounds.map((background, index) => {
            return {
              url: background.url,
              user: {
                avatar_url: bgUser[index].getAvatarUrl(),
                country_code: bgUser[index].getCountryCode(),
                default_group: bgUser[index].getDefaultGroup(),
                id: bgUser[index].getId(),
                is_active: bgUser[index].getIsActive(),
                is_bot: bgUser[index].getIsBot(),
                is_deleted: bgUser[index].getIsDeleted(),
                is_online: bgUser[index].getIsOnline(),
                is_supporter: bgUser[index].getIsSupporter(),
                last_visit: bgUser[index].getLastVisit(),
                pm_friends_only: bgUser[index].getPmFriendsOnly(),
                profile_colour: bgUser[index].getProfileColour(),
                username: bgUser[index].getUsername(),
              },
            };
          });

          resolve(this.getBackgrounds());
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
