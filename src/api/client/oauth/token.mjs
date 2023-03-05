// Licensed under GPL v3 - Check Repository Root for full License notice.
// osu!Hikaru, a fully independent osu!Lazer Private Server backend.
// Copyright (C) 2023 Hikaru Team <copyright@hikaru.pw>

import fs from "node:fs/promises";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export default async (pool, req, res) => {
  const conn = await pool.getConnection();

  try {
    if (req.fields.username && req.fields.password) {
      const checkUser = await conn.query(
        `SELECT * FROM accounts WHERE username = ? LIMIT 1`,
        [String(req.fields.username)]
      );

      if (checkUser[0] === undefined) {
        res.status(400);
        res.send();
        conn.end();
        return;
      } else {
        const compareResult = await bcrypt.compareSync(
          String(req.fields.password),
          checkUser[0].password
        );

        if (compareResult === true) {
          res.status(200);
          res.json({
            access_token: await jwt.sign(
              {
                iss: "osu!Hikaru",
                client_id: checkUser[0].user_id,
                username: checkUser[0].username,
                email: checkUser[0].email,
              },
              await fs.readFile("./src/secrets/jwtRS256.key", "utf-8"),
              { algorithm: "RS256", expiresIn: "1h" }
            ),
            expires_in: 3600,
            refresh_token: null,
            token_type: "Bearer",
          });
          conn.end();
          return;
        } else {
          res.status(400);
          res.send();
          conn.end();
          return;
        }
      }
    } else {
      res.status(403);
      res.json({ message: "No authorization provided." });
      conn.end();
      return;
    }
  } catch (err) {
    console.log(err);
    res.status(500);
    res.send();
    conn.end();
    return;
  }
};
