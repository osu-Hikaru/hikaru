// Licensed under GPL v3 - Check Repository Root for full License notice.
// osu!Hikaru, a fully independent osu!Lazer Private Server backend.
// Copyright (C) 2021 Hikaru Team <copyright@hikaru.pw>

import * as modules from "../index.mjs";

export default async (pool, req, res) => {
  const conn = await pool.getConnection();
  const url = req.originalUrl.split("/");

  try {
    const dbResToken = await conn.query(
      `SELECT user_id FROM active_tokens WHERE access_token = ?`,
      [req.headers.authorization.split(" ")[1]]
    );

    await conn
      .query(
        `SELECT user_id, active_bm_id, current_ruleset FROM users WHERE active_id = ? LIMIT 1`,
        [url[6]]
      )
      .then(async (verify) => {
        if (Number(verify[0].current_ruleset) !== Number(req.body.ruleset_id)) {
          res.status(500);
          res.send();
          conn.end();
          return;
        } else {
          function statConverter() {
            [
              "miss",
              "meh",
              "ok",
              "good",
              "great",
              "perfect",
              "small_tick_miss",
              "small_tick_hit",
              "large_tick_miss",
              "large_tick_hit",
              "small_bonus",
              "large_bonus",
              "ignore_miss",
              "ignore_hit",
            ].forEach((convertStat) => {
              req.body.statistics[convertStat] =
                req.body.statistics[convertStat] !== undefined
                  ? req.body.statistics[convertStat]
                  : 0;
            });
          }

          statConverter();

          const score = await conn.query(
            `INSERT INTO scores_? (user_id, beatmap_id, passed, mods, count_miss, count_meh, count_ok, count_great, perfect, count_STM, count_STH, count_LTM, count_LTH, count_SB, count_LB, count_IM, count_IH, rank, total_score, pp, max_combo, accuracy) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            [
              Number(req.body.ruleset_id),
              Number(verify[0].user_id),
              Number(verify[0].active_bm_id),
              Number(req.body.passed),
              JSON.stringify(req.body.mods),
              Number(req.body.statistics.miss),
              Number(req.body.statistics.meh),
              Number(req.body.statistics.ok),
              Number(req.body.statistics.great),
              Number(req.body.statistics.perfect),
              Number(req.body.statistics.small_tick_miss),
              Number(req.body.statistics.small_tick_hit),
              Number(req.body.statistics.large_tick_miss),
              Number(req.body.statistics.large_tick_hit),
              Number(req.body.statistics.small_bonus),
              Number(req.body.statistics.large_bonus),
              Number(req.body.statistics.ignore_miss),
              Number(req.body.statistics.ignore_hit),
              String(req.body.rank),
              Number(req.body.total_score),
              null,
              Number(req.body.max_combo),
              Number(req.body.accuracy),
            ]
          );

          const score_id = await conn.query(
            `SELECT score_id FROM scores_? WHERE user_id = ? ORDER BY created_at DESC LIMIT 1`,
            [Number(req.body.ruleset_id), verify[0].user_id]
          );

          const user_mode = await conn.query(
            `SELECT * FROM users_? WHERE user_id = ? LIMIT 1`,
            [Number(verify[0].current_ruleset), Number(verify[0].user_id)]
          );

          const user = await conn.query(
            `SELECT * FROM users WHERE user_id = ? LIMIT 1`,
            [Number(verify[0].user_id)]
          );

          const beatmap = await conn.query(
            `SELECT total_length FROM beatmaps WHERE beatmap_id = ? LIMIT 1`,
            [verify[0].active_bm_id]
          );

          let playtime = 0;

          if (
            beatmap[0].total_length >
            Number(
              Date.now() / 1000 -
                new Date(user_mode[0].play_start).getTime() / 1000
            )
          ) {
            playtime = Number(
              Date.now() / 1000 -
                new Date(user_mode[0].play_start).getTime() / 1000
            );
          } else {
            playtime = beatmap[0].total_length;
          }

          await conn.query(
            `UPDATE users_? SET total_score = ?, playcount = ?, total_hits = ?, play_time = ? WHERE user_id = ?`,
            [
              Number(verify[0].current_ruleset),
              Number(user_mode[0].total_score) + Number(req.body.total_score),
              Number(user_mode[0].playcount + 1),
              Number(req.body.statistics.good) +
                Number(req.body.statistics.great) +
                Number(req.body.statistics.meh) +
                Number(req.body.statistics.ok) +
                Number(user_mode[0].total_hits),
              Number(Number(user_mode[0].play_time) + playtime),
              Number(verify[0].user_id),
            ]
          );

          conn.end();
          res.status(200);
          res.send({
            accuracy: Number(req.body.accuracy),
            beatmap_id: Number(verify[0].active_bm_id),
            build_id: Number(req.body.build_id),
            ended_at: new Date(Date.now()).toISOString(),
            legacy_score_id: null,
            legacy_total_score: null,
            max_combo: Number(req.body.max_combo),
            maximum_statistics: {}, // TODO: Implement
            mods: req.body.mods,
            passed: Boolean(req.body.passed),
            // pp: null, // TODO: PP Calc
            rank: String(req.body.rank),
            // replay: false, // TODO: Replay Implementation
            ruleset_id: Number(req.body.ruleset_id),
            started_at: modules.sqlToOsuDate(user[0].play_start),
            statistics: {
              // TODO: Remove null values
              good: Number(req.body.statistics.good),
              great: Number(req.body.statistics.great),
              large_bonus: Number(req.body.statistics.large_bonus),
              large_tick_hit: Number(req.body.statistics.large_tick_hit),
              large_tick_miss: Number(req.body.statistics.large_tick_miss),
              meh: Number(req.body.statistics.meh),
              miss: Number(req.body.statistics.miss),
              ok: Number(req.body.statistics.ok),
              perfect: Number(req.body.statistics.perfect),
              small_bonus: Number(req.body.statistics.small_bonus),
              small_tick_hit: Number(req.body.statistics.small_tick_hit),
              small_tick_miss: Number(req.body.statistics.small_tick_miss),
              ignore_miss: Number(req.body.statistics.ignore_miss),
              ignore_hit: Number(req.body.statistics.ignore_hit),
            },
            total_score: Number(req.body.total_score),
            user_id: Number(verify[0].user_id),
          });
        }
      });
  } catch (err) {
    console.log(err);
    res.status(500);
    res.send();
    conn.end();
    return;
  }
};
