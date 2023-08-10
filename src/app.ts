import express from 'express'

// Import controllers
import userController from "./controllers/user_controller";

const app = express();
app.use(express.json());

// Use the controllers for specific routes
app.use("/", userController);

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
