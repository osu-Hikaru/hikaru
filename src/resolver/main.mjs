// Licensed under GPL v3 - Check Repository Root for full License notice.
// osu!Hikaru, a fully independent osu!Lazer Private Server backend.
// Copyright (C) 2023 Hikaru Team <copyright@hikaru.pw>

export default class {
  #dictionary = {};

  constructor() {}

  getDict = () => {
    return this.#dictionary;
  };

  resolveDict = async (search) => {
    return new Promise(async (resolve, reject) => {
      if (this.#dictionary[search] !== undefined) {
        resolve(this.#dictionary[search]);
      } else {
        try {
          const splitSearch = search.split(".");
          
          let importString = process.cwd() + "/src/";

          while (splitSearch.length > 0) {
            let currElem = splitSearch.shift();

            importString += currElem + "/";
          }

          this.#dictionary[search] = await import(
            importString.slice(0, -1) + ".mjs"
          );

          resolve(this.#dictionary[search].default);
        } catch (e) {
          reject(e);
        }
      }
    });
  };
}
