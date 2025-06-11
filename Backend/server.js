import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Enable CORS for all routes
app.use(cors());
// Parse incoming JSON requests
app.use(express.json());

// Handle invalid JSON gracefully
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    // If JSON is invalid, return a 400 error
    return res.status(400).json({ message: "Invalid JSON in request body" });
  }
  next();
});

// Main endpoint for insurance chat
app.post("/api/insurance", async (req, res) => {
  try {
    const { history } = req.body;

    // Validate chat history format
    if (!history || !Array.isArray(history)) {
      return res.status(400).json({ reply: "Invalid chat history format." });
    }

    // Filter out only user messages
    const userMessages = history.filter((msg) => msg.role === "user");

    // System prompt for Gemini model
    const introPrompt = `
You are Tina, a helpful and friendly AI assistant specializing in car insurance. You are friendly and informative but also concise. Your goal is to help users find the best car insurance option based on their needs.

Ask the user up to **5 questions** to understand their needs and then recommend ONE of the following based on the details:
- Mechanical Breakdown Insurance (MBI): Only for non-trucks and non-racing cars.
- Comprehensive Car Insurance: Only for vehicles under 10 years old.
- Third Party Car Insurance: For everything else.

RULES:
- Never repeat the user's words.
- Never repeat your own questions.
- Do NOT ask more than 5 questions.
- If 5 user responses exist, immediately stop asking and give a complete recommendation.
- If the user asks for a recommendation before 5 questions, politely inform them that you need more information.
- Acknowledge the user's responses but do not repeat them.
`.trim();

    // Prepare messages for Gemini API (system prompt + chat history)
    const messages = [
      {
        role: "user",
        parts: [{ text: introPrompt }],
      },
      ...history.map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      })),
    ];

    // Gemini model and endpoint setup
    const modelId = "gemini-2.0-flash";
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${process.env.GEMINI_API_KEY}`;

    // Send request to Gemini API
    const response = await axios.post(
      endpoint,
      { contents: messages },
      { headers: { "Content-Type": "application/json" } }
    );

    // Extract reply from Gemini API response
    const reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text;

    // Send reply back to frontend
    res.status(200).json({ reply });
  } catch (error) {
    // Log error and send generic error message to frontend
    console.error("Error from Gemini:", error.response?.data || error.message);
    res.status(500).json({ reply: "Sorry, I couldn't process your request right now." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
