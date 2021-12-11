// Licensed under GPL v3 - Check Repository Root for full License notice.
// osu!Hikaru, a fully independent osu!Lazer Private Server backend.
// Copyright (C) 2021 Hikaru Team <copyright@hikaru.pw>

import * as modules from "../index.mjs";

export default async (pool, req, res) => {
  const beatmap = await modules.oapiGetBeatmap(
    req.query.id,
    req.query.checksum
  );

  res.status(200);
  res.json(beatmap.data);
};
