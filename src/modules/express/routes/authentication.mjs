// Licensed under GPL v3 - Check Repository Root for full License notice.
// osu!Hikaru, a fully independent osu!Lazer Private Server backend.
// Copyright (C) 2023 Hikaru Team <copyright@hikaru.pw>

const logger = global.logger;
const resolver = global.resolver;
const database = global.database;

export default (expressInstance) => {
  logger.info("express-routes", "Loading Authentication routes...");

  expressInstance.post("/oauth/token", async (req, res) => {
    const endpoint = await resolver.resolveDict("api.client.oauth.token");
    const pool = database.getPool();
    endpoint(pool, req, res);
  });

  logger.info("express-routes", "Loaded Authentication routes!");
};
