// Licensed under GPL v3 - Check Repository Root for full License notice.
// osu!Hikaru, a fully independent osu!Lazer Private Server backend.
// Copyright (C) 2021 Hikaru Team <copyright@hikaru.pw>

export default async (pool) => {
  console.log("Running checkActiveTokens");
  const conn = await pool.getConnection();
  let i = 0;

  await conn
    .query(`SELECT * FROM active_tokens`)
    .then(async (dbResToken) => {
      await dbResToken.forEach(async (token) => {
        if (
          new Date(token.created_at).getTime() + Number(token.expires_in) >
          Date.now() + 1000 * 60 * 60 * 24
        ) {
          await conn
            .query(`DELETE FROM active_tokens WHERE access_token = ?`, [
              token.access_token,
            ])
            .catch((err) => {
              console.log(err);
              conn.close();
              return;
            });
        }
      });
      conn.close();
      return;
    })
    .catch((err) => {
      console.log(err);
      conn.close();
      return;
    });
};
