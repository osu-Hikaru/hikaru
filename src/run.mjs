// Licensed under GPL v3 - Check Repository Root for full License notice.
// osu!Hikaru, a fully independent osu!Lazer Private Server backend.
// Copyright (C) 2023 Hikaru Team <copyright@hikaru.pw>

// Create Runtime

export const runtime = Date.now();

// Create the advanced resolver system

import { default as resolverInstance } from "./resolver/main.mjs";

export const resolver = new resolverInstance();
global.resolver = resolver;

// Create Logger Instance

const loggingInstance = await resolver.resolveDict(
  "modules.winston.class.loggingInstance"
);

export const logger = new loggingInstance();
global.logger = logger;

// Create Config Instance

const configInstance = await resolver.resolveDict(
  "modules.dotenv.class.configInstance"
);

export const config = new configInstance();

config.load();

// Create Database Instance

const databaseInstance = await resolver.resolveDict(
  "modules.mariadb.class.databaseInstance"
);

export const database = new databaseInstance();

// Create Express Instance
const apiInstance = await resolver.resolveDict(
  "modules.express.class.apiInstance"
);

export const api = new apiInstance();
