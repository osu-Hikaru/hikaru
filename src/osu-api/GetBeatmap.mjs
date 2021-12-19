// Licensed under GPL v3 - Check Repository Root for full License notice.
// osu!Hikaru, a fully independent osu!Lazer Private Server backend.
// Copyright (C) 2021 Hikaru Team <copyright@hikaru.pw>

import axios from "axios";
import fs from "fs";
import * as modules from "../index.mjs";

export default async (id, checksum) => {
  return new Promise(async (resolve, reject) => {
    let config = JSON.parse(
      await fs.readFileSync("./src/config.json", "utf-8", () => {})
    );

    if (
      Number(Date.now()) >
      Number(config.osu.date_created) + Number(config.osu.expires_in)
    ) {
      await modules.oapiAuthorization();
    }

    axios({
      method: "get",
      url: `https://osu.ppy.sh/api/v2/beatmaps/lookup?id=${id}&checksum=${checksum}`,
      headers: {
        Authorization: "Bearer " + config.osu.bearer,
      },
    })
      .then(async (res) => {
        resolve(res);
      })
      .catch(async (error) => {
        if (error.status === 401) {
          await modules.oapiAuthorization();
          resolve(await modules.oapiGetBeatmap(id, checksum));
        } else {
          reject(error);
        }
      });
  });
};
