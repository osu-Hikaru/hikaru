// Licensed under GPL v3 - Check Repository Root for full License notice.
// osu!Hikaru, a fully independent osu!Lazer Private Server backend.
// Copyright (C) 2021 Hikaru Team <copyright@hikaru.pw>

import * as modules from "../index.mjs";

export default async (conn, message, config, uptime) => {
  try {
    await conn.query(
      `INSERT INTO messages (channel_id, user_id, timestamp, message_content, is_action) VALUES (?, ${Number(
        config.umineko.user_id
      )}, ?, ?, 1)`,
      [
        message.channel_id,
        new Date(),
        `Server Uptime: ${Number((Date.now() - uptime) / 1000 / 60).toFixed(
          1
        )} minutes!`,
      ]
    );

    console.log(`Umineko: OK! Command: ${config.umineko.prefix}uptime`);
  } catch (e) {
    console.log(`Umineko: FAILURE! Command: ${config.umineko.prefix}uptime`);
    console.log(e);
  }
};
