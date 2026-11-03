# AppCraft Online

A Vercel-ready AI app generator. Users describe an app; a serverless API calls the OpenAI Responses API and returns a standalone HTML prototype for preview and download.

## Deploy online (no local Node.js needed)
1. Create a GitHub account if you do not have one.
2. Create a new repository and upload the contents of this folder.
3. Sign in to Vercel and choose **Add New → Project**; import that GitHub repository.
4. In the Vercel project settings, add an Environment Variable:
   - Name: `OPENAI_API_KEY`
   - Value: your OpenAI API key
5. Optionally add `OPENAI_MODEL` with a model available to your API account. The default is `gpt-4.1-mini`.
6. Deploy. Open the Vercel URL.

The API key is kept server-side in Vercel's environment variables; it is not embedded in the public website.

## Notes
- OpenAI API access and billing are separate from ChatGPT subscriptions.
- Generated apps are standalone HTML prototypes. Apps requiring authentication, shared data, or server-side functionality need additional backend work.
- Review generated code before using it with real users or sensitive data.
