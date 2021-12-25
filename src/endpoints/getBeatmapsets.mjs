// Licensed under GPL v3 - Check Repository Root for full License notice.
// osu!Hikaru, a fully independent osu!Lazer Private Server backend.
// Copyright (C) 2021 Hikaru Team <copyright@hikaru.pw>

import * as modules from "../index.mjs";

export default async (pool, req, res) => {
  const url = req.originalUrl.split("/");

  await modules.oapiGetBeatmapset(url[3]).then((apiRes) => {
    res.status(200);
    res.json(apiRes.data);
  });

  /*res.status(200);
  res.json({
    artist: "zts",
    artist_unicode: "zts",
    covers: {
      cover:
        "https://assets.ppy.sh/beatmaps/998836/covers/cover.jpg?1622165345",
      "cover@2x":
        "https://assets.ppy.sh/beatmaps/998836/covers/cover@2x.jpg?1622165345",
      card: "https://assets.ppy.sh/beatmaps/998836/covers/card.jpg?1622165345",
      "card@2x":
        "https://assets.ppy.sh/beatmaps/998836/covers/card@2x.jpg?1622165345",
      list: "https://assets.ppy.sh/beatmaps/998836/covers/list.jpg?1622165345",
      "list@2x":
        "https://assets.ppy.sh/beatmaps/998836/covers/list@2x.jpg?1622165345",
      slimcover:
        "https://assets.ppy.sh/beatmaps/998836/covers/slimcover.jpg?1622165345",
      "slimcover@2x":
        "https://assets.ppy.sh/beatmaps/998836/covers/slimcover@2x.jpg?1622165345",
    },
    creator: "Leader",
    favourite_count: 0,
    hype: null,
    id: 998836,
    nsfw: false,
    play_count: 95823,
    preview_url: "//b.ppy.sh/preview/998836.mp3",
    source: "うみねこのなく頃に",
    status: "ranked",
    title: "Umineko no Naku Koro ni Compilation",
    title_unicode: "うみねこのなく頃に Compilation",
    track_id: null,
    user_id: 631530,
    video: false,
    availability: {
      download_disabled: false,
      more_information: null,
    },
    bpm: 135.98,
    can_be_hyped: false,
    discussion_enabled: true,
    discussion_locked: false,
    is_scoreable: true,
    last_updated: "2020-04-02T05:31:25+00:00",
    legacy_thread_url: "https://osu.ppy.sh/community/forums/topics/930770",
    nominations_summary: {
      current: 0,
      required: 2,
    },
    ranked: 1,
    ranked_date: "2020-02-24T00:05:15+00:00",
    storyboard: true,
    submitted_date: "2019-07-06T14:12:39+00:00",
    tags: "rue nemis -kevincela- okoratu okorin mirash tokiko marathon video game instrumental ryushiki07 chiru 07th expansion when they cry visual novel ushiromiya battler eva maria ange beatrice furudo erika goldenslaughterer the executioner liberatedliberator resurrectedreplayer death from stupefaction dreamenddischarger worldenddominator lastendconductor",
    beatmaps: [
      {
        beatmapset_id: 998836,
        difficulty_rating: 5.1,
        id: 2089071,
        mode: "osu",
        status: "ranked",
        total_length: 1768,
        user_id: 631530,
        version: "When They Cry",
        accuracy: 8,
        ar: 9,
        bpm: 141,
        convert: false,
        count_circles: 4135,
        count_sliders: 2210,
        count_spinners: 13,
        cs: 4,
        deleted_at: null,
        drain: 5,
        hit_length: 1666,
        is_scoreable: true,
        last_updated: "2020-04-02T05:31:26+00:00",
        mode_int: 0,
        passcount: 6399,
        playcount: 86445,
        ranked: 1,
        url: "https://osu.ppy.sh/beatmaps/2089071",
        checksum: "de4d9c5b9416aad6ace4c348e09967e6",
        failtimes: {
          fail: [],
          exit: [],
        },
        max_combo: 8966,
      },
    ],
    converts: [],
    description: {
      description: null,
    },
    genre: {
      id: 2,
      name: "Video Game",
    },
    language: {
      id: 5,
      name: "Instrumental",
    },
    ratings: [],
    recent_favourites: [],
    user: {
      avatar_url: "https://a.ppy.sh/631530?1638398165.jpeg",
      country_code: "IT",
      default_group: "alumni",
      id: 631530,
      is_active: true,
      is_bot: false,
      is_deleted: false,
      is_online: false,
      is_supporter: false,
      last_visit: "2021-12-22T17:28:28+00:00",
      pm_friends_only: false,
      profile_colour: "#888888",
      username: "Leader",
    },
  });*/
};
