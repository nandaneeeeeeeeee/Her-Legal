
import "dotenv/config";
import { createServer } from "http";
import { app } from "./app.js";
import connectDB from "./db/index.js";

const httpServer = createServer(app);

connectDB()
  .then(() => {
    const PORT = process.env.PORT || 8000;
    httpServer.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed", error);
    process.exit(1);
  });
