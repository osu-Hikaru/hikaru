// Licensed under GPL v3 - Check Repository Root for full License notice.
// osu!Hikaru, a fully independent osu!Lazer Private Server backend.
// Copyright (C) 2021 Hikaru Team <copyright@hikaru.pw>

export default async (pool, req, res) => {
  const conn = await pool.getConnection();
  const url = req.originalUrl.split("/");
  const scoreid = Math.floor(Math.random() * 100000000) + 1;

  const dbResToken = await conn
    .query(`SELECT id FROM active_tokens WHERE access_token = ?`, [
      req.headers.authorization.split(" ")[1],
    ])
    .catch((err) => {
      console.log(err);
      res.status(500);
      res.send();
      conn.close();
      return;
    });

  const user = await conn
    .query(
      `UPDATE users SET play_start = ?, current_ruleset = ?, active_id = ?, active_bm_id = ? WHERE id = ?`,
      [new Date(), req.body.ruleset_id, scoreid, url[4], dbResToken[0].id]
    )
    .catch((err) => {
      console.log(err);
      res.status(500);
      res.send();
      conn.close();
      return;
    });

  console.log({
    beatmap_id: Number(url[4]),
    created_at: new Date(Date.now()).toISOString(),
    id: Number(scoreid),
    user_id: Number(dbResToken[0].id),
  });

  res.status(200);
  res.json({
    beatmap_id: Number(url[4]),
    created_at: new Date(Date.now()).toISOString(),
    id: Number(scoreid),
    user_id: Number(dbResToken[0].id),
  });
};
