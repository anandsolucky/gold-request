const Pool = require("pg").Pool;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // host: "localhost",
  // database: "api",
  dialectOptions: {
    ssl: {
      require: true, // This will help you. But you will see nwe error
      rejectUnauthorized: false, // This line will fix new error
    },
  },
  // port: 5432,
});
module.exports = pool;
