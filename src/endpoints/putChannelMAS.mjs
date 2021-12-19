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

  conn
    .query(`UPDATE chat_presence SET last_read_id = ? WHERE user_id = ?`, [
      Number(url[6]),
      dbResToken[0].id,
    ])
    .then((dbResPresence) => {
      res.status(200);
      res.json({});
    })
    .catch((err) => {
      console.log(err);
      res.status(500);
      res.send();
      conn.close();
      return;
    });
};
