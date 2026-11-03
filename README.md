# AppCraft AI

A local web app that uses the OpenAI Responses API to generate standalone HTML apps from natural-language descriptions.

## Requirements
- Node.js 20 or newer
- An OpenAI API key with API access/billing enabled

## Setup
1. Unzip this project.
2. Open a terminal in the `AppCraft-AI` folder.
3. Copy `.env.example` to `.env`.
4. Put your API key after `OPENAI_API_KEY=` in `.env`. Keep this file private; never upload it or share it.
5. Run:
   ```bash
   npm install
   npm start
   ```
6. Open http://localhost:3000 in your browser.

## Use
Describe the app, choose a design style, and click **Generate app**. Test it in the preview, then click **Download HTML**. The downloaded app is a standalone prototype.

## Publish a generated app
For a static app, save the downloaded file as `index.html`, put it in a folder, and deploy that folder using a static host such as Netlify Drop. Apps requiring accounts, shared databases, payments, or other server-side features need a backend and are not provided by a standalone HTML file.

## Security
The API key is used only by `server.js` on your computer and is never sent to the browser. Generated code is shown in a sandboxed iframe, but AI-generated code should still be reviewed before use. Do not use generated prototypes with sensitive or production data without proper security review.
