// pagination.js

const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(':memory:'); // Using an in-memory SQLite database for simplicity

// Create a table and populate it with sample data
db.serialize(() => {
  db.run('CREATE TABLE items (id INT, name TEXT)');
  for (let i = 1; i <= 100; i++) {
    db.run(`INSERT INTO items VALUES (${i}, 'Item ${i}')`);
  }
});

export default function getPaginatedItems(page, pageSize, callback) {
  const offset = (page - 1) * pageSize;
  const query = `SELECT * FROM items LIMIT ${pageSize} OFFSET ${offset}`;

  db.all(query, (err, rows) => {
    if (err) {
      callback({ error: 'Database error' });
    } else {
      // Simulate the total item count
      db.get('SELECT COUNT(*) AS total FROM items', (err, row) => {
        const totalItems = row.total;
        callback(null, { data: rows, totalItems });
      });
    }
  });
}

module.exports = { getPaginatedItems };
