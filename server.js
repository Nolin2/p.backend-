import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Load Gemini API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Route: /ask
app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(question);
    const answer = result.response.text();

    return res.json({ answer });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ✅ Render FIX — Use Render's assigned port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
