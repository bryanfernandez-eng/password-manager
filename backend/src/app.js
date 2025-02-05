import express from "express";
import "dotenv/config";
import authRouter from "./routes/auth.route.js";
import passwordRouter from "./routes/password.route.js";

import connectDB from "./lib/db.js";
import cookieParser from "cookie-parser"

const app = express();
app.use(express.json());
app.use(cookieParser());  
const PORT = process.env.PORT || 3000;

app.use("/api/auth", authRouter);
app.use("/api/password", passwordRouter)

app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
  connectDB(); 
});
 