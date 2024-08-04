import { DatabaseModel } from "./model.js";
import { GroupsModel } from "./groups.model.js";

import { Account } from "./account.model.js";
import { Country } from "../classes/country.class.js";
import { Cover } from "../classes/cover.class.js";
import { Group } from "../classes/group.class.js";
import { Kudosu } from "../classes/kudosu.class.js";
import { RankHistory } from "../classes/rankHistory.class.js";
import { RankHighest } from "../classes/rank_highest.class.js";
import { Statistics } from "../classes/statistics.class.js";
import { StatisticsRulesets } from "../classes/statisticsRuleset.class.js";

export class User extends DatabaseModel {
  private account_history: Array<any> = [];
  private active_tournament_banner: any | null = null;
  private active_tournament_banners: Array<any> = [];
  private avatar_url: string = "https://a.hikaru.pw/default.png";
  private badges: Array<any> = [];
  private beatmap_playcounts_count: number = 0;
  private comments_count: number = 0;
  private country: Country = new Country();
  private countryCode: string = "";
  private cover: Cover = new Cover();
  private cover_url: string = "";
  private default_group: string = "default";
  private discord: string = "";
  private favorite_beatmapset_count: number = 0;
  private follower_count: number = 0;
  private graveyard_beatmapset_count: number = 0;
  private groups: Promise<Group[]> | Group[] = [];
  private guest_beatmapset_count: number = 0;
  private has_supported: boolean = false;
  private id: number = 1;
  private interests: string = "";
  private is_active: boolean = true;
  private is_bot: boolean = false;
  private is_deleted: boolean = false;
  private is_online: boolean = false;
  private is_supporter: boolean = false;
  private join_date: Date = new Date();
  private kudosu: Kudosu = new Kudosu();
  private last_visit: string = "";
  private location: string = "";
  private loved_beatmapset_count: number = 0;
  private mapping_follower_count: number = 0;
  private max_blocks: number = 0;
  private max_friends: number = 0;
  private monthly_playcounts: Array<any> = [];
  private nominated_beatmapset_count: number = 0;
  private occupation: string | null = null;
  private page: Object = {};
  private pending_beatmapset_count: number = 0;
  private playmode: string = "osu";
  private playstyle: Array<string> = [];
  private pm_friends_only: boolean = false;
  private post_count: number = 0;
  private previous_usernames: Array<string> = [];
  private profile_colour: null = null;
  private profile_order: Array<string> = [];
  private rankHistory: RankHistory = new RankHistory();
  private rank_highest: RankHighest = new RankHighest();
  private rank_history: RankHistory = this.rankHistory;
  private ranked_and_approved_beatmapset_count: number = 0;
  private ranked_beatmapset_count: number = 0;
  private replays_watched_counts: Array<any> = [];
  private scores_best_count: number = 0;
  private scores_first_count: number = 0;
  private scores_pinned_count: number = 0;
  private scores_recent_count: number = 0;
  private session_verified: boolean = true;
  private statistics: Statistics = new Statistics();
  private statistics_rulesets: StatisticsRulesets = new StatisticsRulesets();
  private support_level: number = 0;
  private title: string = "";
  private title_url: string = "";
  private twitter: string = "";
  private unranked_beatmapset_count: number = 0;
  private user_achievements: Array<any> = [];
  private username: string = "";
  private website: string = "";

  private _ready: boolean = false;

  constructor() {
    super();
  }

  public init(parameter: string | number): Promise<User> {
    return new Promise(async (resolve, reject) => {
      // Fetch account data
      const account = new Account();
      await account.getAccount(parameter);

      // Set account data
      this.id = account.getId();
      this.username = account.getUsername();

      // Fetch user data
      await this.fetchUserData(this.id);

      // Fetch groups
      this.groups = await this.groups;

      // Set signal user is prepared
      this._ready = true;
      resolve(this);
    });
  }

  public getObject(): string {
    return this.package(this);
  }

  public getGroups(): Group[] {
    let groups = this.groups;

    if (!this._ready || groups instanceof Promise) {
      throw new Error("User not ready");
    } else {
      return groups;
    }
  }

  private fetchUserData(id: number): Promise<User> {
    return new Promise(async (resolve, reject) => {
      const dbService = this._databaseService.getClient();
      const user = await dbService.users.findFirstOrThrow({
        where: {
          accounts: {
            id: Number(id),
          },
        },
      });

      Object.keys(user).forEach(async (key) => {
        switch (key) {
          case "groups":
            this.groups = this.fetchUserGroups(user["groups"]);
            break;
          default:
            if (this.isValidKey(key, this)) {
              (this as any)[key] = (user as any)[key];
            }
            break;
        }
      });

      resolve(this);
    });
  }

  private fetchUserGroups(groups: Array<number>): Promise<Array<Group>> {
    const g = GroupsModel.getInstance();

    return g.getGroups(groups);
  }

  private isValidKey(
    key: string | number | symbol,
    instance: any
  ): key is keyof typeof instance {
    return key in instance;
  }
}
