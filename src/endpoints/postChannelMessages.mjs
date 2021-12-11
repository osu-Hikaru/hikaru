// Licensed under GPL v3 - Check Repository Root for full License notice.
// osu!Hikaru, a fully independent osu!Lazer Private Server backend.
// Copyright (C) 2021 Hikaru Team <copyright@hikaru.pw>

export default async (pool, req, res) => {
  const conn = await pool.getConnection();
  const url = req.originalUrl.split("/");

  conn
    .query(`SELECT * FROM users WHERE ID = ? LIMIT 1`, dbResTokens[0].id)
    .then(async (dbResUsers) => {
      let dbResCount = await conn.query(`SELECT count(*) FROM messages`);
      const messageID = Number(dbResCount[0]["count(*)"]) + 1;

      conn
        .query(
          `INSERT INTO messages (channel_id, user_id, timestamp, message_content, is_action) VALUES (?,?,?,?,?)`,
          [
            Number(url[5]),
            Number(dbResUsers[0].id),
            new Date(Date.now()),
            String(req.body.message),
            req.body.is_action === "true",
          ]
        )
        .then((dbResMessage) => {
          res.status(200);
          res.json({
            channel_id: url[5],
            content: req.body.message,
            is_action: req.body.is_action,
            message_id: messageID,
            sender: {
              avatar_url: dbResUsers[0].avatar_url,
              country_code: dbResUsers[0].country_code,
              default_group: "default",
              id: dbResUsers[0].id,
              is_active: Boolean(dbResUsers[0].is_active.readInt8()),
              is_bot: Boolean(dbResUsers[0].is_bot.readInt8()),
              is_deleted: Boolean(dbResUsers[0].is_deleted.readInt8()),
              is_online: Boolean(dbResUsers[0].is_online.readInt8()),
              is_supporter: Boolean(dbResUsers[0].is_supporter.readInt8()),
              last_visit: new Date(Date.now()).toISOString(),
              pm_friends_only: false,
              profile_colour: null,
              username: dbResUsers[0].username,
            },
            sender_id: dbResUsers[0].id,
            timestamp: new Date(Date.now()).toISOString(),
          });
          conn.close();
          return;
        })
        .catch((err) => {
          console.log(err);
          res.status(500);
          res.send();
          conn.close();
          return;
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500);
      res.send();
      conn.close();
      return;
    });
};
