const config = require("./config");
const envConfig = {
  client: "mysql",
  connection: {
    host: process.env.DBHOST,
    port: process.env.DBPORT,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBDATABASE
  }
}
module.exports = config || envConfig;
