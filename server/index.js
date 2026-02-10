import dotenv from "dotenv";
dotenv.config();
import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";
import "./src/workers/jobWorker.js";
import "./src/cron/fetchJobsCron.js";



connectDB();


app.listen(5000, () => {
  console.log("Server running on port 5000");
});

