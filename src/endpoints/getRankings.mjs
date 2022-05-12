// Licensed under GPL v3 - Check Repository Root for full License notice.
// osu!Hikaru, a fully independent osu!Lazer Private Server backend.
// Copyright (C) 2021 Hikaru Team <copyright@hikaru.pw>

import * as modules from "../index.mjs";

export default async (pool, req, res) => {
  const conn = await pool.getConnection();
  const url = req.originalUrl.split("/");
  let response = {
    cursor: {
      page: null,
    },
    ranking: [],
    total: 0,
  };
  let type = "performance";
  let mode = "osu";
  let cursor = 0;

  try {
    // Mode

    switch (url[3]) {
      case "osu":
        mode = "osu";
        break;
      default:
        mode = "";
        break;
    }

    // Type

    switch (url[4].split("?")[0]) {
      case "performance":
        type = "performance";
        break;
      default:
        type = "";
        break;
    }

    async function handler(type, mode) {
      if (type === "performance" && mode === "osu") {
        const rankings = await conn.query(
          `SELECT * FROM users ORDER BY pp DESC LIMIT 50 OFFSET 0`
        );

        const count = await conn.query(`SELECT count(*) FROM users`);

        response.total = Number(count[0]["count(*)"]);

        rankings.forEach(async (ranking) => {
          let i = 0;
          for (i; ranking !== rankings[i]; i++) {}

          await response.ranking.push({
            level: {
              current: 0,
              progress: 0,
            },
            global_rank: Number(i + 1),
            pp: Number(ranking.pp),
            ranked_score: 0,
            hit_accuracy: 100,
            play_count: 0,
            play_time: Number(ranking.play_time),
            total_score: Number(ranking.total_score),
            total_hits: Number(ranking.total_hits),
            maximum_combo: 0,
            replays_watched_by_others: 0,
            is_ranked: true,
            grade_counts: {
              ss: 0,
              ssh: 0,
              s: 0,
              sh: 0,
              a: 0,
            },
            user: {
              avatar_url: String(ranking.avatar_url),
              country_code: String(ranking.country_code),
              default_group: "default",
              id: Number(ranking.user_id),
              is_active: Boolean(ranking.is_active),
              is_bot: Boolean(ranking.is_bot),
              is_deleted: Boolean(ranking.is_deleted),
              is_online: Boolean(ranking.is_online),
              is_supporter: Boolean(ranking.is_supporter),
              last_visit: await modules.sqlToOsuDate(ranking.last_visit),
              pm_friends_only: Boolean(false),
              profile_colour: null,
              username: String(ranking.username),
              country: {
                code: String(ranking.country_code),
                name: String(ranking.country_name),
              },
              cover: {
                custom_url: null,
                url: "https://a.hikaru.pw/1/default_cv.jpg",
                id: "4",
              },
            },
          });

          cursor++;
        });

        async function checkDone() {
          if (cursor === rankings.length) {
            res.status(200);
            res.json(response);
            conn.end();
          } else {
            setTimeout(checkDone, 500);
          }
        }

        checkDone();
      } else {
        res.status(200);
        res.json(response);
        conn.end();
      }
    }

    handler(type, mode);
  } catch (err) {
    res.status(500);
    res.json({});
    conn.end();
    console.log(err);
  }
};
