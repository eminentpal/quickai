import express from "express";
import cors from "cors"
import 'dotenv/config'
import { clerkMiddleware, requireAuth } from '@clerk/express'

const app = express();
app.use(express.json());
app.use(clerkMiddleware())
app.use(cors())

app.get("/", (req, res) => {
  res.send("Server is Live");
});

app.use(requireAuth());

const POST = process.env.PORT || 3000;
app.listen(POST, () => {
  console.log('Server is running on port', POST);
}) 