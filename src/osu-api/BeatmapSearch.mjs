// Licensed under GPL v3 - Check Repository Root for full License notice.
// osu!Hikaru, a fully independent osu!Lazer Private Server backend.
// Copyright (C) 2021 Hikaru Team <copyright@hikaru.pw>

import axios from "axios";
import fs from "fs";

export default async (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let config = JSON.parse(
        await fs.readFileSync("./src/config.json", "utf-8", () => {})
      );

      axios({
        method: "get",
        url: `https://osu.ppy.sh/api/v2/beatmapsets/search?${params.slice(
          0,
          -1
        )}`,
        headers: {
          Authorization: "Bearer " + config.osu.bearer,
        },
      }).then(async (res) => {
        resolve(res);
      });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};
