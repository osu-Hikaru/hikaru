// Licensed under GPL v3 - Check Repository Root for full License notice.
// osu!Hikaru, a fully independent osu!Lazer Private Server backend.
// Copyright (C) 2021 Hikaru Team <copyright@hikaru.pw>

import axios from "axios";
import FormData from "form-data";
import fs from "fs";

export default () => {
  return new Promise(async (resolve, reject) => {
    let config = JSON.parse(
      await fs.readFileSync("./src/config.json", "utf-8", () => {})
    );
    const data = new FormData();

    data.append("client_id", config.osu.client_id);
    data.append("client_secret", config.osu.client_secret);
    data.append("scope", "public");
    data.append("grant_type", "client_credentials");

    axios({
      method: "post",
      url: "https://osu.ppy.sh/oauth/token",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...data.getHeaders(),
      },
      data: data,
    })
      .then(async (res) => {
        config.osu.bearer = res.data.access_token;
        config.osu.expires_in = res.data.expires_in;
        config.osu.date_created = Date.now();
        await fs.writeFile("./src/config.json", JSON.stringify(config), () => {
          resolve(res);
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
};
