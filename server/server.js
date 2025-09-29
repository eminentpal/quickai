import express from "express";
import cors from "cors"
import 'dotenv/config'
import { clerkMiddleware, requireAuth } from '@clerk/express'
import aiRouter from "./routes/aiRoutes.js";

const app = express();

app.use(cors())
app.use(express.json());
app.use(clerkMiddleware())


//home route
app.get("/", (req, res) => {
  res.send("Server is Live");
});

app.use(requireAuth());

//AI generate article route
app.use('/api/ai', aiRouter)




const POST = process.env.PORT || 3000;
app.listen(POST, () => {
  console.log('Server is running on port', POST);
}) 