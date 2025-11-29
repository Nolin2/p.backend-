// server.js

// 1. Load Environment Variables and Dependencies
require('dotenv').config();
const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const cors = require('cors');
const app = express();
const port = 3000;

// 2. Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("FATAL ERROR: GEMINI_API_KEY is not set in the .env file.");
    process.exit(1);
}
const ai = new GoogleGenAI(apiKey);

// 3. Configure Express Middleware
app.use(cors());
app.use(express.json());
// Serve the index.html file and other static assets (like images)
app.use(express.static(__dirname));

// 4. Define the Knowledge Base (RAG Data)
const PERSONA_DATA = {
    name: "Nolin Masai Wabuti",
    role: "AI Engineer specializing in LLM Development and Predictive Modeling.",
    expertise: "LLM Integration, Prompt Engineering, Predictive Modeling (90% accuracy), Data Annotation, MLOps, Python, Scikit-learn, AWS, SQL.",
    softSkills: "Collaborative teamwork, excellent technical communication, strategic problem-solving, strong passion for ethical and sustainable AI development.",
    experience: [
        "2 years of experience transforming complex data science models into reliable, high-performing software products.",
        "Work spans the entire ML lifecycle: research, experimentation, deployment, and monitoring in production environments.",
        "Advocacy work with WFF FAO, focusing on sustainable food systems policy, demonstrating a commitment to ethical AI aligned with global goals."
    ],
    projects: [
        {
            title: "Wabtech AI Study Tool (Generative AI)",
            description: "Developed a custom Generative AI application (GPT/Gemini style) tailored for STEM education. Features include Q&A, flashcard generation, and personalized feedback. This project highlights expertise in LLM fine-tuning and domain-specific prompt engineering."
        },
        {
            title: "Carbon Emission Predictive AI",
            description: "Built a powerful predictive model that forecasts carbon emissions with an accuracy of 90%. Utilized XGBoost and extensive feature engineering. Provides actionable insights for environmental policy and optimization."
        },
        {
            title: "Data Annotation & Quality Control",
            description: "Currently ensuring high-quality, precise labeling of datasets—a crucial foundation for training robust machine learning models. This guarantees data integrity and model reliability."
        }
    ],
    contact: "Email: masainollin@gmail.com | Phone: 0757130382 | LinkedIn: https://www.linkedin.com/in/nolin-masai"
};

const SYSTEM_INSTRUCTION = `
You are the personal AI Assistant for Nolin Masai Wabuti, an AI Engineer.
Your primary role is to answer questions asked by recruiters or hiring managers based *only* on the knowledge provided below.
Maintain a professional, highly positive, and enthusiastic tone. Do not invent any information.
The knowledge base is provided in JSON format under the variable PERSONA_DATA.
If the answer is not in the provided data, politely state that the information is not available in the current knowledge base.
`;

// 5. API Endpoint for AI Queries
app.post('/api/ask-ai', async (req, res) => {
    const { query } = req.body;

    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required.' });
    }

    // 6. Construct the Prompt with RAG
    const prompt = `
        **KNOWLEDGE BASE ABOUT NOLIN MASAI WABUTI (JSON):**
        ---
        ${JSON.stringify(PERSONA_DATA, null, 2)}
        ---
        
        **USER QUESTION:**
        ${query}
        
        Based *only* on the knowledge base above, provide a concise and professional answer to the user's question.
    `;

    try {
        // 7. Call the Gemini API
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash", 
            contents: [prompt],
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
            }
        });

        // 8. Send the AI's response text back to the frontend
        res.json({ text: response.text });
        
    } catch (error) {
        console.error("Gemini API Error:", error.message);
        res.status(500).json({ 
            error: "Failed to communicate with the AI model.",
            details: error.message 
        });
    }
});

// 9. Start the Server
app.listen(port, () => {
    console.log(`\n🎉 Nolin's AI Assistant Server is running!`);
    console.log(`🚀 Access the portfolio at: http://localhost:${port}/index.html`);
    console.log(`👂 Listening for API calls on http://localhost:${port}/api/ask-ai`);
    console.log(`\n--------------------------------------------------------------`);
    console.log(`Remember to open index.html in your browser and click 'Ask AI'.`);
});
