export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST." });
  const key = process.env.OPENAI_API_KEY;
  if (!key) return res.status(500).json({ error: "The site owner has not configured the AI API key yet." });
  const { idea, style = "", extra = "" } = req.body || {};
  if (typeof idea !== "string" || !idea.trim()) return res.status(400).json({ error: "Please describe your app." });
  if (idea.length > 12000 || String(extra).length > 2500) return res.status(400).json({ error: "Please shorten your requirements." });

  try {
    const upstream = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        instructions: `You are AppCraft, an expert product designer and frontend engineer. Create a complete, attractive, responsive single-file web app that fulfills the user's requirements. Output ONLY raw HTML, no markdown fences. Include CSS and JavaScript inline. Make requested features actually interactive, with clear navigation, accessible labels, empty states, responsive layout, and sensible UX. Prefer localStorage for non-sensitive local persistence. No external libraries, external scripts, remote assets, network requests, or secrets. Do not pretend server-dependent features work in a standalone file; make a useful local prototype and clearly note limitations in the app UI. Avoid eval and unsafe HTML injection. The app will run inside a sandboxed preview.`,
        input: `Build this app:\n${idea}\n\nDesign direction: ${style}\nAdditional requirements: ${extra}\n\nReturn a complete standalone HTML document.`
      })
    });
    const data = await upstream.json();
    if (!upstream.ok) {
      console.error("OpenAI API error", data?.error?.message || upstream.status);
      return res.status(502).json({ error: "AI request failed. Check the site's API key, model access, and API billing." });
    }
    let html = (data.output || []).flatMap(item => item.content || []).filter(item => item.type === "output_text").map(item => item.text).join("\n").trim();
    html = html.replace(/^```(?:html)?\s*/i, "").replace(/\s*```$/, "").trim();
    if (!/^<!doctype html|^<html[\s>]/i.test(html)) return res.status(502).json({ error: "AI did not return a complete HTML app. Try a clearer description." });
    return res.status(200).json({ html });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Could not reach the AI service. Try again." });
  }
}