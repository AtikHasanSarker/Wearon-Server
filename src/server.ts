import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import app from "./app";
dotenv.config();

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
