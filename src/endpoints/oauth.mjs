// Licensed under GPL v3 - Check Repository Root for full License notice.
// osu!Hikaru, a fully independent osu!Lazer Private Server backend.
// Copyright (C) 2021 Hikaru Team <copyright@hikaru.pw>

import bcrypt from "bcrypt";
import * as modules from "../index.mjs";

export default async (pool, req, res) => {
  const conn = await pool.getConnection();

  if (req.body.refresh_token !== undefined) {
    await conn
      .query(`SELECT * FROM active_tokens WHERE refresh_token = ? LIMIT 1`, [
        req.body.refresh_token,
      ])
      .then(async (dbRes) => {
        const access_token = await modules.genToken(512);
        const expires_in = await modules.genNumber(65000, 70000);
        const refresh_token = await modules.genToken(512);

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
              const access_token = await modules.genToken(512);
              const expires_in = await modules.genNumber(65000, 70000);
              const refresh_token = await modules.genToken(512);

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
};