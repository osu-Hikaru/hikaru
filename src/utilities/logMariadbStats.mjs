// Licensed under GPL v3 - Check Repository Root for full License notice.
// osu!Hikaru, a fully independent osu!Lazer Private Server backend.
// Copyright (C) 2021 Hikaru Team <copyright@hikaru.pw>

export default async (pool) => {
  const conn = await pool.getConnection();

  console.log({
    "MariaDB Version": conn.serverVersion(),
    "Total Connections": pool.totalConnections(),
    "Active Connections": pool.activeConnections(),
    "Idle Connections": pool.idleConnections(),
    "Task Query Size": pool.taskQueueSize(),
  });

  conn.end();
};
