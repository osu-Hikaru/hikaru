// Licensed under GPL v3 - Check Repository Root for full License notice.
// osu!Hikaru, a fully independent osu!Lazer Private Server backend.
// Copyright (C) 2021 Hikaru Team <copyright@hikaru.pw>

import axios from "axios";
import fs from "fs";
import jsftp from "jsftp";
import * as modules from "../index.mjs";

export default (id) => {
  return new Promise(async (resolve, reject) => {
    let config = JSON.parse(
      await fs.readFileSync("./src/config.json", "utf-8", () => {})
    );

    if (
      Number(Date.now()) >
      Number(config.lazer.date_created) + Number(config.lazer.expires_in)
    ) {
      await modules.oapiLazerAuthorization();
    }

    axios({
      method: "get",
      responseType: "stream",
      url: `https://osu.ppy.sh/api/v2/beatmapsets/${id}/download`,
      headers: {
        Accept: "application/json",
        "User-Agent": "osu-framework",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json",
        Authorization: "Bearer " + config.lazer.bearer,
      },
    })
      .then(async (apiRes) => {
        const writer = fs.createWriteStream(process.cwd() + `/temp/${id}.osz`);
        apiRes.data.pipe(writer);

        writer.on("finish", () => {
          if (config.mirror.ftp_enabled === true) {
            const Ftp = new jsftp({
              host: config.mirror.host,
              port: config.mirror.port,
              user: config.mirror.user,
              pass: config.mirror.pass,
            });

            modules.ftpUpload(
              Ftp,
              process.cwd() + `/temp/${id}.osz`,
              `/www.pekkie.cloud/s/${id}.osz`
            );
          }

          resolve({
            path: process.cwd() + `/temp/${id}.osz`,
            CT: apiRes.headers["content-type"],
            CL: apiRes.headers["content-length"],
            LM: apiRes.headers["last-modified"],
            CD: apiRes.headers["content-disposition"],
            ET: apiRes.headers["etag"],
          });
        });
      })
      .catch(async (error) => {
        if (error.status === 401) {
          await modules.oapiLazerAuthorization();
          resolve(await modules.oapiDownloadBeatmap(id));
        } else {
          reject(error);
        }
      });
  });
};
