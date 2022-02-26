// Licensed under GPL v3 - Check Repository Root for full License notice.
// osu!Hikaru, a fully independent osu!Lazer Private Server backend.
// Copyright (C) 2021 Hikaru Team <copyright@hikaru.pw>

import * as modules from "../index.mjs";

export default async (pool, req, res) => {
  const conn = await pool.getConnection();
  const url = req.originalUrl.split("/");
  const scoreid = Math.floor(Math.random() * 100000000) + 1;

  const dbResToken = await conn
    .query(`SELECT user_id FROM active_tokens WHERE access_token = ?`, [
      req.headers.authorization.split(" ")[1],
    ])
    .catch((err) => {
      conn.end();
      console.log(err);
      res.status(500);
      res.send();
      conn.end();
      return;
    });

  let beatmap = await conn.query(
    `SELECT * FROM beatmaps WHERE beatmap_id = ? LIMIT 1`,
    [Number(url[3])]
  );

  if (beatmap.length === 0) {
    await modules.importBeatmap(pool, Number(url[3]), null);
  }

  const user = await conn
    .query(
      `UPDATE users SET play_start = ?, current_ruleset = ?, active_id = ?, active_bm_id = ? WHERE user_id = ?`,
      [new Date(), req.body.ruleset_id, scoreid, url[3], dbResToken[0].user_id]
    )
    .then((dbResUsers) => {
      conn.end();
      res.status(200);
      res.json({
        beatmap_id: Number(url[3]),
        created_at: new Date(Date.now()).toISOString(),
        id: Number(scoreid),
        user_id: Number(dbResToken[0].id),
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500);
      res.send();
      conn.end();
      return;
    });
};
