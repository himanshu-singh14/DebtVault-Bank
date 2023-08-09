class User {
  constructor(
    name,
    mobileNumber,
    password,
    email = null,
    address = null,
    dateOfBirth = null,
    isLoggedIn = false,
    createdAt = null,
    updatedAt = null
  ) {
    this.name = name;
    this.mobileNumber = mobileNumber;
    this.password = password;
    this.email = email;
    this.address = address;
    this.dateOfBirth = dateOfBirth;
    this.isLoggedIn = isLoggedIn;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

module.exports = User;
