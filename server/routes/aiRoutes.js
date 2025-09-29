import express from 'express'
import { auth } from '../middlewares/auth.js';
import { generateArticle } from '../controllers/aicontroller.js';

const aiRouter = express.Router();

console.log("Inside /generate-article handler");

aiRouter.post('/generate-article', auth, generateArticle)

export default aiRouter