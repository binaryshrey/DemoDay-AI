# DemoDay AI ![Next.js](https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=white) ![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white) ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white) ![GCS](https://img.shields.io/badge/Google%20Cloud%20Storage-4285F4?logo=googlecloud&logoColor=white) ![Cloud Run Deployed](https://img.shields.io/badge/Cloud%20Run-Deployed-4285F4?logo=googlecloud&logoColor=white) ![Vertex AI](https://img.shields.io/badge/Vertex%20AI-Active-success?logo=googlecloud) ![Google Gemini](https://img.shields.io/badge/Google%20Gemini-Active-success?logo=google) ![WorkOS Auth](https://img.shields.io/badge/WorkOS%20Auth-Enabled-success?logo=workos) ![Upstash Redis](https://img.shields.io/badge/Upstash%20Redis-success-00E9A3?logo=redis&logoColor=white)  ![Anam Avatars](https://img.shields.io/badge/Anam%20Avatars-1F3C88?logo=anam&logoColor=white) ![ElevenLabs](https://img.shields.io/badge/Voice-ElevenLabs%20Agents-000?logo=elevenlabs&logoColor=fff)  ![Vercel Deploy](https://deploy-badge.vercel.app/vercel/demo-day-ai) ![BetterStack deployments](https://img.shields.io/github/deployments/binaryshrey/bubbles/production?style=flat&logo=betterstack&label=betterstack) 



DemoDay AI is a voice-first AI pitch coach that helps founders raise capital by practicing and refining their investor pitch through real-time AI voice conversations. Powered by ElevenLabs, Google Gemini on Vertex AI and RAG grounded in Y-Combinator startup knowledge and investor insights stored in Google CloudStorage and deployed over Google CloudRun, it enables founders to pitch out loud, handle challenging follow-up questions and receive clear, investor-grade feedback.

![Banner](https://raw.githubusercontent.com/binaryshrey/DemoDay-AI/refs/heads/main/demoday-app/assets/banner_web.webp)



## Introducing DemoDay AI

DemoDay AI is a voice-first AI pitch coach platform for founders that simulates a real investor meeting end to end. Founders deliver their pitch out loud, face realistic VC-style follow-up questions and receive actionable, structured feedback on clarity, structure, fundability and concrete next steps—so they can iterate fast before real investor conversations.

Unlike expensive coaches, biased friends or slow feedback loops, DemoDay AI is built for rapid iteration: `pitch → pressure test → feedback → rewrite → repeat`. It evaluates whether an investor can repeat your company in one sentence, whether the narrative flows, what would block a partner from leaning in and exactly what to fix before the next meeting.

The experience is fully voice-driven, using natural spoken feedback (ElevenLabs + Anam) with realistic tone, pacing and emphasis. Under the hood, feedback is grounded via RAG over Y Combinator talks and Demo Day guidance, combined with your own materials (pitch deck, docs) to ensure advice reflects real investor expectations—not generic tips.

DemoDay AI lets founders:

- Practice pitches entirely through voice
- Handle tough investor follow-ups (traction, TAM, moat, GTM, etc.)
- Get optional real-time coaching mid-session
- Receive a structured post-session feedback report


## Built With

Frontend
- Next.js — web application framework
- Tailwind CSS — UI styling
- ElevenLabs Agents — real-time voice interaction (WebSocket / SDK)
- Anam — avatar-based voice playback
- WorkOS — authentication and identity

Backend & AI
- FastAPI — backend API framework
- Google Vertex AI Gemini — reasoning, pitch evaluation, feedback generation
- Vertex AI Text Embeddings — vectorization for retrieval-augmented generation (RAG)
- RAG Pipeline — retrieve → ground → generate (YCombinator startup knowledge base + Investor Insights)

Data & Storage
- Supabase Postgres + pgvector — projects, sessions, embeddings, reports
- Google Cloud Storage — pitch decks, transcripts, audio, artifacts
  
Infrastructure & Deployment
- Cloud Run — containerized backend deployment
- Artifact Registry — container image storage
- Vercel — frontend deployment

Observability & Performance
- BetterStack — deployment & service monitoring

Voice & Real-Time Systems
- ElevenLabs — natural voice synthesis and agents
- Anam Avatars — expressive avatar delivery


## Architecture Overview

![Architecture](https://raw.githubusercontent.com/binaryshrey/DemoDay-AI/refs/heads/main/demoday-app/assets/sequence_diagram.png)


## Key Features

### 🎙 Voice-First Investor Simulation

- Real-time investor conversations powered by ElevenLabs Agents
- Natural back-and-forth dialogue entirely via speech
- Sharp, realistic investor personas that probe clarity, traction, and conviction
- Supports interruptions and follow-ups to mirror real meeting dynamics

![Feedback](https://raw.githubusercontent.com/binaryshrey/DemoDay-AI/refs/heads/main/demoday-app/assets/pitch.png)
<br/>

### 🤖 AI-Powered Intelligence (Vertex AI Gemini)

Gemini drives core reasoning and evaluation:

- Context-aware follow-up questions
- Structured, investor-style feedback
- Suggested pitch rewrites
- Clear “investor readiness” signals and red flags

![Gemini](https://raw.githubusercontent.com/binaryshrey/DemoDay-AI/refs/heads/main/demoday-app/assets/gemini.png)
<br/>
<br/>

### 📚RAG (Retrieval-Augmented Generation)
DemoDay AI uses RAG to keep feedback realistic and grounded.

#### Knowledge base sources
- Y Combinator Demo Day transcripts
- Founder talks
- Investor advice videos


#### Pipeline
1. Transcripts are chunked into short segments (roughly 20–45 seconds)
2. Each chunk is embedded using Vertex text embeddings
3. Embeddings + metadata are stored in Supabase pgvector
4. At runtime:
   - the user’s query (or pitch) is embedded
   - top-K similar chunks are retrieved
   - chunks are fed into Gemini as grounding context
  

#### Significance
- reduces hallucinations
- aligns feedback with real YC standards
- enables citations in reports (what the advice is based on)

![RAG](https://raw.githubusercontent.com/binaryshrey/DemoDay-AI/refs/heads/main/demoday-app/assets/GoogleRAGStore.png)
<br/>
<br/>


📊 Actionable Feedback Reports (Visual + Voice)

- Scoring rubric across key pitch dimensions
- Concrete, prioritized improvement checklist
- Suggested pitch rewrite based on the session
- Concise spoken summary (tts_summary) for instant absorption
![FeedbackAI](https://raw.githubusercontent.com/binaryshrey/DemoDay-AI/refs/heads/main/demoday-app/assets/feedbackai.png)
![Feedback](https://raw.githubusercontent.com/binaryshrey/DemoDay-AI/refs/heads/main/demoday-app/assets/feedback.png)
<br/>
<br/>

🗂 Multi-Project & Session Support

- Multiple projects per user (idea-stage, traction-stage, fundraising)
- Independent sessions and reports for each pitch
- Track progress across iterations
![Dashboard](https://raw.githubusercontent.com/binaryshrey/DemoDay-AI/refs/heads/main/demoday-app/assets/dashboard.png)
<br/>
<br/>

🔐 Authentication & User Scoping

- Secure login via WorkOS AuthKit
- All projects, sessions, and reports scoped to individual users
![Dashboard](https://raw.githubusercontent.com/binaryshrey/DemoDay-AI/refs/heads/main/demoday-app/assets/signup.png)
<br/>
<br/>

☁️ Cloud-Native Architecture

- FastAPI backend deployed on Cloud Run
- Audio, decks, transcripts stored in Google Cloud Storage
- Structured data and embeddings in Supabase Postgres + pgvector
![Dashboard](https://raw.githubusercontent.com/binaryshrey/DemoDay-AI/refs/heads/main/demoday-app/assets/GoogleCloudRun.png)
![Dashboard](https://raw.githubusercontent.com/binaryshrey/DemoDay-AI/refs/heads/main/demoday-app/assets/GCPBuckets.png)
![Dashboard](https://raw.githubusercontent.com/binaryshrey/DemoDay-AI/refs/heads/main/demoday-app/assets/dbschema.png)


## Core User Flow (Founder → Investor Simulation → Feedback)

### 1. Onboarding & Project Setup
The founder signs in and creates a new pitch project, defining the context the Google Gemini AI will use throughout the session.

They provide:
- Pitch length (e.g. 60s / 2min / 5min)
- Language
- Product description
- Website + GitHub Repo (optional)
- Attachments (pitch deck, docs, notes)

These inputs are:
- Stored in the project workspace
- Uploaded to Google Cloud Storage
- Indexed and embedded for retrieval (RAG)

This ensures all evaluation and questioning is grounded in the founder’s actual materials, not generic assumptions.

### 2. Start Pitch Simulation (Live Voice Session)

The founder clicks Start Pitch and enters a live, voice-based session.

The founder delivers their pitch out loud
- A Pitch Agent (investor persona) listens in real time
- The agent behaves like a YCombinator-style partner:
  - Interrupts naturally
  - Probes unclear areas
  - Challenges missing or weak signals

All interaction happens entirely through voice, simulating the flow and pressure of a real investor meeting.


### 3. Real-Time Reasoning & Questioning

During the session:

- The backend continuously:
  - Tracks what was said
  - Detects gaps, weak claims, or missing signals
  - Relevant YC / Demo Day guidance is retrieved via RAG

- Gemini uses this grounded context to:
  - Generate realistic follow-up questions
  - Provide optional in-session coaching nudges
  - Adapt questioning based on founder responses

This keeps questions context-aware, non-generic and investor-realistic.


### 4. Session Completion & Data Capture

Once the pitch session ends:
- Audio and transcripts are stored
- The session is marked complete
- A feedback-generation job is triggered asynchronously

At this point, the founder is done speaking and feedback is generated.


### 5. Structured Post-Session Feedback Report

The backend generates a comprehensive investor-style report, including:

- Category scores (clarity, problem, traction, market, ask, etc.)
- Top strengths and red flags
- Missing information checklist
- Pitch rewrite suggestions
- Follow-up questions the founder should expect in real meetings

All feedback is:
- Grounded in YCombinator guidance
- Tailored to what the founder actually said
- Focused on fundability, not polish alone


### 6. Voice Feedback Playback (Instant Absorption)

To reduce cognitive load:
- A Feedback Agent reads out a concise spoken summary
- Delivered with natural tone, pauses and emphasis
- Optionally rendered through an avatar for presence

The founder can:
- Listen immediately
- Review the full report afterward
- Iterate and start another session


### 7. Iterate Fast

Founders repeat the loop:

`Pitch → Pressure Test → Feedback → Rewrite → Repeat`

No scheduling, no bias, no waiting.



## API Overview (high-level)

#### `POST /rag/retrieve`

Use when: you need YC context snippets for a query.  
Returns: top-K relevant transcript chunks with timestamps and sources.

#### `POST /pitch/feedback`

Use when: you want a full VC-style evaluation of a pitch.  
Internally calls `/rag/retrieve` to ground feedback.  
Returns: structured scores + strengths/risks + rewrite + `tts_summary` + citations.

![API Docs](https://raw.githubusercontent.com/binaryshrey/DemoDay-AI/refs/heads/main/demoday-app/assets/apidocs.png)


## Assets

UI components, icons, and branding assets are located at:
`https://github.com/binaryshrey/DemoDay-AI/tree/main/demoday-app/assets`


![ColorPalatte](https://raw.githubusercontent.com/binaryshrey/DemoDay-AI/refs/heads/main/demoday-app/assets/color_pallete.png)


## Development Setup
```
git clone https://github.com/binaryshrey/DemoDay-AI.git
cd demoday-app
npm i
npm run dev

on root:
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Configs
- Create a .env file for UI under /backend folder
```
GOOGLE_CLOUD_PROJECT=XXXXX-XXXXX
VERTEX_LOCATION=XXXXX-XXXXX

DATABASE_URL=XXXXX-XXXXX
SUPABASE_URL=XXXXX-XXXXX
SUPABASE_SERVICE_ROLE_KEY=XXXXX-XXXXX

GCP_PROJECT_ID=XXXXX-XXXXX
GCS_BUCKET_NAME=XXXXX-XXXXX
```

- Create a .env file for UI under /demoday-app folder
```
WORKOS_CLIENT_ID=XXXXX-XXXXX
WORKOS_API_KEY=XXXXX-XXXXX
WORKOS_COOKIE_PASSWORD=XXXXX-XXXXX

NEXT_PUBLIC_WORKOS_REDIRECT_URI=XXXXX-XXXXX

ANAM_INVESTOR_API_KEY=XXXXX-XXXXX
ANAM_INVESTOR_AVATAR_ID=XXXXX-XXXXX
ELEVENLABS_INVESTOR_AGENT_ID=XXXXX-XXXXX

ANAM_AUTH_URI=XXXXX-XXXXX

GCP_PROJECT_ID=XXXXX-XXXXX
GCS_BUCKET_NAME=XXXXX-XXXXX

UPSTASH_REDIS_REST_URL=XXXXX-XXXXX
UPSTASH_REDIS_REST_TOKEN=XXXXX-XXXXX
```

## License

Apache License 2.0
