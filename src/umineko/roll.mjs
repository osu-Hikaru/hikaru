// Licensed under GPL v3 - Check Repository Root for full License notice.
// osu!Hikaru, a fully independent osu!Lazer Private Server backend.
// Copyright (C) 2021 Hikaru Team <copyright@hikaru.pw>

// Umineko is the server's bot account. It does not require authorization due to direct chat access.

import * as modules from "../index.mjs";

export default async (conn, message, config) => {
  try {
    let content = message.message_content.split(" ");

    if (isNaN(content[1]) || content[1] === undefined) {
      content[1] = 100;
    }

    await conn.query(
      `INSERT INTO messages (channel_id, user_id, timestamp, message_content, is_action) VALUES (?, ${Number(
        config.umineko.user_id
      )}, ?, ?, 1)`,
      [message.channel_id, new Date(), await modules.genNumber(0, content[1])]
    );

    console.log("Umineko: OK! Command: !roll");
  } catch (e) {
    console.log("Failed to initialize Umineko!");
    console.log(e);
  }
};
