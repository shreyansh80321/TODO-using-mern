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

app.use(express.json());

const port = process.env.PORT || 3000

app.get("/api/jokes", (req, res) => {
  const jokes = [
    {
      id: 1,
      title: "A joke",
      content: "This is a joke",
    },
    {
      id: 2,
      title: "A 2 joke",
      content: "This is a joke 2",
    },
    {
      id: 3,
      title: "A 3 joke",
      content: "This is a joke 3",
    },
    {
      id: 4,
      title: "A 4 joke",
      content: "This is a joke 4",
    },
    {
      id: 5,
      title: "A 5 joke",
      content: "This is a joke 5",
    },
  ];
  res.send(jokes);
});

app.use("/api/todos", todoRoutes);

app.get('/', (req, res) => {
  res.send(`Server is running on port ${port}`);
})
app.listen(port, () => {
  console.log(`Server listening on port : ${port}`);
})