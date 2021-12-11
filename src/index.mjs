// Licensed under GPL v3 - Check Repository Root for full License notice.
// osu!Hikaru, a fully independent osu!Lazer Private Server backend.
// Copyright (C) 2021 Hikaru Team <copyright@hikaru.pw>

// Utilities

import genToken from "./utilities/genToken.mjs";
import genNumber from "./utilities/genNumber.mjs";
import updateUserStatus from "./utilities/updateUserStatus.mjs";
import logMariadbStats from "./utilities/logMariadbStats.mjs";
import rankCalc from "./utilities/rankCalc.mjs";
import checkActiveTokens from "./utilities/checkActiveTokens.mjs";

// Endpoints

import postUsers from "./endpoints/postUsers.mjs";
import oauth from "./endpoints/oauth.mjs";
import getUsers from "./endpoints/getUsers.mjs";
import getMe from "./endpoints/getMe.mjs";
import allRoutes from "./endpoints/allRoutes.mjs";
import getUpdates from "./endpoints/getUpdates.mjs";
import getChannels from "./endpoints/getChannels.mjs";
import getFriends from "./endpoints/getFriends.mjs";
import getSeasonals from "./endpoints/getSeasonals.mjs";
import putChannelUsers from "./endpoints/putChannelUsers.mjs";
import putChannelMAS from "./endpoints/putChannelMAS.mjs";
import delChannelUsers from "./endpoints/delChannelUsers.mjs";
import getMessages from "./endpoints/getMessages.mjs";
import postChannels from "./endpoints/postChannels.mjs";
import postChannelMessages from "./endpoints/postChannelMessages.mjs";
import putBeatmapScores from "./endpoints/putBeatmapScores.mjs";
import getBeatmapScores from "./endpoints/getBeatmapScores.mjs";
import postBeatmapScores from "./endpoints/postBeatmapScores.mjs";
import getLookupBeatmap from "./endpoints/getLookupBeatmap.mjs";

// osu!API Routes

import oapiAuthorization from "./osu-api/Authorization.mjs";
import oapiGetBeatmap from "./osu-api/GetBeatmap.mjs";

// Imports

export {
  genToken as genToken,
  genNumber as genNumber,
  updateUserStatus as updateUserStatus,
  logMariadbStats as logMariadbStats,
  rankCalc as rankCalc,
  checkActiveTokens as checkActiveTokens,
  //-------------------------------
  postUsers as postUsers,
  oauth as oauth,
  getUsers as getUsers,
  getMe as getMe,
  allRoutes as allRoutes,
  getUpdates as getUpdates,
  getChannels as getChannels,
  getFriends as getFriends,
  getSeasonals as getSeasonals,
  putChannelUsers as putChannelUsers,
  putChannelMAS as putChannelMAS,
  delChannelUsers as delChannelUsers,
  getMessages as getMessages,
  postChannels as postChannels,
  postChannelMessages as postChannelMessages,
  putBeatmapScores as putBeatmapScores,
  getBeatmapScores as getBeatmapScores,
  postBeatmapScores as postBeatmapScores,
  getLookupBeatmap as getLookupBeatmap,
  //-------------------------------
  oapiAuthorization as oapiAuthorization,
  oapiGetBeatmap as oapiGetBeatmap,
};
