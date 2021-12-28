// Licensed under GPL v3 - Check Repository Root for full License notice.
// osu!Hikaru, a fully independent osu!Lazer Private Server backend.
// Copyright (C) 2021 Hikaru Team <copyright@hikaru.pw>

// Umineko is the server's bot account. It does not require authorization due to direct chat access.

import * as modules from "../index.mjs";

export default async (pool, config) => {
  const conn = await pool.getConnection();

  try {
    const user = await conn.query(`SELECT * FROM users WHERE id = ? LIMIT 1`, [
      config.umineko.user_id,
    ]);

    if (user[0] === undefined) {
      console.log("Umineko: Failed to initialize: User not found.");
    } else {
      const channels = await conn.query(`SELECT * FROM channels`);

      console.log(
        "Umineko: Successfully Initialized! Starting to listen for messages..."
      );

      modules.umiMessageListener(conn, channels, user, config, true);
    }
  } catch (e) {
    console.log("Umineko: Failed to initialize!");
    console.log(e);
  }
};
