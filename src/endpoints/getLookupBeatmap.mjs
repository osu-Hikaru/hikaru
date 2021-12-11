// Licensed under GPL v3 - Check Repository Root for full License notice.
// osu!Hikaru, a fully independent osu!Lazer Private Server backend.
// Copyright (C) 2021 Hikaru Team <copyright@hikaru.pw>

import * as modules from "../index.mjs";

export default async (pool, req, res) => {
  const conn = await pool.getConnection();

  let map = await conn
    .query(`SELECT * FROM beatmaps WHERE id = ? AND checksum = ? LIMIT 1`, [
      req.query.id,
      req.query.checksum,
    ])
    .catch((err) => {
      console.log(err);
      res.status(500);
      res.send();
      conn.close();
      return;
    });

  if (map[0] === undefined) {
    map[0] = {};
    map[0].status = 0;
  }

  if ((map[0].id !== undefined && map[0].status === 1) || map[0].status === 2) {
    res.status(200);
    res.json({
      accuracy: Number(map[0].accuracy),
      ar: Number(map[0].ar),
      beatmapset: {
        artist: null,
        artist_unicode: null,
        availability: {
          download_disabled: false,
          more_information: null,
        },
        bpm: 135.98,
        can_be_hyped: false,
        covers: {
          card: null,
          "card@2x": null,
          cover: null,
          "cover@2x": null,
          list: null,
          "list@2x": null,
          slimcover: null,
          "slimcover@2x": null,
        },
        creator: null,
        discussion_enabled: false,
        discussion_locked: false,
        favourite_count: 0,
        has_favourited: false,
        hype: null,
        id: null,
        is_scoreable: true,
        last_updated: null,
        legacy_thread_url: null,
        nominations_summary: {
          current: 0,
          required: 0,
        },
        nsfw: false,
        play_count: null,
        preview_url: null,
        ranked: 1,
        ranked_date: null,
        ratings: [],
        source: null,
        status: "ranked",
        storyboard: true,
        submitted_date: null,
        tags: null,
        title: null,
        title_unicode: null,
        track_id: null,
        user_id: null,
        video: false,
      },
      beatmapset_id: Number(map[0].beatmapset_id),
      bpm: Number(map[0].bpm),
      checksum: String(map[0].checksum),
      convert: Boolean(map[0].is_convert.readInt8()),
      count_circles: Number(map[0].count_circles),
      count_sliders: Number(map[0].count_sliders),
      count_spinners: Number(map[0].count_spinners),
      cs: Number(map[0].cs),
      deleted_at: String(map[0].deleted_at),
      difficulty_rating: Number(map[0].difficulty_rating),
      drain: Number(map[0].drain),
      failtimes: {
        exit: [],
        fail: [],
      },
      hit_length: Number(map[0].hit_length),
      id: Number(map[0].id),
      is_scoreable: Boolean(map[0].convert.readInt8()),
      last_updated: new Date(map[0].last_updated).toISOString(),
      max_combo: Number(map[0].max_combo),
      mode: String(map[0].mode),
      mode_int: Number(map[0].mode_int),
      passcount: Number(map[0].passcount),
      playcount: Number(map[0].playcount),
      ranked: Number(map[0].ranked),
      status: String(map[0].status),
      total_length: Number(map[0].total_length),
      url: String(map[0].url),
      user_id: Number(map[0].user_id),
      version: String(map[0].version),
    });
    conn.close();
  } else {
    const beatmap = await modules.oapiGetBeatmap(
      req.query.id,
      req.query.checksum
    );

    await conn
      .query(
        `REPLACE INTO beatmaps (accuracy, ar, beatmapset_id, bpm, checksum, is_convert, count_circles, count_sliders, count_spinners, cs, deleted_at, difficulty_rating, drain, hit_length, id, is_scoreable, last_updated, max_combo, mode, mode_int, passcount, playcount, ranked, status, total_length, url, user_id, version) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          Number(beatmap.data.accuracy),
          Number(beatmap.data.ar),
          Number(beatmap.data.beatmapset_id),
          Number(beatmap.data.bpm),
          String(beatmap.data.checksum),
          Boolean(beatmap.data.convert),
          Number(beatmap.data.count_circles),
          Number(beatmap.data.count_sliders),
          Number(beatmap.data.count_spinners),
          Number(beatmap.data.cs),
          beatmap.data.deleted_at,
          Number(beatmap.data.difficulty_rating),
          Number(beatmap.data.drain),
          Number(beatmap.data.hit_length),
          Number(beatmap.data.id),
          Boolean(beatmap.data.is_scoreable),
          new Date(beatmap.data.last_updated),
          Number(beatmap.data.max_combo),
          String(beatmap.data.mode),
          Number(beatmap.data.mode_int),
          Number(beatmap.data.passcount),
          Number(beatmap.data.playcount),
          Number(beatmap.data.ranked),
          String(beatmap.data.status),
          Number(beatmap.data.total_length),
          String(beatmap.data.url),
          Number(beatmap.data.user_id),
          String(beatmap.data.version),
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
    res.json({
      accuracy: Number(beatmap.data.accuracy),
      ar: Number(beatmap.data.ar),
      beatmapset: {
        artist: null,
        artist_unicode: null,
        availability: {
          download_disabled: false,
          more_information: null,
        },
        bpm: 135.98,
        can_be_hyped: false,
        covers: {
          card: null,
          "card@2x": null,
          cover: null,
          "cover@2x": null,
          list: null,
          "list@2x": null,
          slimcover: null,
          "slimcover@2x": null,
        },
        creator: null,
        discussion_enabled: false,
        discussion_locked: false,
        favourite_count: 0,
        has_favourited: false,
        hype: null,
        id: null,
        is_scoreable: true,
        last_updated: null,
        legacy_thread_url: null,
        nominations_summary: {
          current: 0,
          required: 0,
        },
        nsfw: false,
        play_count: null,
        preview_url: null,
        ranked: 1,
        ranked_date: null,
        ratings: [],
        source: null,
        status: "ranked",
        storyboard: true,
        submitted_date: null,
        tags: null,
        title: null,
        title_unicode: null,
        track_id: null,
        user_id: null,
        video: false,
      },
      beatmapset_id: Number(beatmap.data.beatmapset_id),
      bpm: Number(beatmap.data.bpm),
      checksum: String(beatmap.data.checksum),
      convert: Boolean(beatmap.data.convert),
      count_circles: Number(beatmap.data.count_circles),
      count_sliders: Number(beatmap.data.count_sliders),
      count_spinners: Number(beatmap.data.count_spinners),
      cs: Number(beatmap.data.cs),
      deleted_at: String(beatmap.data.deleted_at),
      difficulty_rating: Number(beatmap.data.difficulty_rating),
      drain: Number(beatmap.data.drain),
      failtimes: {
        exit: [],
        fail: [],
      },
      hit_length: Number(beatmap.data.hit_length),
      id: Number(beatmap.data.id),
      is_scoreable: Boolean(beatmap.data.convert),
      last_updated: String(beatmap.data.last_updated),
      max_combo: Number(beatmap.data.max_combo),
      mode: String(beatmap.data.mode),
      mode_int: Number(beatmap.data.mode_int),
      passcount: Number(beatmap.data.passcount),
      playcount: Number(beatmap.data.playcount),
      ranked: Number(beatmap.data.ranked),
      status: String(beatmap.data.status),
      total_length: Number(beatmap.data.total_length),
      url: String(beatmap.data.url),
      user_id: Number(beatmap.data.user_id),
      version: String(beatmap.data.version),
    });
  }
};
