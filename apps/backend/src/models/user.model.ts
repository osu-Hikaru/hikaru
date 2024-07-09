import { Country } from "../classes/country.class.js";
import { Cover } from "../classes/cover.class.js";
import { Group } from "../classes/group.class.js";
import { Kudosu } from "../classes/kudosu.class.js";
import { RankHistory } from "../classes/rankHistory.class.js";
import { RankHighest } from "../classes/rank_highest.class.js";
import { Statistics } from "../classes/statistics.class.js";

import { Prisma } from "@prisma/client";
import { DatabaseModel } from "./model.js";
import { StatisticsRulesets } from "../classes/statisticsRuleset.class.js";

type UserWithAccount = Prisma.usersGetPayload<{
  include: { accounts: true };
}>;

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
  private groups: Array<Group> = [];
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

  constructor() {
    super();
  }

  fetchUserById(id: number): Promise<User> {
    return new Promise((resolve, reject) => {
      this._databaseService
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
          resolve(Object.assign({}, this));
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  fetchUserByUsername(username: string): Promise<User> {
    return new Promise((resolve, reject) => {
      this._databaseService
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
          resolve(Object.assign({}, this));
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  getObject(): string {
    return this.package(this);
  }

  getAccountHistory(): Array<any> {
    return this.account_history;
  }

  getActiveTournamentBanner(): any | null {
    return this.active_tournament_banner;
  }

  getActiveTournamentBanners(): Array<any> {
    return this.active_tournament_banners;
  }

  getAvatarUrl(): string {
    return this.avatar_url;
  }

  getBadges(): Array<any> {
    return this.badges;
  }

  getBeatmapPlaycountsCount(): number {
    return this.beatmap_playcounts_count;
  }

  getCommentsCount(): number {
    return this.comments_count;
  }

  getCountry(): Country {
    return this.country;
  }

  getCountryCode(): string {
    return this.countryCode;
  }

  getCover(): Cover {
    return this.cover;
  }

  getCoverUrl(): string {
    return this.cover_url;
  }

  getDefaultGroup(): string {
    return this.default_group;
  }

  getDiscord(): string {
    return this.discord;
  }

  getFavoriteBeatmapsetCount(): number {
    return this.favorite_beatmapset_count;
  }

  getFollowerCount(): number {
    return this.follower_count;
  }

  getGraveyardBeatmapsetCount(): number {
    return this.graveyard_beatmapset_count;
  }

  getGroups(): Array<Group> {
    return this.groups;
  }

  getGuestBeatmapsetCount(): number {
    return this.guest_beatmapset_count;
  }

  getHasSupported(): boolean {
    return this.has_supported;
  }

  getId(): number {
    return this.id;
  }

  getInterests(): string {
    return this.interests;
  }

  getIsActive(): boolean {
    return this.is_active;
  }

  getIsBot(): boolean {
    return this.is_bot;
  }

  getIsDeleted(): boolean {
    return this.is_deleted;
  }

  getIsOnline(): boolean {
    return this.is_online;
  }

  getIsSupporter(): boolean {
    return this.is_supporter;
  }

  getJoinDate(): Date {
    return this.join_date;
  }

  getKudosu(): Kudosu {
    return this.kudosu;
  }

  getLastVisit(): string {
    return this.last_visit;
  }

  getLocation(): string {
    return this.location;
  }

  getLovedBeatmapsetCount(): number {
    return this.loved_beatmapset_count;
  }

  getMappingFollowerCount(): number {
    return this.mapping_follower_count;
  }

  getMaxBlocks(): number {
    return this.max_blocks;
  }

  getMaxFriends(): number {
    return this.max_friends;
  }

  getMonthlyPlaycounts(): Array<any> {
    return this.monthly_playcounts;
  }

  getNominatedBeatmapsetCount(): number {
    return this.nominated_beatmapset_count;
  }

  getOccupation(): string | null {
    return this.occupation;
  }

  getPage(): Object {
    return this.page;
  }

  getPendingBeatmapsetCount(): number {
    return this.pending_beatmapset_count;
  }

  getPlaymode(): string {
    return this.playmode;
  }

  getPlaystyle(): Array<string> {
    return this.playstyle;
  }

  getPmFriendsOnly(): boolean {
    return this.pm_friends_only;
  }

  getPostCount(): number {
    return this.post_count;
  }

  getPreviousUsernames(): Array<string> {
    return this.previous_usernames;
  }

  getProfileColour(): null {
    return this.profile_colour;
  }

  getProfileOrder(): Array<string> {
    return this.profile_order;
  }

  getRankHistory(): RankHistory {
    return this.rankHistory;
  }

  getRankHighest(): RankHighest {
    return this.rank_highest;
  }

  getRank_History(): RankHistory {
    return this.rank_history;
  }

  getRankedAndApprovedBeatmapsetCount(): number {
    return this.ranked_and_approved_beatmapset_count;
  }

  getRankedBeatmapsetCount(): number {
    return this.ranked_beatmapset_count;
  }

  getReplaysWatchedCounts(): Array<any> {
    return this.replays_watched_counts;
  }

  getScoresBestCount(): number {
    return this.scores_best_count;
  }

  getScoresFirstCount(): number {
    return this.scores_first_count;
  }

  getScoresPinnedCount(): number {
    return this.scores_pinned_count;
  }

  getScoresRecentCount(): number {
    return this.scores_recent_count;
  }

  getSessionVerified(): boolean {
    return this.session_verified;
  }

  getStatistics(): Statistics {
    return this.statistics;
  }

  getStatisticsRulesets(): StatisticsRulesets {
    return this.statistics_rulesets;
  }

  getSupportLevel(): number {
    return this.support_level;
  }

  getTitle(): string {
    return this.title;
  }

  getTitleUrl(): string {
    return this.title_url;
  }

  getTwitter(): string {
    return this.twitter;
  }

  getUnrankedBeatmapsetCount(): number {
    return this.unranked_beatmapset_count;
  }

  getUserAchievements(): Array<any> {
    return this.user_achievements;
  }

  getUsername(): string {
    return this.username;
  }

  getWebsite(): string {
    return this.website;
  }

  setId(id: number): void {
    this.id = Number(id);
  }

  setUsername(username: string): void {
    this.username = username;
  }
}
