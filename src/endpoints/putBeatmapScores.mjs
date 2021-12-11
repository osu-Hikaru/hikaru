// Licensed under GPL v3 - Check Repository Root for full License notice.
// osu!Hikaru, a fully independent osu!Lazer Private Server backend.
// Copyright (C) 2021 Hikaru Team <copyright@hikaru.pw>

export default async (pool, req, res) => {
  const conn = await pool.getConnection();
  const url = req.originalUrl.split("/");

  const dbResToken = await conn
    .query(`SELECT id FROM active_tokens WHERE access_token = ?`, [
      req.headers.authorization.split(" ")[1],
    ])
    .catch((err) => {
      console.log(err);
      res.status(500);
      res.send();
      conn.close();
      return;
    });

  if (req.body.user.id === dbResToken[0].id) {
    await conn
      .query(
        `SELECT active_id, active_bm_id, current_ruleset FROM users WHERE id = ? LIMIT 1`,
        [req.body.user.id]
      )
      .then(async (verify) => {
        if (
          Number(verify[0].active_id) !== Number(url[7]) ||
          Number(verify[0].active_bm_id) !== Number(url[4]) ||
          Number(verify[0].current_ruleset) !== Number(req.body.ruleset_id)
        ) {
          res.status(500);
          res.send();
          conn.close();
          return;
        } else {
          const playdate = new Date();

          const score = await conn
            .query(
              `INSERT INTO scores (user_id, beatmap_id, ruleset_id, passed, count_miss, count_meh, count_ok, count_good, count_great, perfect, count_STM, count_STH, count_LTM, count_LTH, count_SB, count_LB, rank, total_score, pp, max_combo, accuracy, date) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
              [
                Number(req.body.user.id),
                Number(url[4]),
                Number(req.body.ruleset_id),
                Boolean(req.body.passed),
                Number(req.body.statistics.Miss),
                Number(req.body.statistics.Meh),
                Number(req.body.statistics.Ok),
                Number(req.body.statistics.Good),
                Number(req.body.statistics.Great),
                Number(req.body.statistics.Perfect),
                Number(req.body.statistics.SmallTickMiss),
                Number(req.body.statistics.SmallTickHit),
                Number(req.body.statistics.LargeTickMiss),
                Number(req.body.statistics.LargeTickHit),
                Number(req.body.statistics.SmallBonus),
                Number(req.body.statistics.LargeBonus),
                String(req.body.rank),
                Number(req.body.total_score),
                null,
                Number(req.body.max_combo),
                Number(req.body.accuracy),
                playdate,
              ]
            )
            .catch((err) => {
              console.log(err);
              res.status(500);
              res.send();
              conn.close();
              return;
            });

          const score_id = await conn.query(
            `SELECT score_id FROM scores WHERE user_id = ? AND date = ? LIMIT 1`,
            [req.body.user.id, playdate]
          );

          const user = await conn
            .query(`SELECT * FROM users WHERE id = ? LIMIT 1`, [
              req.body.user.id,
            ])
            .catch((err) => {
              console.log(err);
              res.status(500);
              res.send();
              conn.close();
              return;
            });

          await conn
            .query(
              `UPDATE users SET total_score = ?, playcount = ? WHERE id = ?`,
              [
                Number(user[0].total_score) + Number(req.body.total_score),
                Number(user[0].playcount + 1),
                Number(req.body.user.id),
              ]
            )
            .catch((err) => {
              console.log(err);
              res.status(500);
              res.send();
              conn.close();
              return;
            });

          conn.close();
          res.status(200);
          res.send({
            accuracy: Number(req.body.accuracy),
            beatmap_id: Number(url[4]),
            build_id: 6100,
            ended_at: new Date(Date.now()).toISOString(),
            id: Number(score_id),
            max_combo: Number(req.body.max_combo),
            mods: [],
            passed: Boolean(req.body.passed),
            rank: String(req.body.rank),
            ruleset_id: Number(req.body.ruleset_id),
            started_at: new Date(user[0].play_start).toISOString(),
            statistics: {
              Good: Number(req.body.statistics.Good),
              Great: Number(req.body.statistics.Great),
              LargeBonus: Number(req.body.statistics.LargeBonus),
              LargeTickHit: Number(req.body.statistics.LargeTickHit),
              LargeTickMiss: Number(req.body.statistics.LargeTickMiss),
              Meh: Number(req.body.statistics.Meh),
              Miss: Number(req.body.statistics.Miss),
              Ok: Number(req.body.statistics.Ok),
              Perfect: Number(req.body.statistics.Perfect),
              SmallBonus: Number(req.body.statistics.SmallBonus),
              SmallTickHit: Number(req.body.statistics.SmallTickHit),
              SmallTickMiss: Number(req.body.statistics.SmallTickMiss),
            },
            total_score: Number(req.body.total_score),
            user_id: Number(req.body.user.id),
          });
        }
      });
  } else {
    conn.close();
    res.status(400);
    res.json({});
    return;
  }
};
