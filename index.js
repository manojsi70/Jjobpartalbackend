import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js"

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
   origin: "http://localhost:3000",
   credentials: true,
};
app.use(cors(corsOptions));

// API routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/applicant", applicationRoute);

const port = process.env.PORT || 8001;

// Connect to the database and then start the server
connectDB().then(() => {
   app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
   });
}).catch(error => {
   console.error("Failed to connect to the database", error);
   // process.exit(1);
});
