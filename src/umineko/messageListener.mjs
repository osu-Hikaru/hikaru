// Licensed under GPL v3 - Check Repository Root for full License notice.
// osu!Hikaru, a fully independent osu!Lazer Private Server backend.
// Copyright (C) 2021 Hikaru Team <copyright@hikaru.pw>

import * as modules from "../index.mjs";
import fs from "fs";

const uptime = Date.now();

export default async (conn, channels, user, catchup) => {
  try {
    let config = JSON.parse(
      await fs.readFileSync("./src/config.json", "utf-8", () => {})
    );

    if (catchup === true) {
      let i = 0;

      console.log("Umineko: Message listener starting offline catchup...");

      const messages = await conn.query(
        `SELECT * FROM messages WHERE message_id > ?`,
        [config.umineko.last_read]
      );

      messages.forEach((message) => {
        config.umineko.last_read = config.umineko.last_read + 1;

        if (message.user_id !== config.umineko.user_id) {
          const content = message.message_content.split(" ");

          switch (content[0]) {
            case `${config.umineko.prefix}roll`:
              modules.umiRoll(conn, message, config);
              break;
            case `${config.umineko.prefix}uptime`:
              modules.umiUptime(conn, message, config, uptime);
              break;
            default:
              break;
          }
        }

        i++;
      });

      async function waitForFinish() {
        if (i === messages.length) {
          console.log(
            `Umineko: Caught up ${messages.length} messages! Now running every ${config.umineko.listen_interval} seconds!`
          );

          await fs.writeFile(
            "./src/config.json",
            JSON.stringify(config),
            () => {
              setInterval(function () {
                modules.umiMessageListener(conn, channels, user, config, false);
              }, 1000 * config.umineko.listen_interval);
            }
          );
        } else {
          setTimeout(waitForFinish, 500);
        }
      }
      waitForFinish();
    } else {
      let i = 0;

      const messages = await conn.query(
        `SELECT * FROM messages WHERE message_id > ?`,
        [config.umineko.last_read]
      );

      messages.forEach((message) => {
        config.umineko.last_read = config.umineko.last_read + 1;

        if (message.user_id !== config.umineko.user_id) {
          const content = message.message_content.split(" ");

          switch (content[0]) {
            case `${config.umineko.prefix}roll`:
              modules.umiRoll(conn, message, config);
              break;
            case `${config.umineko.prefix}uptime`:
              modules.umiUptime(conn, message, config, uptime);
              break;
            default:
              break;
          }
        }
        i++;
      });

      async function waitForFinish() {
        if (i === messages.length) {
          await fs.writeFile(
            "./src/config.json",
            JSON.stringify(config),
            () => {}
          );
        } else {
          setTimeout(waitForFinish, 500);
        }
      }
      waitForFinish();
    }
  } catch (e) {
    console.log(e);
  }
};
