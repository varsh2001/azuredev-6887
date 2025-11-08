import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { generateChat } from "./run_model.js";

dotenv.config();

const app = express();

// Set the allowed origin for CORS
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000"; // Default to local frontend

app.use(cors({
  origin: FRONTEND_URL, // Allow requests only from this origin
}));
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = String(req.body?.message ?? "").trim();
    if (!userMessage) return res.status(400).json({ error: "message is required in body" });

    const result = await generateChat(userMessage);

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

    res.json({ text: assistantText, raw: result });
  } catch (err) {
    console.error("API error:", err);
    res.status(500).json({ error: err?.message ?? "Internal server error" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));