
import "dotenv/config";
import routes from "./routes/index.js";
import { createServer } from "http";
import { app } from "./app.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import connectDB from "./db/index.js";


app.use("/api/v1", routes);
app.use(errorMiddleware);

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
