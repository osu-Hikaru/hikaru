import DbService from "../services/db.service.js";

import { Country } from "../classes/country.class.js";
import { Cover } from "../classes/cover.class.js";
import { Kudosu } from "../classes/kudosu.class.js";
import { RankHistory } from "../classes/rankHistory.class.js";
import { RankHighest } from "../classes/rank_highest.class.js";
import { Statistics } from "../classes/statistics.class.js";
import { StatisticsRulesets } from "../classes/statistics_rulesets.class.js";

import { Prisma } from "@prisma/client";

type UserWithAccount = Prisma.usersGetPayload<{
  include: { accounts: true };
}>;

export class User {
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
  private groups: Array<string> = [];
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

  constructor() {}

  getId(): number {
    return this.id;
  }

  setId(id: number): void {
    this.id = Number(id);
  }

  getUsername(): string {
    return this.username;
  }

  setUsername(username: string): void {
    this.username = username;
  }

  fetchUserById(id: number): Promise<User> {
    return new Promise((resolve, reject) => {
      const dbService = DbService.getInstance();

      dbService
        .getClient()
        .users.findFirstOrThrow({
          where: {
            accounts: {
              id: Number(id),
            },
          },
          include: { accounts: true },
        })
        .then((user: UserWithAccount) => {
          this.username = user.accounts.username;
          this.countryCode = user.country_code ?? "";
          this.join_date = user.join_date ?? new Date();
          this.rank_highest.setUpdatedAt(user.join_date ?? new Date());
          resolve(this);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  fetchUserByUsername(username: string): Promise<User> {
    return new Promise((resolve, reject) => {
      const dbService = DbService.getInstance();

      dbService
        .getClient()
        .users.findFirstOrThrow({
          where: {
            accounts: {
              username: username,
            },
          },
          include: { accounts: true },
        })
        .then((user: UserWithAccount) => {
          this.username = user.accounts.username;
          this.countryCode = user.country_code ?? "";
          this.join_date = user.join_date ?? new Date();
          this.rank_highest.setUpdatedAt(user.join_date ?? new Date());
          resolve(this);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  getObject(): {
    account_history: Array<any>;
    active_tournament_banner: any | null;
    active_tournament_banners: Array<any>;
    avatar_url: string;
    badges: Array<any>;
    beatmap_playcounts_count: number;
    comments_count: number;
    country: Object;
    countryCode: string;
    cover: Object;
    cover_url: string;
    default_group: string;
    discord: string;
    favorite_beatmapset_count: number;
    follower_count: number;
    graveyard_beatmapset_count: number;
    groups: Array<string>;
    guest_beatmapset_count: number;
    has_supported: boolean;
    id: number;
    interests: string;
    is_active: boolean;
    is_bot: boolean;
    is_deleted: boolean;
    is_online: boolean;
    is_supporter: boolean;
    join_date: string;
    kudosu: Object;
    last_visit: string;
    location: string;
    loved_beatmapset_count: number;
    mapping_follower_count: number;
    max_blocks: number;
    max_friends: number;
    monthly_playcounts: Array<any>;
    nominated_beatmapset_count: number;
    occupation: string | null;
    page: Object;
    pending_beatmapset_count: number;
    playmode: string;
    playstyle: Array<string>;
    pm_friends_only: boolean;
    post_count: number;
    previous_usernames: Array<string>;
    profile_colour: null;
    profile_order: Array<string>;
    rankHistory: Object;
    rank_highest: Object;
    rank_history: Object;
    ranked_and_approved_beatmapset_count: number;
    ranked_beatmapset_count: number;
    replays_watched_counts: Array<any>;
    scores_best_count: number;
    scores_first_count: number;
    scores_pinned_count: number;
    scores_recent_count: number;
    session_verified: boolean;
    statistics: Object;
    statistics_rulesets: Object;
    support_level: number;
    title: string;
    title_url: string;
    twitter: string;
    unranked_beatmapset_count: number;
    user_achievements: Array<any>;
    username: string;
    website: string;
  } {
    return {
      account_history: this.account_history,
      active_tournament_banner: this.active_tournament_banner,
      active_tournament_banners: this.active_tournament_banners,
      avatar_url: this.avatar_url,
      badges: this.badges,
      beatmap_playcounts_count: this.beatmap_playcounts_count,
      comments_count: this.comments_count,
      country: this.country.getObject(),
      countryCode: this.countryCode,
      cover: this.cover.getObject(),
      cover_url: this.cover_url,
      default_group: this.default_group,
      discord: this.discord,
      favorite_beatmapset_count: this.favorite_beatmapset_count,
      follower_count: this.follower_count,
      graveyard_beatmapset_count: this.graveyard_beatmapset_count,
      groups: this.groups,
      guest_beatmapset_count: this.guest_beatmapset_count,
      has_supported: this.has_supported,
      id: this.id,
      interests: this.interests,
      is_active: this.is_active,
      is_bot: this.is_bot,
      is_deleted: this.is_deleted,
      is_online: this.is_online,
      is_supporter: this.is_supporter,
      join_date: this.join_date.toISOString(),
      kudosu: this.kudosu.getObject(),
      last_visit: this.last_visit,
      location: this.location,
      loved_beatmapset_count: this.loved_beatmapset_count,
      mapping_follower_count: this.mapping_follower_count,
      max_blocks: this.max_blocks,
      max_friends: this.max_friends,
      monthly_playcounts: this.monthly_playcounts,
      nominated_beatmapset_count: this.nominated_beatmapset_count,
      occupation: this.occupation,
      page: this.page,
      pending_beatmapset_count: this.pending_beatmapset_count,
      playmode: this.playmode,
      playstyle: this.playstyle,
      pm_friends_only: this.pm_friends_only,
      post_count: this.post_count,
      previous_usernames: this.previous_usernames,
      profile_colour: this.profile_colour,
      profile_order: this.profile_order,
      rankHistory: this.rankHistory.getObject(),
      rank_highest: this.rank_highest.getObject(),
      rank_history: this.rank_history.getObject(),
      ranked_and_approved_beatmapset_count:
        this.ranked_and_approved_beatmapset_count,
      ranked_beatmapset_count: this.ranked_beatmapset_count,
      replays_watched_counts: this.replays_watched_counts,
      scores_best_count: this.scores_best_count,
      scores_first_count: this.scores_first_count,
      scores_pinned_count: this.scores_pinned_count,
      scores_recent_count: this.scores_recent_count,
      session_verified: this.session_verified,
      statistics: this.statistics.getObject(),
      statistics_rulesets: this.statistics_rulesets.getObject(),
      support_level: this.support_level,
      title: this.title,
      title_url: this.title_url,
      twitter: this.twitter,
      unranked_beatmapset_count: this.unranked_beatmapset_count,
      user_achievements: this.user_achievements,
      username: this.username,
      website: this.website,
    };
  }
}
