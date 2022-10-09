
// Licensed under GPL v3 - Check Repository Root for full License notice.
// osu!Hikaru, a fully independent osu!Lazer Private Server backend.
// Copyright (C) 2021 Hikaru Team <copyright@hikaru.pw>

export default async (pool, req, res) => {
    try {
      res.status(200);
      res.json({});
    } catch (err) {
      res.status(500);
      res.json({});
      console.log(err);
    }
  };
  

console.log({
  auto_start_duration: 0,
  category: "normal",
  channel_id: 0,
  current_playlist_item: {
    allowed_mods: [],
    beatmap_id: 3581298,
    expired: false,
    owner_id: 0,
    played_at: null,
    playlist_order: null,
    required_mods: [],
    ruleset_id: 0,
  },
  current_user_score: null,
  difficulty_range: null,
  duration: 30,
  ends_at: null,
  has_password: false,
  host: {
    avatar_url: "https://a.hikaru.pw/1/default_av.jpg",
    badges: [],
    beatmap_playcounts_count: 0,
    comments_count: 0,
    country: {
      code: "",
      name: "",
    },
    cover: {
      custom_url: null,
      id: 4,
      url: "https://a.hikaru.pw/1/default_cv.jpg",
    },
    cover_url: "https://a.hikaru.pw/1/default_cv.jpg",
    discord: null,
    favourite_beatmapset_count: 0,
    follower_count: 1,
    graveyard_beatmapset_count: 0,
    guest_beatmapset_count: 0,
    id: 2,
    interests: null,
    is_active: true,
    is_admin: false,
    is_bng: false,
    is_bot: false,
    is_gmt: false,
    is_online: true,
    is_qat: false,
    is_supporter: false,
    join_date: "2022-05-31T17:30:59+00:00",
    kudosu: {
      available: 0,
      total: 0,
    },
    last_visit: "2022-06-13T20:48:55+00:00",
    location: null,
    loved_beatmapset_count: 0,
    mapping_follower_count: 0,
    monthly_playcounts: [],
    occupation: null,
    pending_beatmapset_count: 0,
    playmode: "osu",
    pm_friends_only: false,
    post_count: 0,
    previous_usernames: [],
    profile_colour: null,
    profile_order: [
      "me",
      "recent_activity",
      "top_ranks",
      "medals",
      "historical",
      "beatmaps",
      "kudosu",
    ],
    ranked_beatmapset_count: 0,
    replays_watched_counts: [],
    scores_best_count: 0,
    scores_first_count: 0,
    scores_pinned_count: 0,
    scores_recent_count: 0,
    statistics: {
      RankHistory: null,
      User: null,
      country_rank: null,
      global_rank: 1,
      grade_counts: {
        a: 0,
        s: 0,
        sh: 0,
        ss: 0,
        ssh: 0,
      },
      hit_accuracy: 0.0,
      is_ranked: false,
      level: {
        current: 1,
        progress: 0,
      },
      maximum_combo: 0,
      play_count: 0,
      play_time: 0,
      pp: 0.0,
      ranked_score: 0,
      replays_watched_by_others: 0,
      total_hits: 0,
      total_score: 0,
    },
    statistics_rulesets: null,
    support_level: 0,
    title: null,
    twitter: null,
    user_achievements: [],
    username: "Emilia",
    website: null,
  },
  id: null,
  name: "Emilia's awesome playlist",
  participant_count: 0,
  password: null,
  playlist: [
    {
      allowed_mods: [],
      beatmap_id: 3581298,
      expired: false,
      owner_id: 0,
      played_at: null,
      playlist_order: null,
      required_mods: [],
      ruleset_id: 0,
    },
  ],
  playlist_item_stats: null,
  queue_mode: "host_only",
  recent_participants: [],
  type: "playlists",
});
