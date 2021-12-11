// Licensed under GPL v3 - Check Repository Root for full License notice.
// osu!Hikaru, a fully independent osu!Lazer Private Server backend.
// Copyright (C) 2021 Hikaru Team <copyright@hikaru.pw>

export default async (pool, req, res) => {
  const conn = await pool.getConnection();
  const url = req.originalUrl.split("/");
  let query2 = "";

  if (req.query.key === "id") {
    query2 = `id`;
  } else if (req.query.key === "username") {
    query2 = `username`;
  } else {
    res.status(400);
    res.send();
    conn.close();
    return;
  }

  conn
    .query(`SELECT * FROM users WHERE ${query2}=?`, [url[4]])
    .then((dbRes1) => {
      res.status(200);
      res.json({
        avatar_url: String(dbRes1[0].avatar_url),
        country_code: String(dbRes1[0].country_code),
        default_group: "default",
        id: Number(dbRes1[0].id),
        is_active: Boolean(dbRes1[0].is_active.readInt8()),
        is_bot: Boolean(dbRes1[0].is_bot.readInt8()),
        is_deleted: Boolean(dbRes1[0].is_deleted.readInt8()),
        is_online: Boolean(dbRes1[0].is_online.readInt8()),
        is_supporter: Boolean(dbRes1[0].is_supporter.readInt8()),
        last_visit: String(new Date(dbRes1[0].last_visit).toISOString()),
        pm_friends_only: false,
        profile_colour: null,
        username: String(dbRes1[0].username),
        cover_url: "https://a.hikaru.pw/1/default_cv.jpg",
        discord: null,
        has_supported: Boolean(dbRes1[0].has_supported.readInt8()),
        interests: null,
        join_date: String(new Date(dbRes1[0].join_date).toISOString()),
        kudosu: {
          total: 0,
          available: 0,
        },
        location: null,
        max_blocks: 50,
        max_friends: 250,
        occupation: null,
        playmode: String(url[5].split("?")[0]),
        playstyle: null,
        post_count: 0,
        profile_order: [
          "me",
          "recent_activity",
          "top_ranks",
          "medals",
          "historical",
          "beatmaps",
          "kudosu",
        ],
        title: null,
        title_url: null,
        twitter: null,
        website: null,
        country: {
          code: String(dbRes1[0].country_code),
          name: String(dbRes1[0].country_name),
        },
        cover: {
          custom_url: null,
          url: "https://a.hikaru.pw/1/default_cv.jpg",
          id: "4",
        },
        account_history: [],
        active_tournament_banner: null,
        badges: [],
        beatmap_playcounts_count: 0,
        comments_count: 0,
        favourite_beatmapset_count: 0,
        follower_count: 1,
        graveyard_beatmapset_count: 0,
        groups: [],
        loved_beatmapset_count: 0,
        mapping_follower_count: 0,
        monthly_playcounts: [],
        page: {
          html: "",
          raw: "",
        },
        pending_beatmapset_count: 0,
        previous_usernames: [],
        ranked_beatmapset_count: 0,
        replays_watched_counts: [],
        scores_best_count: 0,
        scores_first_count: 0,
        scores_recent_count: 0,
        statistics: {
          level: {
            current: 1,
            progress: 0,
          },
          global_rank: Number(dbRes1[0].global_rank),
          pp: Number(dbRes1[0].pp),
          ranked_score: 0,
          hit_accuracy: 0,
          play_count: Number(dbRes1[0].playcount),
          play_time: null,
          total_score: Number(dbRes1[0].total_score),
          total_hits: 0,
          maximum_combo: 0,
          replays_watched_by_others: 0,
          is_ranked: false,
          grade_counts: {
            ss: 0,
            ssh: 0,
            s: 0,
            sh: 0,
            a: 0,
          },
          rank: {
            country: null,
          },
        },
        support_level: 0,
        user_achievements: [],
        rankHistory: null,
        rank_history: null,
        ranked_and_approved_beatmapset_count: 0,
        unranked_beatmapset_count: 0,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500);
      res.send();
      conn.close();
      return;
    });
  conn.close();
  return;
};
