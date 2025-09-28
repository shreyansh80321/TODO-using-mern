import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import todoRoutes from "./routes/todoRoutes.js"

dotenv.config({
  path:"./.env"
})

connectDB()

const app = express()

app.use(
  cors({
    origin: [
      "https://frontend-mern-olive.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

const port = process.env.PORT || 3000

app.use("/api/todos", todoRoutes);

app.get('/', (req, res) => {
  res.send(`Server is running on port ${port}`);
})
app.listen(port, () => {
  console.log(`Server listening on port : ${port}`);
})