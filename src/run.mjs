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

logger.notice("logger", "Hello World!");

// Create Config Instance

const configInstance = await resolver.resolveDict(
  "modules.dotenv.class.configInstance"
);

export const config = new configInstance();

config.load();
