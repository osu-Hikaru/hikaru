// Licensed under GPL v3 - Check Repository Root for full License notice.
// osu!Hikaru, a fully independent osu!Lazer Private Server backend.
// Copyright (C) 2021 Hikaru Team <copyright@hikaru.pw>

import bcrypt from "bcrypt";

export default async (pool, req, res) => {
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
                `INSERT INTO users (username, id, join_date) VALUES (?, ?, ?)`,
                [apiRes[0].username, apiRes[0].id, new Date()]
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
};
