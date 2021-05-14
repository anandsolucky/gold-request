const Pool = require("pg").Pool;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // user: "me",
  // host: "localhost",
  // database: "api",
  // password: "123456",
  // port: 5432,
});

module.exports = pool;
