// Licensed under GPL v3 - Check Repository Root for full License notice.
// osu!Hikaru, a fully independent osu!Lazer Private Server backend.
// Copyright (C) 2021 Hikaru Team <copyright@hikaru.pw>

import * as modules from "../index.mjs";

export default async (pool, req, res) => {
  const conn = await pool.getConnection();
  const url = req.originalUrl.split("/");
  let i = 0;
  let response = {
    scores: [],
  };

  let scores = await conn.query(
    `SELECT * FROM scores WHERE (score_id, user_id, beatmap_id) IN (SELECT min(score_id), user_id, beatmap_id FROM scores WHERE (user_id, beatmap_id, total_score) IN (select user_id, beatmap_id, max(total_score) AS total_score FROM scores WHERE beatmap_id = ? AND passed = 1  GROUP BY user_id, beatmap_id) GROUP BY user_id, beatmap_id) ORDER BY total_score DESC, created_at ASC LIMIT 50`,
    [url[3]]
  );

  scores.forEach(async (score) => {
    let user = await conn.query(`SELECT * FROM users WHERE user_id = ? LIMIT 1`, [
      score.user_id,
    ]);

    response.scores.push({
      accuracy: Number(score.accuracy),
      beatmap_id: Number(score.beatmap_id),
      build_id: Number(1),
      ended_at: await modules.sqlToOsuDate(score.created_at),
      id: Number(score.score_id),
      max_combo: Number(score.max_combo),
      mods: [],
      passed: Boolean(score.passed),
      rank: String(score.rank),
      ruleset_id: Number(score.ruleset_id),
      started_at: await modules.sqlToOsuDate(score.created_at),
      statistics: {
        count_katu: Number(score.count_good),
        count_300: Number(score.count_great),
        count_50: Number(score.count_meh),
        count_miss: Number(score.count_miss),
        count_100: Number(score.count_ok),
        Perfect: Number(score.perfect),
      },
      user: {
        avatar_url: String(user[0].avatar_url),
        country_code: String(user[0].country_code),
        default_group: "default",
        id: Number(user[0].user_id),
        is_active: Boolean(user[0].is_active),
        is_bot: Boolean(user[0].is_bot),
        is_deleted: Boolean(user[0].is_deleted),
        is_online: Boolean(user[0].is_online),
        is_supporter: Boolean(user[0].is_supporter),
        last_visit: await modules.sqlToOsuDate(user[0].last_visit),
        pm_friends_only: Boolean(user[0].is_supporter),
        profile_colour: null,
        username: String(user[0].username),
        country: {
          code: String(user[0].country_code),
          name: String(user[0].country_name),
        },
        cover: {
          custom_url: null,
          url: "https://a.hikaru.pw/1/default_cv.jpg",
          id: null,
        },
      },
      score: Number(score.total_score),
      user_id: Number(score.user_id),
    });

    i++;
  });

  function sendResult() {
    if (i === scores.length) {
      res.status(200);
      res.json(response);
      conn.end();
    } else {
      setTimeout(sendResult, 200);
    }
  }
  sendResult();
};
