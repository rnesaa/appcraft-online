import "dotenv/config";
import express from "express";
import OpenAI from "openai";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const port = Number(process.env.PORT || 3000);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.json({ limit: "30kb" }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/generate", async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "OPENAI_API_KEY is missing. Add it to your .env file and restart the server." });
    }
    const { idea, style = "", extra = "" } = req.body ?? {};
    if (typeof idea !== "string" || !idea.trim()) return res.status(400).json({ error: "Please describe your app." });
    if (idea.length > 12000 || String(extra).length > 3000) return res.status(400).json({ error: "Please shorten your description." });

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.5",
      instructions: `You are AppCraft, an expert product designer and frontend engineer. Generate a complete, polished, responsive single-file web application from the user's description. Output ONLY raw HTML, with no markdown fences or explanation. Include all CSS in a style tag and all JavaScript in a script tag. Make the app's core requested features genuinely interactive, not just a landing page. Use semantic HTML, accessible labels, mobile responsive design, clear empty states, and thoughtful visual hierarchy. Prefer localStorage for simple persistence when appropriate. Do not include external dependencies, external scripts, remote assets, network calls, or API secrets. Do not claim backend features that cannot work in a standalone file. If the requested app needs a server, implement the best useful local prototype and clearly indicate its limitation in the UI. Avoid unsafe dynamic HTML insertion for user-provided values; use textContent or safe DOM APIs. Do not include code that accesses parent windows or escapes the preview sandbox.`,
      input: `Build this app:\n${idea}\n\nDesign preference: ${style}\nAdditional instructions: ${extra}\n\nReturn a complete standalone HTML document.`
    });

    let html = response.output_text?.trim() || "";
    html = html.replace(/^```(?:html)?\s*/i, "").replace(/\s*```$/, "").trim();
    if (!/^<!doctype html|^<html[\s>]/i.test(html)) {
      return res.status(502).json({ error: "The model did not return a complete HTML document. Please try again with a clearer description." });
    }
    res.json({ html });
  } catch (error) {
    console.error("Generation error:", error?.message || error);
    res.status(500).json({ error: "AI generation failed. Check your API key, API billing, and connection, then try again." });
  }
});

app.listen(port, () => console.log(`AppCraft AI is running at http://localhost:${port}`));
