import OpenAI from 'openai';
import sql from '../config/db.js';
import { clerkClient } from '@clerk/express';
import axios from 'axios';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import pdf from 'pdf-parse/lib/pdf-parse.js';

const AI = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
});

export const generateArticle = async (req, res) => {
  try {
    console.log('testt');
    const { userId } = req.auth();
    const { prompt, length } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== 'premium' && free_usage > 10) {
      return res.json({
        success: false,
        message: 'Limit reached. Upgrade to continue.',
      });
    }

    const response = await AI.chat.completions.create({
      model: 'gemini-2.5-flash',
      //reasoning_effort: 'low',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: length,
    });

    const content = response.choices[0].message.content;

    await sql`INSERT INTO creations (user_id, prompt, content, type)
VALUES(${userId}, ${prompt}, ${content}, 'article')`;

    if (plan !== 'premium') {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

    res.json({ success: true, content });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//Generate blog title

export const generateBlogTitle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== 'premium' && free_usage > 10) {
      return res.json({
        success: false,
        message: 'Limit reached. Upgrade to continue.',
      });
    }

    const response = await AI.chat.completions.create({
      model: 'gemini-2.5-flash',
      //reasoning_effort: 'low',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 100,
    });

    const content = response.choices[0].message.content;

    await sql`INSERT INTO creations (user_id, prompt, content, type)
VALUES(${userId}, ${prompt}, ${content}, 'blog-title')`;

    if (plan !== 'premium') {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

    res.json({ success: true, content });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//Generate Image

export const generateImage = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, publish } = req.body;
    const plan = req.plan;

    //we removed the free usage cus we want only premium users to use the feature
    //const free_usage = req.free_usage

    //we removed the '&& free_usage >10' from the code to prevent free user plan from using the sever
    console.log(plan);
    console.log('test');
    if (plan !== 'premium') {
      return res.json({
        success: false,
        message: 'This feature is available for premium subscribers only!',
      });
    }

    const formData = new FormData();
    formData.append('prompt', prompt);

    const { data } = await axios.post(
      'https://clipdrop-api.co/text-to-image/v1',
      formData,
      {
        headers: { 'x-api-key': process.env.CLIPDROP_API_KEY },
        responseType: 'arraybuffer',
      }
    );

    const base64Image = `data:image/png;base64,${Buffer.from(
      data,
      'binary'
    ).toString('base64')}`;

    const { secure_url } = await cloudinary.uploader.upload(base64Image);

    await sql`INSERT INTO creations (user_id, prompt, content, type, publish)
VALUES(${userId}, ${prompt}, ${secure_url}, 'image',${publish ?? false})`;

    res.json({ success: true, content: secure_url });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const removeImageBackground = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { image } = req.file;
    const plan = req.plan;

    if (plan !== 'premium') {
      return res.json({
        success: false,
        message: 'This feature is available for premium subscribers only!',
      });
    }

    const { secure_url } = await cloudinary.uploader.upload(image.path, {
      transformation: [
        {
          effect: 'background_removal',
          background_removal: 'remove_the_background',
        },
      ],
    });

    await sql`INSERT INTO creations (user_id, prompt, content, type )
VALUES(${userId}, 'Remove background from image', ${secure_url}, 'image')`;

    res.json({ success: true, content: secure_url });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const removeImageObject = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { object } = req.body;
    const { image } = req.file;
    const plan = req.plan;

    if (plan !== 'premium') {
      return res.json({
        success: false,
        message: 'This feature is available for premium subscribers only!',
      });
    }

    const { public_id } = await cloudinary.uploader.upload(image.path);

    const imageUrl = cloudinary.url(public_id, {
      transformation: [{ effect: `gen_remove:${object}` }],
      resource_type: 'image',
    });

    await sql`INSERT INTO creations (user_id, prompt, content, type )
VALUES(${userId}, ${`Removed ${object} from image`}, ${imageUrl}, 'image')`;

    res.json({ success: true, content: imageUrl });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const resumeReview = async (req, res) => {
  try {
    const { userId } = req.auth();
    const resume = req.file;
    const plan = req.plan;

    if (plan !== 'premium') {
      return res.json({
        success: false,
        message: 'This feature is available for premium subscribers only!',
      });
    }

    if (resume.size > 5 * 1024 * 1024) {
      return res.json({
        success: false,
        message: 'Resume file size exceeds allowed size (5MB).',
      });
    }

    const databuffer = fs.readFileSync(resume.path);
    const pdfData = await pdf(databuffer);

    const prompt = `Review the following resume and provide constructive feedback on its strengths, weaknesses, and areas for improvement. Resume Content:\n\n${pdfData.text}`;

    const response = await AI.chat.completions.create({
      model: 'gemini-2.5-flash',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content;

    await sql`INSERT INTO creations (user_id, prompt, content, type )
VALUES(${userId}, 'Review the uploaded resume', ${content}, 'resume-review')`;

    res.json({ success: true, content: content });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
