const mysql = require("mysql");

const db = mysql.createConnection({
   user: "root",
   host: "localhost",
   password: "",
   database: "coach_list",
 });

 module.exports = db;