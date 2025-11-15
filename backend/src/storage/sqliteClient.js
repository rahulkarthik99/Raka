const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./autoposter.db');

const initializeDb = () => {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      topic TEXT,
      caption TEXT,
      hashtags TEXT,
      image_prompt TEXT,
      image_url TEXT,
      platforms TEXT,
      scheduled_at TEXT,
      approved BOOLEAN DEFAULT 0,
      status TEXT DEFAULT 'draft',
      post_id TEXT,
      response TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      last_attempt_at TEXT,
      attempts INTEGER DEFAULT 0
    )`);
  });
};

initializeDb();

const crypto = require('crypto');

function generateId() {
  return crypto.randomBytes(16).toString('hex');
}

const getPosts = () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM posts ORDER BY created_at DESC', [], (err, rows) => {
            if (err) {
                reject(err);
            }
            resolve(rows);
        });
    });
};

const getPost = (id) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM posts WHERE id = ?', [id], (err, row) => {
            if (err) {
                reject(err);
            }
            resolve(row);
        });
    });
};

const createPost = (post) => {
    const newPost = { id: generateId(), ...post };
    return new Promise((resolve, reject) => {
        const columns = Object.keys(newPost).join(', ');
        const placeholders = Object.keys(newPost).map(() => '?').join(', ');
        const values = Object.values(newPost);

        const sql = `INSERT INTO posts (${columns}) VALUES (${placeholders})`;
        db.run(sql, values, function (err) {
            if (err) {
                reject(err);
            }
            resolve({ id: newPost.id, ...newPost });
        });
    });
};

const updatePost = (id, post) => {
    return new Promise((resolve, reject) => {
        const updates = Object.keys(post).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(post), id];

        const sql = `UPDATE posts SET ${updates} WHERE id = ?`;
        db.run(sql, values, function (err) {
            if (err) {
                reject(err);
            }
            resolve({ id, ...post });
        });
    });
};

const deletePost = (id) => {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM posts WHERE id = ?', [id], function (err) {
            if (err) {
                reject(err);
            }
            resolve({ id });
        });
    });
};


module.exports = {
  db,
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost
};
