// Licensed under GPL v3 - Check Repository Root for full License notice.
// osu!Hikaru, a fully independent osu!Lazer Private Server backend.
// Copyright (C) 2021 Hikaru Team <copyright@hikaru.pw>

import * as modules from "../index.mjs";
import fs from "fs";

export default async (pool, req, res) => {
  const url = req.originalUrl.split("/");

  await modules.oapiDownloadBeatmap(url[3]).then(async (apiRes) => {
    res.removeHeader("X-Powered-By");

    res.header({
      Date: new Date(),
      "Content-Type": apiRes.CT,
      "Content-Length": apiRes.CL,
      "Last-Modified": apiRes.LM,
      Connection: "keep-alive",
      "Content-Disposition": apiRes.CD,
      ETag: apiRes.ET,
      "Accept-Ranges": "bytes",
    });

    res.status(200);
    fs.createReadStream(apiRes.path).pipe(res);
  });
};
