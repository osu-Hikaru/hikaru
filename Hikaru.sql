-- --------------------------------------------------------
-- Host:                         37.120.186.220
-- Server version:               10.5.19-MariaDB-0+deb11u2 - Debian 11
-- Server OS:                    debian-linux-gnu
-- HeidiSQL Version:             12.5.0.6677
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for hikarudev
CREATE DATABASE IF NOT EXISTS `hikarudev` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `hikarudev`;

-- Dumping structure for table hikarudev.accounts
CREATE TABLE IF NOT EXISTS `accounts` (
  `user_id` int(10) NOT NULL AUTO_INCREMENT,
  `username` char(28) NOT NULL,
  `email` varchar(128) NOT NULL,
  `password` char(72) NOT NULL,
  PRIMARY KEY (`user_id`) USING BTREE,
  UNIQUE KEY `email` (`email`) USING BTREE,
  UNIQUE KEY `username` (`username`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=102 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table hikarudev.beatmaps
CREATE TABLE IF NOT EXISTS `beatmaps` (
  `beatmapset_id` int(16) NOT NULL,
  `difficulty_rating` float DEFAULT NULL,
  `beatmap_id` int(11) NOT NULL AUTO_INCREMENT,
  `mode` varchar(50) DEFAULT '',
  `status` varchar(50) DEFAULT '',
  `total_length` int(11) DEFAULT 0,
  `user_id` int(11) DEFAULT 0,
  `version` varchar(256) DEFAULT '0',
  `accuracy` float DEFAULT 0,
  `cs` float DEFAULT 0,
  `ar` float DEFAULT 0,
  `bpm` float DEFAULT 0,
  `is_convert` bit(1) DEFAULT b'0',
  `count_circles` int(11) DEFAULT 0,
  `count_sliders` int(11) DEFAULT 0,
  `count_spinners` int(11) DEFAULT 0,
  `deleted_at` datetime DEFAULT '0000-00-00 00:00:00',
  `drain` int(11) DEFAULT 0,
  `hit_length` int(11) DEFAULT 0,
  `is_scoreable` bit(1) DEFAULT b'0',
  `last_updated` datetime DEFAULT '0000-00-00 00:00:00',
  `mode_int` tinyint(4) DEFAULT 0,
  `passcount` int(11) DEFAULT 0,
  `playcount` int(11) DEFAULT 0,
  `ranked` tinyint(2) DEFAULT 0,
  `url` varchar(256) DEFAULT '0',
  `checksum` varchar(256) DEFAULT '0',
  `max_combo` int(11) DEFAULT NULL,
  `new_max_combo` int(11) DEFAULT NULL,
  PRIMARY KEY (`beatmap_id`) USING BTREE,
  UNIQUE KEY `beatmapset_id` (`beatmapset_id`,`beatmap_id`,`mode`) USING BTREE,
  CONSTRAINT `FK_beatmaps_beatmapsets` FOREIGN KEY (`beatmapset_id`) REFERENCES `beatmapsets` (`beatmapset_id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=3817222 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table hikarudev.beatmapsets
CREATE TABLE IF NOT EXISTS `beatmapsets` (
  `artist` varchar(128) DEFAULT NULL,
  `artist_unicode` varchar(128) NOT NULL,
  `cover_id` int(11) DEFAULT NULL,
  `creator` varchar(32) NOT NULL,
  `favorite_count` int(11) NOT NULL DEFAULT 0,
  `hype` int(11) DEFAULT NULL,
  `beatmapset_id` int(11) NOT NULL,
  `nsfw` tinyint(1) NOT NULL DEFAULT 0,
  `play_count` int(11) NOT NULL DEFAULT 0,
  `source` varchar(64) DEFAULT NULL,
  `status` varchar(32) NOT NULL DEFAULT 'graveyard',
  `title` varchar(256) DEFAULT NULL,
  `title_unicode` varchar(256) NOT NULL,
  `track_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `video` tinyint(1) NOT NULL DEFAULT 0,
  `download_disabled` tinyint(1) NOT NULL DEFAULT 0,
  `more_information` text DEFAULT NULL,
  `bpm` float NOT NULL DEFAULT 0,
  `can_be_hyped` tinyint(1) NOT NULL DEFAULT 0,
  `discussion_enabled` tinyint(1) NOT NULL DEFAULT 0,
  `discussion_locked` tinyint(1) NOT NULL DEFAULT 1,
  `is_scoreable` tinyint(1) NOT NULL DEFAULT 0,
  `last_updated` datetime DEFAULT NULL,
  `nomination_current` int(11) NOT NULL DEFAULT 2,
  `nomination_required` int(11) NOT NULL DEFAULT 2,
  `ranked` tinyint(4) NOT NULL DEFAULT 0,
  `ranked_date` datetime DEFAULT NULL,
  `storyboard` tinyint(1) NOT NULL DEFAULT 0,
  `submitted_date` datetime DEFAULT NULL,
  `tags` text DEFAULT NULL,
  PRIMARY KEY (`beatmapset_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table hikarudev.channels
CREATE TABLE IF NOT EXISTS `channels` (
  `channel_id` int(11) NOT NULL,
  `description` varchar(1024) DEFAULT NULL,
  `icon` varchar(128) DEFAULT NULL,
  `moderated` bit(1) DEFAULT NULL,
  `name` varchar(64) DEFAULT NULL,
  `type` varchar(16) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `target_1` int(11) DEFAULT NULL,
  `target_2` int(11) DEFAULT NULL,
  PRIMARY KEY (`channel_id`) USING BTREE,
  KEY `FK_channels_groups` (`group_id`),
  CONSTRAINT `FK_channels_groups` FOREIGN KEY (`group_id`) REFERENCES `groups` (`group_id`) ON DELETE SET NULL ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table hikarudev.chat_presence
CREATE TABLE IF NOT EXISTS `chat_presence` (
  `user_id` int(11) NOT NULL,
  `channel_id` int(11) NOT NULL,
  `last_read_id` int(11) DEFAULT 0,
  `can_message` bit(1) DEFAULT NULL,
  PRIMARY KEY (`channel_id`,`user_id`) USING BTREE,
  KEY `FK_chat_presence_users` (`user_id`),
  CONSTRAINT `FK_chat_presence_channels` FOREIGN KEY (`channel_id`) REFERENCES `channels` (`channel_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_chat_presence_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table hikarudev.friends
CREATE TABLE IF NOT EXISTS `friends` (
  `user_id` int(11) NOT NULL,
  `friend_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`),
  KEY `FK_friends_users_2` (`friend_id`),
  CONSTRAINT `FK_friends_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_friends_users_2` FOREIGN KEY (`friend_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table hikarudev.groups
CREATE TABLE IF NOT EXISTS `groups` (
  `group_id` int(11) NOT NULL AUTO_INCREMENT,
  `identifier` text DEFAULT NULL,
  `name` text DEFAULT NULL,
  `short_name` tinytext DEFAULT NULL,
  `playmodes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `has_playmodes` tinyint(1) NOT NULL DEFAULT 0,
  `has_listing` tinyint(1) NOT NULL DEFAULT 0,
  `is_probationary` tinyint(1) NOT NULL DEFAULT 0,
  `colour` tinytext DEFAULT NULL,
  `max_blocks_multi` int(8) DEFAULT 1,
  `max_friends_multi` int(8) DEFAULT 1,
  PRIMARY KEY (`group_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table hikarudev.messages
CREATE TABLE IF NOT EXISTS `messages` (
  `channel_id` int(3) DEFAULT NULL,
  `message_id` int(3) NOT NULL AUTO_INCREMENT,
  `user_id` int(10) DEFAULT NULL,
  `timestamp` datetime DEFAULT NULL,
  `message_content` varchar(512) DEFAULT NULL,
  `is_action` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`message_id`) USING BTREE,
  KEY `FK_messages_users` (`user_id`),
  CONSTRAINT `FK_messages_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table hikarudev.mirror
CREATE TABLE IF NOT EXISTS `mirror` (
  `id` int(11) NOT NULL,
  `LM` datetime DEFAULT NULL,
  `CD` text DEFAULT NULL,
  `CL` int(11) DEFAULT NULL,
  `CT` varchar(128) DEFAULT NULL,
  `ETag` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table hikarudev.news
CREATE TABLE IF NOT EXISTS `news` (
  `author` varchar(32) NOT NULL DEFAULT 'Hikaru Team',
  `edit_url` varchar(512) DEFAULT NULL,
  `first_image` varchar(512) DEFAULT NULL,
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `preview` longtext DEFAULT NULL,
  `published_at` datetime NOT NULL,
  `slug` varchar(256) NOT NULL,
  `title` varchar(256) NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table hikarudev.rankings
CREATE TABLE IF NOT EXISTS `rankings` (
  `user_id` int(11) DEFAULT NULL,
  `mode` varchar(50) DEFAULT NULL,
  `pp` int(11) DEFAULT NULL,
  `score` int(11) DEFAULT NULL,
  `rank` int(11) DEFAULT NULL,
  `score_rank` int(11) DEFAULT NULL,
  KEY `FK_rankings_users` (`user_id`),
  CONSTRAINT `FK_rankings_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table hikarudev.rulesets
CREATE TABLE IF NOT EXISTS `rulesets` (
  `ruleset_id` int(11) NOT NULL AUTO_INCREMENT,
  `ruleset_safe_name` varchar(64) DEFAULT NULL,
  `ruleset_name` varchar(64) DEFAULT NULL,
  `ruleset_description` text DEFAULT NULL,
  `ranked` int(11) DEFAULT NULL,
  PRIMARY KEY (`ruleset_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table hikarudev.scores
CREATE TABLE IF NOT EXISTS `scores` (
  `score_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `beatmap_id` int(11) NOT NULL,
  `ruleset_id` int(11) NOT NULL,
  `passed` int(1) NOT NULL,
  `mods` longtext NOT NULL CHECK (json_valid(`mods`)),
  `miss` int(11) NOT NULL DEFAULT 0,
  `meh` int(11) NOT NULL DEFAULT 0,
  `ok` int(11) NOT NULL DEFAULT 0,
  `good` int(11) NOT NULL DEFAULT 0,
  `great` int(11) NOT NULL DEFAULT 0,
  `perfect` int(1) NOT NULL,
  `small_tick_miss` int(11) NOT NULL DEFAULT 0,
  `small_tick_hit` int(11) NOT NULL DEFAULT 0,
  `large_tick_miss` int(11) NOT NULL DEFAULT 0,
  `large_tick_hit` int(11) NOT NULL DEFAULT 0,
  `small_bonus` int(11) NOT NULL DEFAULT 0,
  `large_bonus` int(11) NOT NULL DEFAULT 0,
  `ignore_miss` int(11) NOT NULL DEFAULT 0,
  `ignore_hit` int(11) NOT NULL DEFAULT 0,
  `rank` char(2) NOT NULL,
  `total_score` int(16) NOT NULL DEFAULT 0,
  `pp` float DEFAULT NULL,
  `max_combo` int(6) NOT NULL DEFAULT 0,
  `created_at` bigint(20) NOT NULL DEFAULT unix_timestamp(),
  `accuracy` float NOT NULL DEFAULT 0,
  PRIMARY KEY (`score_id`),
  KEY `FK_scores_users` (`user_id`),
  KEY `FK_scores_beatmaps` (`beatmap_id`),
  KEY `FK_scores_ruleset_descriptors` (`ruleset_id`),
  CONSTRAINT `FK_scores_beatmaps` FOREIGN KEY (`beatmap_id`) REFERENCES `beatmaps` (`beatmap_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_scores_ruleset_descriptors` FOREIGN KEY (`ruleset_id`) REFERENCES `rulesets` (`ruleset_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_scores_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table hikarudev.users
CREATE TABLE IF NOT EXISTS `users` (
  `avatar_url` varchar(256) DEFAULT 'https://a.hikaru.pw/1/default_av.jpg',
  `cover_url` varchar(256) DEFAULT 'https://a.hikaru.pw/1/default_cv.jpg',
  `country_code` varchar(2) DEFAULT '',
  `country_name` varchar(128) DEFAULT '',
  `user_id` int(10) NOT NULL,
  `username` char(28) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_bot` tinyint(1) DEFAULT 0,
  `is_deleted` tinyint(1) DEFAULT 0,
  `is_online` tinyint(1) DEFAULT 1,
  `is_supporter` tinyint(4) DEFAULT 0,
  `has_supported` tinyint(4) DEFAULT 0,
  `last_visit` datetime DEFAULT current_timestamp(),
  `join_date` datetime DEFAULT current_timestamp(),
  `play_start` datetime DEFAULT NULL,
  `pm_friends_only` tinyint(1) DEFAULT 0,
  `current_ruleset` tinyint(4) DEFAULT NULL,
  `active_id` int(11) DEFAULT NULL,
  `active_bm_id` int(11) DEFAULT NULL,
  `groups` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`user_id`) USING BTREE,
  UNIQUE KEY `username` (`username`),
  CONSTRAINT `FK_users_accounts` FOREIGN KEY (`user_id`) REFERENCES `accounts` (`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_users_accounts_2` FOREIGN KEY (`username`) REFERENCES `accounts` (`username`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table hikarudev.websocket
CREATE TABLE IF NOT EXISTS `websocket` (
  `connection_id` varchar(64) NOT NULL,
  `connection_token` varchar(64) NOT NULL,
  `user_id` int(11) NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`connection_id`),
  KEY `FK_websocket_accounts` (`user_id`),
  CONSTRAINT `FK_websocket_accounts` FOREIGN KEY (`user_id`) REFERENCES `accounts` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
