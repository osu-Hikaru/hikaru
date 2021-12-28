// Licensed under GPL v3 - Check Repository Root for full License notice.
// osu!Hikaru, a fully independent osu!Lazer Private Server backend.
// Copyright (C) 2021 Hikaru Team <copyright@hikaru.pw>

export default async (pool, req, res) => {
  const conn = await pool.getConnection();
  const dbResToken = await conn
    .query(`SELECT id FROM active_tokens WHERE access_token = ?`, [
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
      `SELECT * FROM channels WHERE target_1 = ? AND target_2 = ? OR target_2 = ? AND target_1 = ? LIMIT 1`,
      [
        dbResToken[0].id,
        req.body.target_id,
        dbResToken[0].id,
        req.body.target_id,
      ]
    )
    .then((apiResChannels) => {
      if (apiResChannels[0] === undefined) {
        res.status(200);
        res.json({
          channel_id: null,
          description: null,
          icon: null,
          moderated: null,
          name: null,
          recent_messages: [],
          type: null,
        });
      } else {
        res.status(200);
        res.json({
          channel_id: null,
          description: null,
          icon: null,
          moderated: null,
          name: null,
          recent_messages: [],
          type: null,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500);
      res.send();
      conn.end();
      return;
    });
};
