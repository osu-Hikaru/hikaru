// Licensed under GPL v3 - Check Repository Root for full License notice.
// osu!Hikaru, a fully independent osu!Lazer Private Server backend.
// Copyright (C) 2021 Hikaru Team <copyright@hikaru.pw>

export default async (pool, req, res) => {
  const conn = await pool.getConnection();
  const messages = [];
  const presences = [];
  const promises = { presences: [], messages: [] };

  async function main() {
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
      .query(`SELECT * FROM chat_presence WHERE user_id = ?`, [
        dbResToken[0].user_id,
      ])
      .then(async (dbResPresence) => {
        await dbResPresence.forEach(async (presence) => {
          promises.presences.push(
            new Promise(async (resolve, reject) => {
              try {
                const dbResChannels = await conn
                  .query(
                    `SELECT * FROM channels WHERE channel_id = ? LIMIT 1`,
                    [presence.channel_id]
                  )
                  .catch((err) => {
                    console.log(err);
                    res.status(500);
                    res.send();
                    conn.end();
                    return;
                  });
                const dbChannelLast = await conn
                  .query(
                    `SELECT * FROM messages WHERE channel_id = ? ORDER BY message_id DESC LIMIT 1`,
                    [presence.channel_id]
                  )
                  .catch((err) => {
                    console.log(err);
                    res.status(500);
                    res.send();
                    conn.end();
                    return;
                  });

                let users = [];

                const channelUsers = await conn
                  .query(`SELECT * FROM chat_presence WHERE channel_id = ?`, [
                    presence.channel_id,
                  ])
                  .catch((err) => {
                    console.log(err);
                    res.status(500);
                    res.send();
                    conn.end();
                    return;
                  });

                channelUsers.forEach((user) => {
                  users.push(Number(user.user_id));
                });

                let last_message_id;

                if (dbChannelLast[0] === undefined) {
                  last_message_id = 0;
                } else {
                  last_message_id = Number(dbChannelLast[0].message_id);
                }

                let data = {
                  channel_id: Number(presence.channel_id),
                  current_user_attributes: {
                    can_message: Boolean(presence.can_message.readInt8()),
                    last_read_id: Number(presence.last_read_id),
                  },
                  description: String(dbResChannels[0].description),
                  icon: String(dbResChannels[0].icon),
                  last_message_id: Number(last_message_id),
                  last_read_id: presence.last_read_id,
                  moderated: Boolean(dbResChannels[0].moderated.readInt8()),
                  name: String(dbResChannels[0].name),
                  type: String(dbResChannels[0].type),
                  users: users,
                };

                await presences.push(data);

                resolve(data);
              } catch (e) {
                reject(e);
              }
            })
          );
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500);
        res.send();
        conn.end();
        return;
      });

    await Promise.all(promises.presences).then(async (presences) => {
      let present = [];

      new Set(presences).forEach((presence) => {
        present.push(presence.channel_id);
      });

      if (present.length < 1) return;

      await conn
        .query(
          `SELECT * FROM messages WHERE channel_id IN ${
            "(" + present.join(", ") + ")"
          } AND message_id > ? ORDER BY message_id ASC LIMIT 50`,
          [req.query.since]
        )
        .then(async (dbResMessages) => {
          dbResMessages.forEach(async (message) => {
            promises.messages.push(
              new Promise(async (resolve, reject) => {
                try {
                  const dbResUser = await conn.query(
                    `SELECT * FROM users WHERE user_id = ? LIMIT 1`,
                    [message.user_id]
                  );
                  resolve({
                    channel_id: Number(message.channel_id),
                    content: String(message.message_content),
                    is_action: Boolean(message.is_action),
                    message_id: Number(message.message_id),
                    sender: {
                      avatar_url: String(dbResUser[0].avatar_url),
                      country_code: String(dbResUser[0].country_code),
                      default_group: "default",
                      id: Number(dbResUser[0].user_id),
                      is_active: Boolean(dbResUser[0].is_active),
                      is_bot: Boolean(dbResUser[0].is_bot),
                      is_deleted: Boolean(dbResUser[0].is_deleted),
                      is_online: Boolean(dbResUser[0].is_online),
                      is_supporter: Boolean(dbResUser[0].is_supporter),
                      last_visit: String(dbResUser[0].last_visit.toISOString()),
                      pm_friends_only: false,
                      profile_colour: null,
                      username: String(dbResUser[0].username),
                    },
                    sender_id: String(dbResUser[0].id),
                    timestamp: new Date(message.timestamp).toISOString(),
                  });
                } catch (e) {
                  reject(e);
                }
              })
            );
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(500);
          res.send();
          conn.end();
          return;
        });
    });
  }

  await main();

  await Promise.all(promises.messages)
    .then(async (message) => {
      message.forEach((msg) => {
        messages.push(msg);
        presences.forEach(async (pre) => {
          if (pre.channel_id === msg.channel_id) {
            pre.last_message_id = msg.message_id;
            await conn
              .query(
                `UPDATE chat_presence SET last_read_id = ? WHERE channel_id = ? AND user_id = ?`,
                [pre.last_message_id, msg.channel_id, Number(msg.sender_id)]
              )
              .catch((err) => {
                console.log(err);
                res.status(500);
                res.send();
                conn.end();
                return;
              });
          }
        });
      });
      conn.end();
      res.status(200);
      res.json({ messages: messages, presence: presences, silences: [] });
    })
    .catch((err) => {
      console.log(err);
      res.status(500);
      res.send();
      conn.end();
      return;
    });
};
