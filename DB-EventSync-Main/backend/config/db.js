const oracledb = require("oracledb");
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT; 

require("dotenv").config();

async function initialize() {
  try {
    await oracledb.createPool({
      user: process.env.DB_USER || "c##project",            // default username
      password: process.env.DB_PASSWORD || "123",           // default password
      connectString: process.env.DB_CONNECTION_STRING || "localhost:1521/iba",  // host:port/service_name
      poolMin: 1,
      poolMax: 10,
      poolIncrement: 1,
      poolAlias: "default"  // pool alias
    });
    console.log("OracleDB pool created");
  } catch (err) {
    console.error("Error creating pool:", err);
  }
}

async function getConnection() {
  try {
    return await oracledb.getConnection("default"); // get connection from pool
  } catch (err) {
    console.error("Error getting connection:", err);
    throw err;
  }
}

module.exports = { initialize, getConnection };
