// Licensed under GPL v3 - Check Repository Root for full License notice.
// osu!Hikaru, a fully independent osu!Lazer Private Server backend.
// Copyright (C) 2021 Hikaru Team <copyright@hikaru.pw>

import * as modules from "../index.mjs";

export default async (pool, req, res) => {
  const conn = await pool.getConnection();
  const url = req.originalUrl.split("/");

  console.log(req.body)

  const dbResToken = await conn
    .query(`SELECT user_id FROM active_tokens WHERE access_token = ?`, [
      req.headers.authorization.split(" ")[1],
    ])
    .catch((err) => {
      console.log(err);
      res.status(500);
      res.send();
      conn.end();
      return;
    });

  await conn
    .query(
      `SELECT active_id, active_bm_id, current_ruleset FROM users WHERE user_id = ? LIMIT 1`,
      [dbResToken[0].user_id]
    )
    .then(async (verify) => {
      if (
        Number(verify[0].active_id) !== Number(url[6]) ||
        Number(verify[0].active_bm_id) !== Number(url[3]) ||
        Number(verify[0].current_ruleset) !== Number(req.body.ruleset_id)
      ) {
        res.status(500);
        res.send();
        conn.end();
        return;
      } else {
        const playdate = new Date();

        const score = await conn
          .query(
            `INSERT INTO scores (user_id, beatmap_id, ruleset_id, passed, mods, count_miss, count_meh, count_ok, count_good, count_great, perfect, count_STM, count_STH, count_LTM, count_LTH, count_SB, count_LB, count_IM, count_IH, rank, total_score, pp, max_combo, accuracy, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            [
              Number(dbResToken[0].user_id),
              Number(url[3]),
              Number(req.body.ruleset_id),
              Number(req.body.passed),
              JSON.stringify(req.body.mods),
              Number(req.body.statistics.miss),
              Number(req.body.statistics.meh),
              Number(req.body.statistics.ok),
              Number(req.body.statistics.good),
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
              playdate,
            ]
          )
          .catch((err) => {
            console.log(err);
            console.log(req.body);
            res.status(500);
            res.send();
            conn.end();
            return;
          });

        const score_id = await conn.query(
          `SELECT score_id FROM scores WHERE user_id = ? AND created_at = ? LIMIT 1`,
          [dbResToken[0].user_id, playdate]
        );

        const user = await conn
          .query(`SELECT * FROM users WHERE user_id = ? LIMIT 1`, [
            dbResToken[0].user_id,
          ])
          .catch((err) => {
            console.log(err);
            res.status(500);
            res.send();
            conn.end();
            return;
          });

        const beatmap = await conn
          .query(
            `SELECT total_length FROM beatmaps WHERE beatmap_id = ? LIMIT 1`,
            [url[3]]
          )
          .catch((err) => {
            console.log(err);
            res.status(500);
            res.send();
            conn.end();
            return;
          });

        let playtime = 0;

        if (
          beatmap[0].total_length >
          Number(
            Date.now() / 1000 - new Date(user[0].play_start).getTime() / 1000
          )
        ) {
          playtime = Number(
            Date.now() / 1000 - new Date(user[0].play_start).getTime() / 1000
          );
        } else {
          playtime = beatmap[0].total_length;
        }

        await conn
          .query(
            `UPDATE users SET total_score = ?, playcount = ?, total_hits = ?, play_time = ? WHERE user_id = ?`,
            [
              Number(user[0].total_score) + Number(req.body.total_score),
              Number(user[0].playcount + 1),
              Number(req.body.statistics.good) +
                Number(req.body.statistics.great) +
                Number(req.body.statistics.meh) +
                Number(req.body.statistics.ok) +
                Number(user[0].total_hits),
              Number(Number(user[0].play_time) + playtime),
              Number(dbResToken[0].user_id),
            ]
          )
          .catch((err) => {
            console.log(err);
            res.status(500);
            res.send();
            conn.end();
            return;
          });

        conn.end();
        res.status(200);
        res.send({
          accuracy: Number(req.body.accuracy),
          beatmap_id: Number(url[3]),
          build_id: 6100,
          ended_at: new Date(Date.now()).toISOString(),
          id: Number(score_id),
          max_combo: Number(req.body.max_combo),
          mods: req.body.mods,
          passed: Boolean(req.body.passed),
          rank: String(req.body.rank),
          ruleset_id: Number(req.body.ruleset_id),
          started_at: new Date(user[0].play_start).toISOString(),
          statistics: {
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
          user_id: Number(dbResToken[0].user_id),
        });
      }
    });
};
