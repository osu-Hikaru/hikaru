// Licensed under GPL v3 - Check Repository Root for full License notice.
// osu!Hikaru, a fully independent osu!Lazer Private Server backend.
// Copyright (C) 2021 Hikaru Team <copyright@hikaru.pw>

import * as modules from "../index.mjs";

export default async (pool, req, res) => {
  try {
    let params = "";
    let i = 0;

    Object.keys(req.query).forEach((qparam) => {
      params += `${qparam}=${req.query[qparam]}&`;
      i++;
    });

    async function returnMaps() {
      if ((i = Object.keys(req.query).length)) {
        console.log(`Finished loop. Params: ${params}`);
        await modules
          .oapiBeatmapSearch(params)
          .then((apiRes) => {
            console.log(apiRes.data.beatmapsets);
            res.status(200);
            res.json(apiRes.data);
          })
      } else {
        setTimeout(returnMaps, 500);
      }
    }

    returnMaps();
  } catch (e) {
    console.log(e)
    res.status(500)
    res.json("Internal Server Error.");

  }

};
