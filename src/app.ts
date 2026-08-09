import express from "express";
import cors from "cors";
import authRouter from "./services/auth/auth.route";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Hello, World!",
  });
});

export default app;
