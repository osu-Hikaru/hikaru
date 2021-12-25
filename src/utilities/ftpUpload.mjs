// Licensed under GPL v3 - Check Repository Root for full License notice.
// osu!Hikaru, a fully independent osu!Lazer Private Server backend.
// Copyright (C) 2021 Hikaru Team <copyright@hikaru.pw>

import fs from "fs";

export default async (Ftp, path, remote) => {
  fs.readFile(path, (err, data) => {
    Ftp.put(data, remote, (err) => {
      if (!err) {
        console.log("File transferred successfully!");
      }
    });
  });
};
