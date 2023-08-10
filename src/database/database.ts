import mysql from "mysql";
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345",
  database: "debtvault bank",
});

export default connection;
