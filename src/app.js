const express = require("express");
const app = express();
app.use(express.json());

// Import controllers
const userController = require("./controllers/user_controller.js");

// Use the controllers for specific routes
app.use("/", userController);


// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
