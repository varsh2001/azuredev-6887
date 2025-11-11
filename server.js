import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import { generateChat } from "./run_model.js";

dotenv.config();

const app = express();

// Set the allowed origin for CORS
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000"; // Default to local frontend

app.use(cors({
  origin: FRONTEND_URL, // Allow requests only from this origin
  credentials: true, // Allow cookies to be sent
}));
app.use(express.json());

// Session middleware
// Note: In a production environment, you would want to use a persistent session store.
// For this example, we are using the default in-memory store, which will lose session data on server restart.
app.use(session({
  secret: 'your-secret-key', // Replace with a real secret in a production environment
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using https
}));

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.get("/api/history", (req, res) => {
  if (!req.session.conversationHistory) {
    res.json([]);
  } else {
    res.json(req.session.conversationHistory);
  }
});

app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = String(req.body?.message ?? "").trim();
    if (!userMessage) return res.status(400).json({ error: "message is required in body" });

    // Initialize conversation history if it doesn't exist in the session
    if (!req.session.conversationHistory) {
      req.session.conversationHistory = [
        { role: "system", content: "You are an AI assistant that helps people find information." }
      ];
    }

    // Add user message to history
    req.session.conversationHistory.push({ role: "user", content: userMessage });

    const result = await generateChat(req.session.conversationHistory);

    // robust extraction of assistant text
    let assistantText = null;
    if (result?.choices && result.choices.length > 0) {
      const choice = result.choices[0];
      assistantText =
        choice?.message?.content ??
        choice?.message ??
        choice?.text ??
        (typeof choice === "string" ? choice : null);
    }

    // Add assistant response to history
    if (assistantText) {
      req.session.conversationHistory.push({ role: "assistant", content: assistantText });
    }

    res.json({ text: assistantText, raw: result });
  } catch (err) {
    console.error("API error:", err);
    res.status(500).json({ error: err?.message ?? "Internal server error" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));