# osu!Hikaru

An independent osu!Lazer private server.

## What makes it special?

This is basically a "student project", or more a playground for me to try things out and learn. I set it as challenge for myself specifically to implement this based on the osu sourcecode as well as reversing netcalls and figuring things out on my own, without any help of the other repositories that the [official github](https://github.com/ppy/) may provide.

This is mainly due to, again, learning purposes. I do not plan on offering a "commercial" or "well maintained" solution at the current time. But I may be hosting a server for the general public once this thing is finished. 

But since the entire repository is GPLv3, I guess you can do whatever you want with it, no?

## Setup

There currently is no easy way to set this up. However, here is a general outline on the steps one would take:

- Install packages/dependencies
- Setup a `.env` file for [Prisma](https://www.prisma.io/) 
- Generate backend public and private key for JWT Signing
- Setup database based on the scripts provided in `apps/backend/sql`
- Run the project

I offer no guarantee for this to work on windows at the current time, but if you are looking at this I am sure you can figure it out.

## Features

Since this project is perpetually in-dev (due to not only time constraints but especially an ever changing osu-lazer codebase) features may come and go as they please. This list aims to provide a general outline of what is available and usable, and what isn't. It is by no means a guarantee that it will work at the current point in time, but I will prioritize keeping already working features working as time goes on.

### Backend

The core server.

Note: Multiplayer and Spectator specifically require their own websocket based solutions. In the previous versions this was hard to reverse and I still have not figured out how. But I am sure I will get it eventually.

- [ ] Users
  - [x] Registration
  - [x] Login
  - [ ] Data retrieval
- [ ] Gameplay
  - [ ] Score submission
  - [ ] Beatmaps
    - [ ] Beatmaps
    - [ ] Beatmapsets
  - [ ] Rulesets
    - [ ] osu
    - [ ] taiko
    - [ ] catch
    - [ ] mania
    - [ ] Custom Rulesets
- [ ] Social
  - [ ] Chat
  - [ ] Multiplayer
  - [ ] Spectator
  - [ ] Leaderboards 
- [ ] Other
  - [ ] Wiki
  - [ ] News
  - [ ] Spotlights

### Frontend

The frontend basically depends on the backend, so this will expand over time.

- [ ] Base Website
- [ ] Users
  - [ ] Registration
  - [ ] Login
  - [ ] Data Retrieval
    - [ ] Account Management