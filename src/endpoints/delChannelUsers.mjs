// Licensed under GPL v3 - Check Repository Root for full License notice.
// osu!Hikaru, a fully independent osu!Lazer Private Server backend.
// Copyright (C) 2021 Hikaru Team <copyright@hikaru.pw>

export default async (pool, req, res) => {
  const conn = await pool.getConnection();
  const url = req.originalUrl.split("/");
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

  if (url[7] === dbResToken.id) {
    await conn
      .query(`DELETE FROM chat_presence WHERE user_id = ? AND channel_id = ?`, [
        Number(dbResToken[0].id),
        Number(url[4]),
      ])
      .then(async (dbResChatPresence) => {
        conn.close();
        res.status(200);
        res.send();
      });
  } else {
    conn.close();
    res.status(403);
    res.send();
  }
};
