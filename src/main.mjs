// Licensed under GPL v3 - Check Repository Root for full License notice.
// osu!Hikaru, a fully independent osu!Lazer Private Server backend.
// Copyright (C) 2021 Christen Tautz <chrisneuss01@gmail.com>

import express from "express";
import morgan from "morgan";
import multer from "multer";
import bcrypt from "bcrypt";
import mariadb from "mariadb";
import fs from "fs";
import * as bodyparser from "body-parser";

const api = express();
const upload = multer();

const config = JSON.parse(
  await fs.readFileSync("./src/config.json", "utf-8", () => {})
);
const charset =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");

const pool = mariadb.createPool({
  host: config.mariadb.host,
  user: config.mariadb.user,
  password: config.mariadb.password,
  database: config.mariadb.database,
  connectionLimit: config.mariadb.connectionLimit,
});

function genToken(length) {
  let token = "";

  while (token.length < length) {
    token += charset[Math.floor(Math.random() * charset.length)];
  }

  return token;
}

async function updateUserStatus() {
  const conn = await pool.getConnection();

  await conn.query(`SELECT * FROM users`).then((dbRes) => {
    dbRes.forEach(async (user) => {
      if (new Date(user.last_visit) < Date.now() - 1000 * 60 * 5) {
        await conn.query(`UPDATE users SET is_online = 0 WHERE id = ?`, [
          user.id,
        ]);
      }
    });
  });

  setTimeout(updateUserStatus, 1000 * 60 * 5);
}
updateUserStatus();

async function logMariadbStats() {
  console.log({
    "Total Connections": pool.totalConnections(),
    "Active Connections": pool.activeConnections(),
    "Idle Connections": pool.idleConnections(),
  });
}
setInterval(logMariadbStats, 1000 * 60 * 2);

async function runRankCalc() {
  const conn = await pool.getConnection();
  let i = 0;

  conn
    .query(`SELECT * FROM users ORDER BY pp DESC`)
    .then(async (dbRes) => {
      await dbRes.forEach((player) => {
        i++;
        conn.query(`UPDATE users SET global_rank = ? WHERE id = ?`, [
          i,
          player.id,
        ]);
      });
      conn.close();
      setTimeout(runRankCalc, 1000 * 60 * 1);
      return;
    })
    .catch((err) => {
      console.log(err);
      conn.close();
      setTimeout(runRankCalc, 1000 * 60 * 1);
      return;
    });
}
runRankCalc();

function genNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function main() {
  api.use(morgan("dev"));
  api.use(bodyparser.default.json());
  api.use(bodyparser.default.urlencoded({ extended: true }));

  api.post("/users", upload.none(), async (req, res) => {
    const conn = await pool.getConnection();

    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        console.log(err);
        res.status(500);
        res.send();
        conn.close();
        return;
      }

      bcrypt.hash(req.body.user.password, salt, async (err, hash) => {
        if (err) {
          console.log(err);
          res.status(500);
          res.send();
          conn.close();
          return;
        }

        await conn
          .query(
            `INSERT INTO accounts (username, email, password) VALUES (?,?,?)`,
            [req.body.user.username, req.body.user.user_email, hash]
          )
          .then(async () => {
            await conn
              .query(`SELECT * FROM accounts WHERE username = ?`, [
                req.body.user.username,
              ])
              .then(async (apiRes) => {
                await conn.query(
                  `INSERT INTO users (username, id, is_active, is_bot, is_deleted, is_online, is_supporter, avatar_url, country_code, country_name, total_score, join_date) VALUES (?, ?, ? ,? ,? ,? ,?, ?, ?, ?, ?, ?)`,
                  [
                    apiRes[0].username,
                    apiRes[0].id,
                    Boolean(1),
                    Boolean(0),
                    Boolean(0),
                    Boolean(1),
                    Boolean(0),
                    String("https://a.hikaru.pw/1/default_av.jpg"),
                    null,
                    null,
                    Number(0),
                    new Date(),
                  ]
                );
                res.status(200);
                res.send();
                conn.close();
                return;
              });
          })
          .catch((err) => {
            console.log(err);
            res.status(400);
            res.json({
              error: "user_already_exists",
              error_description:
                "The provided username or email is already in use. Please change it before attempting to register again.",
              hint: "Username or Email already in use",
              message:
                "The provided username or email is already in use. Please change it before attempting to register again.",
            });
            conn.close();
            return;
          });
      });
    });
  });

  api.post("/oauth/token", upload.none(), async (req, res) => {
    const conn = await pool.getConnection();
    if (req.body.refresh_token !== undefined) {
      await conn
        .query(`SELECT * FROM active_tokens WHERE refresh_token = ? LIMIT 1`, [
          req.body.refresh_token,
        ])
        .then(async (dbRes) => {
          const access_token = await genToken(512);
          const expires_in = await genNumber(65000, 70000);
          const refresh_token = await genToken(512);

          conn
            .query(`DELETE FROM active_tokens WHERE refresh_token = ?`, [
              req.body.refresh_token,
            ])
            .catch((err) => {
              console.log(err);
              res.status(500);
              res.send();
              conn.close();
              return;
            });

          conn
            .query(
              `INSERT INTO active_tokens (id, access_token, expires_in, refresh_token, created_at) VALUES (?, ?, ?, ?, ?)`,
              [dbRes[0].id, access_token, expires_in, refresh_token, new Date()]
            )
            .then((dbRes1) => {
              res.status(200);
              res.json({
                access_token: access_token,
                expires_in: expires_in,
                refresh_token: refresh_token,
                token_type: "Bearer",
              });
              conn.close();
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
    } else {
      await conn
        .query(`SELECT * FROM accounts WHERE username = ? LIMIT 1`, [
          req.body.username,
        ])
        .then((dbRes) => {
          bcrypt.compare(
            req.body.password,
            dbRes[0].password,
            async (err, result) => {
              if (err) {
                console.log(err);
                res.status(500);
                res.send();
                conn.close();
                return;
              }

              if (result === true) {
                const access_token = await genToken(512);
                const expires_in = await genNumber(65000, 70000);
                const refresh_token = await genToken(512);

                conn
                  .query(
                    `INSERT INTO active_tokens (id, access_token, expires_in, refresh_token, created_at) VALUES (?, ?, ?, ?, ?)`,
                    [
                      dbRes[0].id,
                      access_token,
                      expires_in,
                      refresh_token,
                      new Date(),
                    ]
                  )
                  .then((dbRes1) => {
                    res.status(200);
                    res.json({
                      access_token: access_token,
                      expires_in: expires_in,
                      refresh_token: refresh_token,
                      token_type: "Bearer",
                    });
                    conn.close();
                  })
                  .catch((err) => {
                    console.log(err);
                    res.status(500);
                    res.send();
                    conn.close();
                    return;
                  });
              } else {
                res.status(400);
                res.json({
                  error: "invalid_grant",
                  error_description:
                    "The provided authorization grant (e.g., authorization code, resource owner credentials) or refresh token is invalid, expired, revoked, does not match the redirection URI used in the authorization request, or was issued to another client.",
                  hint: "Incorrect sign in",
                  message:
                    "The provided authorization grant (e.g., authorization code, resource owner credentials) or refresh token is invalid, expired, revoked, does not match the redirection URI used in the authorization request, or was issued to another client.",
                });
                conn.close();
                return;
              }
            }
          );
        });
    }
  });

  api.get("/api/v2/me", async (req, res) => {
    const conn = await pool.getConnection();

    await conn
      .query(`SELECT * FROM active_tokens WHERE access_token = ? LIMIT 1`, [
        req.headers.authorization.split(" ")[1],
      ])
      .then((dbRes) => {
        if (dbRes[0].created_at + dbRes[0].expires_in < Date.now()) {
          res.status(400);
          res.json({
            error: "invalid_grant",
            error_description:
              "The provided authorization grant (e.g., authorization code, resource owner credentials) or refresh token is invalid, expired, revoked, does not match the redirection URI used in the authorization request, or was issued to another client.",
            hint: "Incorrect sign in",
            message:
              "The provided authorization grant (e.g., authorization code, resource owner credentials) or refresh token is invalid, expired, revoked, does not match the redirection URI used in the authorization request, or was issued to another client.",
          });
          conn.close();
          return;
        } else {
          conn
            .query(`SELECT * FROM users WHERE id=?`, [dbRes[0].id])
            .then((dbRes1) => {
              let response = {
                avatar_url: String(dbRes1[0].avatar_url),
                country_code: String(dbRes1[0].country_code),
                default_group: "default",
                id: Number(dbRes1[0].id),
                is_active: Boolean(dbRes1[0].is_active.readInt8()),
                is_bot: Boolean(dbRes1[0].is_bot.readInt8()),
                is_deleted: Boolean(dbRes1[0].is_deleted.readInt8()),
                is_online: Boolean(dbRes1[0].is_online.readInt8()),
                is_supporter: Boolean(dbRes1[0].is_supporter.readInt8()),
                last_visit: String(
                  new Date(dbRes1[0].last_visit).toISOString()
                ),
                pm_friends_only: false,
                profile_colour: null,
                username: String(dbRes1[0].username),
                cover_url: "https://a.hikaru.pw/1/default_cv.jpg",
                discord: null,
                has_supported: Boolean(dbRes1[0].has_supported.readInt8()),
                interests: null,
                join_date: String(new Date(dbRes1[0].join_date).toISOString()),
                kudosu: {
                  total: 0,
                  available: 0,
                },
                location: null,
                max_blocks: 50,
                max_friends: 250,
                occupation: null,
                playmode: "osu",
                playstyle: null,
                post_count: 0,
                profile_order: [
                  "me",
                  "recent_activity",
                  "top_ranks",
                  "medals",
                  "historical",
                  "beatmaps",
                  "kudosu",
                ],
                title: null,
                title_url: null,
                twitter: null,
                website: null,
                country: {
                  code: String(dbRes1[0].country_code),
                  name: String(dbRes1[0].country_name),
                },
                cover: {
                  custom_url: null,
                  url: "https://a.hikaru.pw/1/default_cv.jpg",
                  id: "4",
                },
                account_history: [],
                active_tournament_banner: null,
                badges: [],
                beatmap_playcounts_count: 0,
                comments_count: 0,
                favourite_beatmapset_count: 0,
                follower_count: 1,
                graveyard_beatmapset_count: 0,
                groups: [],
                loved_beatmapset_count: 0,
                mapping_follower_count: 0,
                monthly_playcounts: [],
                page: {
                  html: "",
                  raw: "",
                },
                pending_beatmapset_count: 0,
                previous_usernames: [],
                ranked_beatmapset_count: 0,
                replays_watched_counts: [],
                scores_best_count: 0,
                scores_first_count: 0,
                scores_recent_count: 0,
                statistics: {
                  level: {
                    current: 1,
                    progress: 0,
                  },
                  global_rank: Number(dbRes1[0].global_rank),
                  pp: Number(dbRes1[0].pp),
                  ranked_score: 0,
                  hit_accuracy: 0,
                  play_count: Number(dbRes1[0].playcount),
                  play_time: null,
                  total_score: Number(dbRes1[0].total_score),
                  total_hits: 0,
                  maximum_combo: 0,
                  replays_watched_by_others: 0,
                  is_ranked: false,
                  grade_counts: {
                    ss: 0,
                    ssh: 0,
                    s: 0,
                    sh: 0,
                    a: 0,
                  },
                  rank: {
                    country: null,
                  },
                },
                support_level: 0,
                user_achievements: [],
                rankHistory: null,
                rank_history: null,
                ranked_and_approved_beatmapset_count: 0,
                unranked_beatmapset_count: 0,
              };

              console.log(response);
              res.status(200);
              res.json(response);
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
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500);
        res.send();
        conn.close();
        return;
      });
  });

  api.all("*", async (req, res, next) => {
    const conn = await pool.getConnection();

    if (req.headers.authorization !== undefined) {
      await conn
        .query(`SELECT * FROM active_tokens WHERE access_token = ? LIMIT 1`, [
          req.headers.authorization.split(" ")[1],
        ])
        .then((dbRes) => {
          if (dbRes[0] === undefined) {
            res.status(400);
            res.json({
              error: "invalid_grant",
              error_description:
                "The provided authorization grant (e.g., authorization code, resource owner credentials) or refresh token is invalid, expired, revoked, does not match the redirection URI used in the authorization request, or was issued to another client.",
              hint: "Incorrect sign in",
              message:
                "The provided authorization grant (e.g., authorization code, resource owner credentials) or refresh token is invalid, expired, revoked, does not match the redirection URI used in the authorization request, or was issued to another client.",
            });
            conn.close();
            return;
          } else {
            if (dbRes[0].created_at + dbRes[0].expires_in < Date.now()) {
              res.status(400);
              res.json({
                error: "invalid_grant",
                error_description:
                  "The provided authorization grant (e.g., authorization code, resource owner credentials) or refresh token is invalid, expired, revoked, does not match the redirection URI used in the authorization request, or was issued to another client.",
                hint: "Incorrect sign in",
                message:
                  "The provided authorization grant (e.g., authorization code, resource owner credentials) or refresh token is invalid, expired, revoked, does not match the redirection URI used in the authorization request, or was issued to another client.",
              });
              conn.close();
              return;
            } else {
              conn
                .query(
                  `UPDATE users SET last_visit = ?, is_online = 1 WHERE id = ?`,
                  [new Date(), dbRes[0].id]
                )
                .then((apiResUsers) => {
                  next();
                  conn.close();
                })
                .catch((err) => {
                  console.log(err);
                  res.status(500);
                  res.send();
                  conn.close();
                  return;
                });
            }
          }
        })
        .catch((err) => {
          console.log(err);
          res.status(500);
          res.send();
          conn.close();
          return;
        });
    } else {
      res.status(401);
      res.json({ message: "Unauthorized." });
      conn.close();
      return;
    }
  });

  api.get("/api/v2/users/*/*", async (req, res) => {
    const conn = await pool.getConnection();
    const url = req.originalUrl.split("/");
    let query2 = "";

    if (req.query.key === "id") {
      query2 = `id`;
    } else if (req.query.key === "username") {
      query2 = `username`;
    } else {
      res.status(400);
      res.send();
      conn.close();
      return;
    }

    conn
      .query(`SELECT * FROM users WHERE ${query2}=?`, [url[4]])
      .then((dbRes1) => {
        res.status(200);
        res.json({
          avatar_url: String(dbRes1[0].avatar_url),
          country_code: String(dbRes1[0].country_code),
          default_group: "default",
          id: Number(dbRes1[0].id),
          is_active: Boolean(dbRes1[0].is_active.readInt8()),
          is_bot: Boolean(dbRes1[0].is_bot.readInt8()),
          is_deleted: Boolean(dbRes1[0].is_deleted.readInt8()),
          is_online: Boolean(dbRes1[0].is_online.readInt8()),
          is_supporter: Boolean(dbRes1[0].is_supporter.readInt8()),
          last_visit: String(new Date(dbRes1[0].last_visit).toISOString()),
          pm_friends_only: false,
          profile_colour: null,
          username: String(dbRes1[0].username),
          cover_url: "https://a.hikaru.pw/1/default_cv.jpg",
          discord: null,
          has_supported: Boolean(dbRes1[0].has_supported.readInt8()),
          interests: null,
          join_date: String(new Date(dbRes1[0].join_date).toISOString()),
          kudosu: {
            total: 0,
            available: 0,
          },
          location: null,
          max_blocks: 50,
          max_friends: 250,
          occupation: null,
          playmode: String(url[5].split("?")[0]),
          playstyle: null,
          post_count: 0,
          profile_order: [
            "me",
            "recent_activity",
            "top_ranks",
            "medals",
            "historical",
            "beatmaps",
            "kudosu",
          ],
          title: null,
          title_url: null,
          twitter: null,
          website: null,
          country: {
            code: String(dbRes1[0].country_code),
            name: String(dbRes1[0].country_name),
          },
          cover: {
            custom_url: null,
            url: "https://a.hikaru.pw/1/default_cv.jpg",
            id: "4",
          },
          account_history: [],
          active_tournament_banner: null,
          badges: [],
          beatmap_playcounts_count: 0,
          comments_count: 0,
          favourite_beatmapset_count: 0,
          follower_count: 1,
          graveyard_beatmapset_count: 0,
          groups: [],
          loved_beatmapset_count: 0,
          mapping_follower_count: 0,
          monthly_playcounts: [],
          page: {
            html: "",
            raw: "",
          },
          pending_beatmapset_count: 0,
          previous_usernames: [],
          ranked_beatmapset_count: 0,
          replays_watched_counts: [],
          scores_best_count: 0,
          scores_first_count: 0,
          scores_recent_count: 0,
          statistics: {
            level: {
              current: 1,
              progress: 0,
            },
            global_rank: Number(dbRes1[0].global_rank),
            pp: Number(dbRes1[0].pp),
            ranked_score: 0,
            hit_accuracy: 0,
            play_count: Number(dbRes1[0].playcount),
            play_time: null,
            total_score: Number(dbRes1[0].total_score),
            total_hits: 0,
            maximum_combo: 0,
            replays_watched_by_others: 0,
            is_ranked: false,
            grade_counts: {
              ss: 0,
              ssh: 0,
              s: 0,
              sh: 0,
              a: 0,
            },
            rank: {
              country: null,
            },
          },
          support_level: 0,
          user_achievements: [],
          rankHistory: null,
          rank_history: null,
          ranked_and_approved_beatmapset_count: 0,
          unranked_beatmapset_count: 0,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500);
        res.send();
        conn.close();
        return;
      });
    conn.close();
    return;
  });

  api.get("/api/v2/chat/updates", async (req, res) => {
    const conn = await pool.getConnection();
    const messages = [];
    const presences = [];
    const promises = { presences: [], messages: [] };

    async function main() {
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

      await conn
        .query(`SELECT * FROM chat_presence WHERE user_id = ?`, [
          dbResToken[0].id,
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
                      conn.close();
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
                      conn.close();
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
                      conn.close();
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
          conn.close();
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
                      `SELECT * FROM users WHERE id = ? LIMIT 1`,
                      [message.user_id]
                    );
                    resolve({
                      channel_id: Number(message.channel_id),
                      content: String(message.message_content),
                      is_action: Boolean(message.is_action.readInt8()),
                      message_id: Number(message.message_id),
                      sender: {
                        avatar_url: String(dbResUser[0].avatar_url),
                        country_code: String(dbResUser[0].country_code),
                        default_group: "default",
                        id: Number(dbResUser[0].id),
                        is_active: Boolean(dbResUser[0].is_active.readInt8()),
                        is_bot: Boolean(dbResUser[0].is_bot.readInt8()),
                        is_deleted: Boolean(dbResUser[0].is_deleted.readInt8()),
                        is_online: Boolean(dbResUser[0].is_online.readInt8()),
                        is_supporter: Boolean(
                          dbResUser[0].is_supporter.readInt8()
                        ),
                        last_visit: String(
                          dbResUser[0].last_visit.toISOString()
                        ),
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
            conn.close();
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
                  conn.close();
                  return;
                });
            }
          });
        });
        res.status(200);
        res.json({ messages: messages, presence: presences, silences: [] });
        conn.close();
      })
      .catch((err) => {
        console.log(err);
        res.status(500);
        res.send();
        conn.close();
        return;
      });
  });

  api.get("/api/v2/chat/channels", async (req, res) => {
    const conn = await pool.getConnection();
    const message = [];

    conn
      .query(`SELECT * FROM channels`)
      .then((dbRes) => {
        dbRes.forEach((result) => {
          message.push(result);
        });

        res.status(200);
        res.json(message);
        conn.close();
      })
      .catch((err) => {
        console.log(err);
        res.status(500);
        res.send();
        conn.close();
        return;
      });
  });

  api.get("/api/v2/friends", (req, res) => {
    res.status(200);
    res.json([]);
  });

  api.get("/api/v2/seasonal-backgrounds", (req, res) => {
    res.status(200);
    res.json({
      ends_at: "2099-01-01T16:00:00+00:00",
      backgrounds: [
        {
          url: "https://a.hikaru.pw/seasonals/s_0.jpg",
          user: {
            avatar_url: null,
            country_code: null,
            default_group: "default",
            id: null,
            is_active: false,
            is_bot: false,
            is_deleted: false,
            is_online: false,
            is_supporter: false,
            last_visit: null,
            pm_friends_only: false,
            profile_colour: null,
            username: null,
          },
        },
      ],
    });
  });

  api.put("/api/v2/chat/channels/*/users/*", async (req, res) => {
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

    if (url[8] === dbResToken.id) {
      await conn
        .query(
          `INSERT INTO chat_presence (user_id, channel_id, can_message) VALUES (?,?,?)`,
          [Number(dbResToken[0].id), Number(url[5]), Number(true)]
        )
        .then(async (dbResChatPresence) => {
          await conn
            .query(`SELECT * FROM channels WHERE channel_id = ? LIMIT 1`, [
              Number(url[5]),
            ])
            .then(async (dbResChannel) => {
              await conn
                .query(
                  `SELECT message_id from messages WHERE channel_id = ? ORDER BY message_id DESC LIMIT 1`,
                  [dbResChannel[0].channel_id]
                )
                .then((dbChannelLast) => {
                  let last_message_id;

                  if (dbChannelLast[0] === undefined) {
                    last_message_id = 0;
                  } else {
                    last_message_id = Number(dbChannelLast[0].message_id);
                  }

                  conn.close();
                  res.status(200);
                  res.json({
                    channel_id: Number(url[6]),
                    current_user_attributes: {
                      can_message: Boolean(true),
                      last_read_id: Number(null),
                    },
                    description: String(dbResChannel[0].description),
                    icon: String(dbResChannel[0].icon),
                    last_message_id: last_message_id,
                    last_read_id: null,
                    moderated: Boolean(dbResChannel[0].moderated),
                    name: String(dbResChannel[0].name),
                    type: String(dbResChannel[0].type),
                    users: [],
                  });
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
    } else {
      res.status(403);
      res.send();
    }
  });

  api.put("/api/v2/chat/channels/*/mark-as-read/*", async (req, res) => {
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
        Number(url[7]),
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
  });

  api.delete("/api/v2/chat/channels/*/users/*", async (req, res) => {
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

    if (url[8] === dbResToken.id) {
      await conn
        .query(
          `DELETE FROM chat_presence WHERE user_id = ? AND channel_id = ?`,
          [Number(dbResToken[0].id), Number(url[5])]
        )
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
  });

  api.get("/api/v2/chat/channels/*/messages", (req, res) => {
    res.status(200);
    res.json({});
  });

  api.post("/api/v2/chat/channels", upload.none(), (req, res) => {
    const conn = await pool.getConnection();
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
        conn.close();
        return;
      });
  });

  api.post(
    "/api/v2/chat/channels/*/messages",
    upload.none(),
    async (req, res) => {
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
    }
  );

  api.put("/api/v2/beatmaps/*/solo/scores/*", async (req, res) => {
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

    if (req.body.user.id === dbResToken[0].id) {
      await conn
        .query(
          `SELECT active_id, active_bm_id, current_ruleset FROM users WHERE id = ? LIMIT 1`,
          [req.body.user.id]
        )
        .then(async (verify) => {
          if (
            Number(verify[0].active_id) !== Number(url[7]) ||
            Number(verify[0].active_bm_id) !== Number(url[4]) ||
            Number(verify[0].current_ruleset) !== Number(req.body.ruleset_id)
          ) {
            res.status(500);
            res.send();
            conn.close();
            return;
          } else {
            const playdate = new Date();

            const score = await conn
              .query(
                `INSERT INTO scores (user_id, beatmap_id, ruleset_id, passed, count_miss, count_meh, count_ok, count_good, count_great, perfect, count_STM, count_STH, count_LTM, count_LTH, count_SB, count_LB, rank, total_score, pp, max_combo, accuracy, date) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                [
                  Number(req.body.user.id),
                  Number(url[4]),
                  Number(req.body.ruleset_id),
                  Boolean(req.body.passed),
                  Number(req.body.statistics.Miss),
                  Number(req.body.statistics.Meh),
                  Number(req.body.statistics.Ok),
                  Number(req.body.statistics.Good),
                  Number(req.body.statistics.Great),
                  Number(req.body.statistics.Perfect),
                  Number(req.body.statistics.SmallTickMiss),
                  Number(req.body.statistics.SmallTickHit),
                  Number(req.body.statistics.LargeTickMiss),
                  Number(req.body.statistics.LargeTickHit),
                  Number(req.body.statistics.SmallBonus),
                  Number(req.body.statistics.LargeBonus),
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
                res.status(500);
                res.send();
                conn.close();
                return;
              });

            const score_id = await conn.query(
              `SELECT score_id FROM scores WHERE user_id = ? AND date = ? LIMIT 1`,
              [req.body.user.id, playdate]
            );

            const user = await conn
              .query(`SELECT * FROM users WHERE id = ? LIMIT 1`, [
                req.body.user.id,
              ])
              .catch((err) => {
                console.log(err);
                res.status(500);
                res.send();
                conn.close();
                return;
              });

            await conn
              .query(
                `UPDATE users SET total_score = ?, playcount = ? WHERE id = ?`,
                [
                  Number(user[0].total_score) + Number(req.body.total_score),
                  Number(user[0].playcount + 1),
                  Number(req.body.user.id),
                ]
              )
              .catch((err) => {
                console.log(err);
                res.status(500);
                res.send();
                conn.close();
                return;
              });

            conn.close();
            res.status(200);
            res.send({
              accuracy: Number(req.body.accuracy),
              beatmap_id: Number(url[4]),
              build_id: 6100,
              ended_at: new Date(Date.now()).toISOString(),
              id: Number(score_id),
              max_combo: Number(req.body.max_combo),
              mods: [],
              passed: Boolean(req.body.passed),
              rank: String(req.body.rank),
              ruleset_id: Number(req.body.ruleset_id),
              started_at: new Date(user[0].play_start).toISOString(),
              statistics: {
                Good: Number(req.body.statistics.Good),
                Great: Number(req.body.statistics.Great),
                LargeBonus: Number(req.body.statistics.LargeBonus),
                LargeTickHit: Number(req.body.statistics.LargeTickHit),
                LargeTickMiss: Number(req.body.statistics.LargeTickMiss),
                Meh: Number(req.body.statistics.Meh),
                Miss: Number(req.body.statistics.Miss),
                Ok: Number(req.body.statistics.Ok),
                Perfect: Number(req.body.statistics.Perfect),
                SmallBonus: Number(req.body.statistics.SmallBonus),
                SmallTickHit: Number(req.body.statistics.SmallTickHit),
                SmallTickMiss: Number(req.body.statistics.SmallTickMiss),
              },
              total_score: Number(req.body.total_score),
              user_id: Number(req.body.user.id),
            });
          }
        });
    } else {
      conn.close();
      res.status(400);
      res.json({});
      return;
    }
  });

  api.get("/api/v2/beatmaps/*/scores", (req, res) => {
    res.status(200);
    res.json({});
  });

  api.post(
    "/api/v2/beatmaps/*/solo/scores",
    upload.none(),
    async (req, res) => {
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
    }
  );

  api.all("*", (req, res) => {
    res.status(404);
    res.json({ message: "Not found." });
  });

  api.listen(26701, () => {
    console.log(`Server running on port 26701`);
  });
}
main();
