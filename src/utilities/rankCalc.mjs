// Licensed under GPL v3 - Check Repository Root for full License notice.
// osu!Hikaru, a fully independent osu!Lazer Private Server backend.
// Copyright (C) 2021 Hikaru Team <copyright@hikaru.pw>

export default async (pool) => {
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
      return;
    })
    .catch((err) => {
      console.log(err);
      conn.close();
      return;
    });
};
