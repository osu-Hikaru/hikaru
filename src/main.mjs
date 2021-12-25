// Licensed under GPL v3 - Check Repository Root for full License notice.
// osu!Hikaru, a fully independent osu!Lazer Private Server backend.
// Copyright (C) 2021 Hikaru Team <copyright@hikaru.pw>

import express from "express";
import morgan from "morgan";
import multer from "multer";
import mariadb from "mariadb";
import compression from "compression";
import fs from "fs";
import * as modules from "./index.mjs";
import * as bodyparser from "body-parser";

const api = express();
const upload = multer();

const config = JSON.parse(
  await fs.readFileSync("./src/config.json", "utf-8", () => {})
);

const pool = mariadb.createPool({
  host: config.mariadb.host,
  user: config.mariadb.user,
  password: config.mariadb.password,
  database: config.mariadb.database,
  connectionLimit: config.mariadb.connectionLimit,
});

setInterval(function () {
  modules.updateUserStatus(pool);
}, 1000 * 60 * 5);

setInterval(function () {
  modules.logMariadbStats(pool);
}, 1000 * 60 * 2);

setInterval(function () {
  modules.rankCalc(pool);
}, 1000 * 60 * 1);

setInterval(function () {
  modules.checkActiveTokens(pool);
}, 1000 * 60 * 60);

function main() {
  api.use(morgan("dev"));
  api.use(bodyparser.default.json());
  api.use(bodyparser.default.urlencoded({ extended: true }));
  api.use(compression());

  api.post("/", upload.none(), async (req, res) => {
    modules.postUsers(pool, req, res);
  });

  api.post("/token", upload.none(), async (req, res) => {
    modules.oauth(pool, req, res);
  });

  api.get("/v2/me", async (req, res) => {
    modules.getMe(pool, req, res);
  });

  api.all("*", async (req, res, next) => {
    modules.allRoutes(pool, req, res, next);
  });

  api.get("/v2/users/*/*", async (req, res) => {
    modules.getUsers(pool, req, res);
  });

  api.get("/v2/chat/updates", async (req, res) => {
    modules.getChatUpdates(pool, req, res);
  });

  api.get("/v2/chat/channels", async (req, res) => {
    modules.getChannels(pool, req, res);
  });

  api.get("/v2/friends", (req, res) => {
    modules.getFriends(pool, req, res);
  });

  api.get("/v2/seasonal-backgrounds", (req, res) => {
    modules.getSeasonals(pool, req, res);
  });

  api.put("/v2/chat/channels/*/users/*", async (req, res) => {
    modules.putChannelUsers(pool, req, res);
  });

  api.put("/v2/chat/channels/*/mark-as-read/*", async (req, res) => {
    modules.putChannelMAS(pool, req, res);
  });

  api.delete("/v2/chat/channels/*/users/*", async (req, res) => {
    modules.delChannelUsers(pool, req, res);
  });

  api.get("/v2/chat/channels/*/messages", (req, res) => {
    modules.getMessages(pool, req, res);
  });

  api.post("/v2/chat/channels", upload.none(), async (req, res) => {
    modules.postChannels(pool, req, res);
  });

  api.post("/v2/chat/channels/*/messages", upload.none(), async (req, res) => {
    modules.postChannelMessages(pool, req, res);
  });

  api.put("/v2/beatmaps/*/solo/scores/*", async (req, res) => {
    modules.putBeatmapScores(pool, req, res);
  });

  api.get("/v2/beatmaps/*/scores", (req, res) => {
    modules.getBeatmapScores(pool, req, res);
  });

  api.get("/v2/beatmaps/lookup", (req, res) => {
    modules.getLookupBeatmap(pool, req, res);
  });

  api.post("/v2/beatmaps/*/solo/scores", upload.none(), async (req, res) => {
    modules.postBeatmapScores(pool, req, res);
  });

  api.get("/v2/news", async (req, res) => {
    modules.getNews(pool, req, res);
  });

  api.get("/v2/beatmapsets/*/download", async (req, res) => {
    modules.getDownloadBeatmap(pool, req, res);
  });

  api.get("/v2/beatmapsets/*", async (req, res) => {
    modules.getBeatmapsets(pool, req, res);
  });

  api.get("/v2/beatmapsets/search", async (req, res) => {
    modules.getBeatmapSearch(pool, req, res);
  });

  api.all("*", (req, res) => {
    res.status(404);
    res.json({ message: "Not found." });
  });

  api.listen(config.express.port, () => {
    console.log(`Server running on port ${config.express.port}`);
  });
}
main();
