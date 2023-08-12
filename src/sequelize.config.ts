import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

const sequelize = new Sequelize(DB_NAME!, DB_USER!, DB_PASSWORD!, {
  host: DB_HOST,
  dialect: "mysql",
  logging: console.log,
});

// sequelize.authenticate()
// .then((): void=>{
//   console.log("Connected to database");
// })
// .catch(err=>{
//   console.log("Error while connecting to database " + err);
// })

export default sequelize;
