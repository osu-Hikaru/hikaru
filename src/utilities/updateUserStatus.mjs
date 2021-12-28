// Licensed under GPL v3 - Check Repository Root for full License notice.
// osu!Hikaru, a fully independent osu!Lazer Private Server backend.
// Copyright (C) 2021 Hikaru Team <copyright@hikaru.pw>

export default async (pool, config) => {
  console.log("Running updateUserStatus");
  const conn = await pool.getConnection();

  await conn.query(`SELECT * FROM users`).then((dbRes) => {
    dbRes.forEach(async (user) => {
      if (
        new Date(user.last_visit) < Date.now() - 1000 * 60 * 5 &&
        user.id !== config.umineko.user_id
      ) {
        await conn.query(`UPDATE users SET is_online = 0 WHERE id = ?`, [
          user.id,
        ]);
      }
    });
    conn.end();
  });
};
