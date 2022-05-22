import express from "express";
const app = express();

//error handler
import "express-async-errors";

// db
import connectDB from "./db/connect.js";

// routers
import authRouter from "./routes/authRoutes.js";
import jobsRouter from "./routes/jobsRouter.js";
import jobAppRouter from "./routes/jobAppRoutes.js";
import userRouter from "./routes/userRouter.js";

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ msg: "Welcome" });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", jobsRouter);
app.use("/api/v1/jobApps", jobAppRouter);
app.use("/api/v1/users", userRouter);

const start = async () => {
  try {
    await connectDB(
      "mongodb+srv://poorna:po112@123cluster0.zvcveau.mongodb.net/dream_career?retryWrites=true&w=majority"
    );
    app.listen(5000, () => {
      console.log(`Server is listing on port : 5000`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
