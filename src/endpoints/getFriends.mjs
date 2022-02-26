// Licensed under GPL v3 - Check Repository Root for full License notice.
// osu!Hikaru, a fully independent osu!Lazer Private Server backend.
// Copyright (C) 2021 Hikaru Team <copyright@hikaru.pw>

export default async (pool, req, res) => {
  const conn = await pool.getConnection();
  let friends_arr = [];
  let i = 0

  try {
    let user = await conn.query(
      "SELECT * FROM active_tokens WHERE access_token = ? LIMIT 1",
      [String(req.headers.authorization.split(" ")[1])]
    );
    let friends = await conn.query("SELECT * FROM friends WHERE user_id = ?", [
      Number(user[0].id),
    ]);



    friends.forEach(async (friend) => {
      let friend_user = await conn.query(
        "SELECT * FROM users WHERE user_id = ? LIMIT 1",
        [Number(friend.friend_id)]
      );

      friends_arr.push({
        avatar_url: String(friend_user[0].avatar_url),
        country_code: String(friend_user[0].country_code),
        default_group: "default",
        id: Number(friend_user[0].user_id),
        is_active: Boolean(friend_user[0].is_active),
        is_bot: Boolean(friend_user[0].is_bot),
        is_deleted: Boolean(friend_user[0].is_deleted),
        is_online: Boolean(friend_user[0].is_online),
        is_supporter: Boolean(friend_user[0].is_supporter),
        last_visit: String(new Date(friend_user[0].last_visit).toISOString()),
        pm_friends_only: false,
        profile_colour: null,
        username: String(friend_user[0].username),
        cover: {
          custom_url: null,
          url: "https://a.hikaru.pw/1/default_cv.jpg",
          id: "4",
        },
        groups: [],
        statistics: {
          level: {
            current: 1,
            progress: 0,
          },
          global_rank: Number(friend_user[0].global_rank),
          pp: Number(friend_user[0].pp),
          ranked_score: 0,
          hit_accuracy: 0,
          play_count: Number(friend_user[0].playcount),
          play_time: Number(friend_user[0].play_time),
          total_score: Number(friend_user[0].total_score),
          total_hits: Number(friend_user[0].total_hits),
          maximum_combo: 0,
          replays_watched_by_others: 0,
          is_ranked: false,
          grade_counts: {
            ss: 0,
            ssh: 0,
            s: 0,
            sh: 0,
            a: 0,
          },
          rank: {
            country: null,
          },
        },
        support_level: 0,
      });

      i++
    });

    function sendResult() {
      if(i === friends.length) {
        res.status(200);
        res.json(friends_arr);
      } else {
        setTimeout(sendResult, 1000)
      }
    }
    sendResult()

  } catch (e) {
    res.status(500);
    res.json({});
    console.log(e);
  }
};
