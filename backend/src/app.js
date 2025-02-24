import express from "express";
import "dotenv/config";
import authRouter from "./routes/auth.route.js";
import passwordRouter from "./routes/password.route.js";
import cors from "cors";
import helmet from "helmet"
import morgan from "morgan" 

import connectDB from "./lib/db.js";
import cookieParser from "cookie-parser"

// Middlewares 
const app = express();
app.use(express.json());
app.use(cookieParser());  
app.use(helmet()); 
app.use(morgan("dev"));

const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173',  
  methods: ['GET', 'POST'],
  credentials: true,  
}));

app.use("/api/auth", authRouter);
app.use("/api/password", passwordRouter)

app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
  connectDB(); 
});
 