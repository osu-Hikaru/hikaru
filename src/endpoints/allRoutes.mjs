// Licensed under GPL v3 - Check Repository Root for full License notice.
// osu!Hikaru, a fully independent osu!Lazer Private Server backend.
// Copyright (C) 2021 Hikaru Team <copyright@hikaru.pw>

export default async (pool, req, res, next) => {
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
          conn.end();
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
            conn.end();
            return;
          } else {
            conn
              .query(
                `UPDATE users SET last_visit = ?, is_online = 1 WHERE user_id = ?`,
                [new Date(), dbRes[0].user_id]
              )
              .then((apiResUsers) => {
                next();
                conn.end();
              })
              .catch((err) => {
                console.log(err);
                res.status(500);
                res.send();
                conn.end();
                return;
              });
          }
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500);
        res.send();
        conn.end();
        return;
      });
  } else {
    res.status(401);
    res.json({ message: "Unauthorized." });
    conn.end();
    return;
  }
};
