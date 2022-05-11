// Licensed under GPL v3 - Check Repository Root for full License notice.
// osu!Hikaru, a fully independent osu!Lazer Private Server backend.
// Copyright (C) 2021 Hikaru Team <copyright@hikaru.pw>

export default async (pool, req, res) => {
  const conn = await pool.getConnection();
  let newsposts = {
    cursor: { id: 0, published_at: "2021-12-01T08:00:00.000000Z" },
    news_posts: [],
  };
  let query_params = [];
  let query_statement = "SELECT * FROM news";

  if (req.query.cursor !== undefined) {
    newsposts.cursor.id = Number(req.query.cursor.id);
    newsposts.cursor.published_at = new Date(
      req.query.cursor.published_at
    ).toISOString();

    query_statement += ` WHERE id > ?`;
    query_params.push(Number(req.query.cursor.id));

    query_statement += ` AND published_at < ?`;
    query_params.push(new Date(req.query.cursor.published_at).toUTCString());
  }

  query_statement += ` ORDER BY id DESC`;

  conn
    .query(`${query_statement} LIMIT 10`, query_params)
    .then(async (dbResNews) => {
      if (dbResNews.length > 0) {
        newsposts.cursor.id = dbResNews[0].id;
        newsposts.cursor.published_at = dbResNews[0].published_at;
        await dbResNews.forEach((post) => {
          newsposts.news_posts.push({
            author: String(post.author),
            edit_url: String(post.edit_url),
            first_image: String(post.first_image),
            id: Number(post.id),
            preview: String(post.preview),
            published_at: String(new Date(post.published_at).toISOString()),
            slug: String(post.slug),
            title: String(post.title),
            updated_at: String(new Date(post.updated_at).toISOString()),
          });
        });
      }

      res.status(200);
      res.json(newsposts);
      conn.end();
    })
    .catch((err) => {
      console.log(err);
      res.status(500);
      res.send();
      conn.end();
      return;
    });
};
