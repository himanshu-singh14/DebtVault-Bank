const database = require("../database/database.js");
const User = require("../models/user.js");
database.connect();

class UserDao {
  // Retrieves a user by their mobile number
  getUserByMobileNumber(mobileNumber) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM user WHERE mobileNumber = '${mobileNumber}'`;
      database.query(query, (err, rows, fields) => {
        if (err) {
          reject(err);
          return;
        }
        if (rows.length === 0) {
          resolve(null); // No user found with the given mobile number
        } else {
          const user = new User(
            rows[0].name,
            rows[0].mobileNumber,
            rows[0].password,
            rows[0].email,
            rows[0].address,
            rows[0].dateOfBirth,
            rows[0].isLoggedIn ? true : false,
            rows[0].createdAt,
            rows[0].updatedAt
          );
          resolve(user);
        }
      });
    });
  }

  // Insert user to database
  insert(user) {
    const query = `INSERT INTO user (name, mobileNumber, password) VALUES ('${user.name}', '${user.mobileNumber}', '${user.password}');`;
    database.query(query, (err, rows, fields) => {
      if (err) throw err;
    });
  }
}

module.exports = UserDao;