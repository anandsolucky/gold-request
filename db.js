const Pool = require("pg").Pool;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // connectionString:
  //   "postgres://hvggsnhydgvhek:7849f90c7045914247069740164b4aa5201ebb427d59e31e14d83c49180e6bf5@ec2-3-215-57-87.compute-1.amazonaws.com:5432/df88ai6eq5lknf",
  // host: "ec2-3-215-57-87.compute-1.amazonaws.com",
  // database: "adf88ai6eq5lknfpi",

  ssl: {
    // require: true, // This will help you. But you will see nwe error
    rejectUnauthorized: false, // This line will fix new error
  },
  // user: "hvggsnhydgvhek",
  // password: "7849f90c7045914247069740164b4aa5201ebb427d59e31e14d83c49180e6bf5",
  // port: 5432,
});
module.exports = pool;
