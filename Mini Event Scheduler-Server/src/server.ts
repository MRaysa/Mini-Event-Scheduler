import app from "./app";
import dotenv from "dotenv";
import connectDB from "./utils/database";

dotenv.config();

const PORT = process.env.PORT || 3001;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
