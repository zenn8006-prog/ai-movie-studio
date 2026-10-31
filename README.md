# AI Movie Studio — 3-AI Hybrid MVP

A Next.js starter for movie recap and subtitle workflows using:
- Google Gemini: video/scene analysis
- Groq: audio transcription with timestamps
- OpenRouter: translation, synthesis and final review

## Hybrid workflow
1. Gemini video analysis and Groq audio transcription run in parallel.
2. OpenRouter receives both outputs and creates the final recap or translated subtitle.
3. If one parallel provider fails, the other can still continue. The UI reports fatal errors; extend it to display `partialFailures` if desired.

## Requirements
- Node.js 20+
- FFmpeg binary supplied by `ffmpeg-static`
- API keys for at least two selected providers. For the full three-stage workflow, configure all three.

## Run locally
```bash
npm install
cp .env.example .env.local
# Add keys to .env.local, or enter them in the UI for a single run.
npm run dev
```
Open http://localhost:3000

## API key handling
Keys typed into the UI are sent to the server only with that processing request and are not stored by this starter. For a real deployment, use authentication and an encrypted server-side secret store; do not save provider keys in localStorage or expose them in client-side code.

## Models
Default model IDs are editable in the UI. Check your provider account and model availability before running:
- Gemini default: `gemini-3.8-flash`
- Groq default: `whisper-large-v3`
- OpenRouter default: `google/gemini-2.5-flash`

## MVP limits and production work
- Upload limit is 100 MB in this starter. Long movies need resumable/cloud object storage and a background job queue.
- Groq transcription uses FFmpeg to extract one mono 16 kHz MP3 audio track. For larger files, chunk audio and merge timestamp offsets.
- Subtitle MVP translates Groq's timestamped segments via OpenRouter. Review timing, line length and speaker labels before publishing.
- Add user authentication, job persistence, progress streaming, cancellation, per-user quotas, retries/backoff, cost estimates, and secure encrypted API key management before public deployment.
- Ensure you have rights or permission to process and publish any uploaded movie. The app does not bypass DRM or access controls.

## Provider documentation
- Gemini video understanding: https://ai.google.dev/gemini-api/docs/video-understanding
- Groq speech-to-text: https://console.groq.com/docs/speech-to-text
- OpenRouter chat completions: https://openrouter.ai/docs/api/api-reference/chat/send-chat-completion-request
