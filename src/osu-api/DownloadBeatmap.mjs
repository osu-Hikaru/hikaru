// Licensed under GPL v3 - Check Repository Root for full License notice.
// osu!Hikaru, a fully independent osu!Lazer Private Server backend.
// Copyright (C) 2021 Hikaru Team <copyright@hikaru.pw>

import axios from "axios";
import fs from "fs";
import jsftp from "jsftp";
import * as modules from "../index.mjs";

export default (id, pool) => {
  return new Promise(async (resolve, reject) => {
    const conn = await pool.getConnection();

    console.log(`Beatmap download for map ${id} requested.`);

    let mirror_map = undefined;
    let config = JSON.parse(
      await fs.readFileSync("./src/config.json", "utf-8", () => {})
    );

    if (
      Number(Date.now()) >
      Number(config.lazer.date_created) + Number(config.lazer.expires_in)
    ) {
      await modules.oapiLazerAuthorization();
    }

    if (config.mirror.mirror_enabled === true) {
      await conn
        .query(`SELECT * FROM mirror WHERE id = ? LIMIT 1`, [id])
        .then((apiResMirror) => {
          mirror_map = apiResMirror[0];
        });
    }

    if (mirror_map !== undefined) {
      console.log(
        "Beatmap download FOUND in mirror database! Using mirror as download source..."
      );

      axios({
        method: "get",
        responseType: "stream",
        url: `https://${config.mirror.mirror_url}/s/${id}.osz`,
        headers: {},
      })
        .then(async (mirrorRes) => {
          const writer = fs.createWriteStream(
            process.cwd() + `/temp/${id}.osz`
          );
          mirrorRes.data.pipe(writer);
          writer.on("finish", async () => {
            console.log("Mirror download successful!");

            resolve({
              path: process.cwd() + `/temp/${id}.osz`,
              CT: mirror_map.CT,
              CL: mirror_map.CL,
              LM: mirror_map.LM,
              CD: mirror_map.CD,
              ET: mirror_map.ETag,
            });
            conn.close();
          });
        })
        .catch((err) => {
          console.log("Beatmap download from mirror failed!");
          conn.close();
          reject(err);
        });
    } else {
      console.log(
        "Beatmap download NOT FOUND in mirror database! Fetching from osu!Api..."
      );

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
          const writer = fs.createWriteStream(
            process.cwd() + `/temp/${id}.osz`
          );
          apiRes.data.pipe(writer);

          writer.on("finish", async () => {
            if (config.mirror.ftp_enabled === true) {
              conn
                .query(
                  `INSERT INTO mirror (id, LM, CD, CL, CT, ETag) VALUES (?,?,?,?,?,?)`,
                  [
                    Number(id),
                    new Date(apiRes.headers["last-modified"])
                      .toISOString()
                      .slice(0, 19)
                      .replace("T", " "),
                    String(apiRes.headers["content-disposition"]),
                    Number(apiRes.headers["content-length"]),
                    String(apiRes.headers["content-type"]),
                    String(apiRes.headers["etag"]),
                  ]
                )
                .then(() => {
                  conn.close();
                  console.log("DB Insert succeeded! Transferring...");
                })
                .catch((err) => {
                  conn.close();
                  console.log("DB Insert Failed! Cancelling...");
                  console.log(err);
                });

              const Ftp = new jsftp({
                host: config.mirror.host,
                port: config.mirror.port,
                user: config.mirror.user,
                pass: config.mirror.pass,
              });

              modules.ftpUpload(
                Ftp,
                process.cwd() + `/temp/${id}.osz`,
                `/${config.mirror.mirror_url}/s/${id}.osz`
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
    }
  });
};