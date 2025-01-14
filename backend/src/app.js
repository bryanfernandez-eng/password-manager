import express from "express";
import "dotenv/config";
import authRouter from "./routes/auth.route.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/api/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});
