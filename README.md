# DemoDay AI

<p align="center">
  <strong>Voice-first YC-style pitch practice and investor simulation</strong><br/>
  Powered by <strong>ElevenLabs Agents</strong>, <strong>Google Gemini (Vertex AI)</strong>, and <strong>RAG</strong> (Retrieval-Augmented Generation)
</p>

<p align="center">
  <a href="https://github.com/binaryshrey/DemoDay-AI"><img alt="GitHub Repo" src="https://img.shields.io/badge/GitHub-DemoDay--AI-181717?logo=github&logoColor=fff"/></a>
  <img alt="Stack" src="https://img.shields.io/badge/Stack-Next.js%20%7C%20FastAPI%20%7C%20Vertex%20AI%20%7C%20Supabase-4c51bf"/>
  <img alt="Voice" src="https://img.shields.io/badge/Voice-ElevenLabs%20Agents-000?logo=elevenlabs&logoColor=fff"/>
  <img alt="Deploy" src="https://img.shields.io/badge/Deploy-Cloud%20Run-4285F4?logo=googlecloud&logoColor=fff"/>
</p>

---

## What is DemoDay AI?

**DemoDay AI** is a voice-first pitch practice platform for founders. You deliver your pitch out loud, get realistic investor follow-up questions, and then receive **actionable, VC-style feedback** on:

- **Clarity:** can an investor repeat your company in one sentence?
- **Structure:** problem → solution → traction → market → business model → ask
- **Fundability:** what would block a partner from “leaning in”?
- **Next steps:** what to fix before the next investor meeting

All feedback is delivered via **natural voice** (ElevenLabs + Anam) and grounded via **RAG over Y Combinator talks / Demo Day guidance** plus **your own materials** (deck/docs).

> Repository: **https://github.com/binaryshrey/DemoDay-AI**

---

## Why this exists

Pitch feedback is usually:

- expensive (coaches / advisors),
- biased (friends are too nice),
- or slow (you don’t get iteration loops).

DemoDay AI is built for **fast iteration**: practice → pressure test → feedback → rewrite → repeat.

---

## ✨ What DemoDay AI Does

DemoDay AI simulates the pressure, flow, and expectations of a real investor meeting — without needing a VC in the room.

Founders can:

- Practice a pitch entirely through voice
- Handle tough follow-up questions (traction, market size, moat, GTM, etc.)
- Get real-time coaching mid-session (optional)
- Receive a structured post-session feedback report
- Hear the feedback read back naturally with pauses, emphasis, and tone

---

## 🔁 Core User Flow (end-to-end)

1. **Project Setup**

   - Create a project and provide:
     - pitch length (e.g., 60s / 2min / 5min)
     - language
     - website + GitHub
     - product description
     - optional attachments (deck, docs, notes)
   - These become part of the context used for evaluation and Q&A.

2. **Pitch Simulation (Voice Session)**

   - Start a voice session and deliver your pitch.
   - The **Pitch Agent** plays the role of a YC-style partner / investor.
   - The agent asks follow-ups based on what you said (and what you _didn’t_ say).

3. **Grounded Intelligence (RAG + Gemini)**

   - During the session and/or feedback generation:
     - The backend retrieves relevant YC guidance snippets (RAG)
     - Gemini uses those snippets to ground reasoning and feedback
   - This reduces hallucinations and keeps advice aligned with real investor patterns.

4. **Post-Session Feedback**
   - The backend generates a structured report:
     - category scores (clarity, problem, traction, market, ask…)
     - top strengths / risks
     - missing info checklist
     - pitch rewrite suggestion
     - follow-up questions you should be ready for
   - The **Feedback Agent** reads out a concise `tts_summary` so the user can absorb feedback instantly.

---

## 🧠 Key Features

### 🎙️ Voice-first investor simulation (ElevenLabs Agents)

- Natural back-and-forth conversation via speech
- Investor persona asks sharp, realistic questions
- Interruptions supported (feels like a real meeting)

### 🤖 Intelligence (Vertex AI Gemini)

- Gemini generates:
  - follow-up questions
  - structured feedback
  - rewritten pitch draft
  - “investor readiness” signals

### 📚 RAG-grounded coaching

- Uses YC demo day transcripts + founder talks + pitch guidance
- Retrieves top-K relevant snippets for each query
- Provides citations in the report for transparency

### 📊 Feedback report (visual + voice)

- Scoring rubric across pitch dimensions
- Actionable checklist of improvements
- Suggested rewrite of the pitch
- Spoken summary (`tts_summary`) so feedback is immediately usable

### 🗂️ Multi-project support

- Users can run multiple pitches (idea-stage vs traction-stage)
- Separate sessions and reports per project

### 🔐 Authentication & user scoping

- WorkOS AuthKit for login
- Projects/sessions/reports are scoped to a user

### ☁️ Cloud-native deployment

- FastAPI runs on Cloud Run
- Files stored in GCS
- Structured data stored in Supabase Postgres (pgvector)

---

## 🗺️ Architecture Overview

```mermaid
flowchart TB
  U[User] --> FE[Next.js Frontend]
  FE --> WO[WorkOS Auth]
  FE --> EL[ElevenLabs Agents]
  FE --> API[FastAPI Backend (Cloud Run)]

  EL --> API
  API --> DB[(Supabase Postgres + pgvector)]
  API --> GCS[(Google Cloud Storage)]
  API --> GEM[Vertex AI Gemini + Embeddings]

  API --> ANAM[Anam Avatar Playback]
  ANAM --> FE
```

---

## 🧱 Tech Stack

### Frontend

- **Next.js**
- **ElevenLabs Agents (WebSocket / SDK integration)**
- **Anam** for avatar-based voice playback
- **WorkOS** for authentication

### Backend

- **FastAPI**
- **Vertex AI Gemini** (reasoning + feedback generation)
- **Vertex AI Text Embeddings** (vectorization for RAG)
- RAG orchestration: retrieve → ground → generate

### Data & Infrastructure

- **Supabase Postgres + pgvector** (projects, sessions, chunks, reports)
- **Google Cloud Storage** (attachments, transcripts, audio, artifacts)
- **Cloud Run** (deployment)
- **Artifact Registry** (container images)

---

## 🔒 Authentication

Authentication is handled using **WorkOS AuthKit**.

On successful login:

- a user record is created/synced into Supabase
- all projects, sessions, and reports are scoped per user
- session tokens are issued to access the app securely

---

## 🧠 RAG (Retrieval-Augmented Generation)

DemoDay AI uses RAG to keep feedback realistic and grounded.

### Knowledge base sources

- Y Combinator Demo Day transcripts
- Founder talks
- Investor advice videos

### Pipeline

1. Transcripts are chunked into short segments (roughly 20–45 seconds)
2. Each chunk is embedded using **Vertex text embeddings**
3. Embeddings + metadata are stored in **Supabase pgvector**
4. At runtime:
   - the user’s query (or pitch) is embedded
   - top-K similar chunks are retrieved
   - chunks are fed into Gemini as grounding context

### Why this matters

- reduces hallucinations
- aligns feedback with real YC standards
- enables citations in reports (what the advice is based on)

---

## 🌐 API Overview (high-level)

### `POST /rag/retrieve`

**Use when:** you need YC context snippets for a query.  
**Returns:** top-K relevant transcript chunks with timestamps and sources.

### `POST /pitch/feedback`

**Use when:** you want a full VC-style evaluation of a pitch.  
**Internally calls** `/rag/retrieve` to ground feedback.  
**Returns:** structured scores + strengths/risks + rewrite + `tts_summary` + citations.

---

## 📁 Assets

UI components, icons, and branding assets are located at:

https://github.com/binaryshrey/DemoDay-AI/tree/main/demoday-app/assets

---

## ☁️ Deployment (judge-friendly)

Typical setup:

- **Frontend:** Netlify / Vercel / Cloudflare Pages
- **Backend:** Google Cloud Run
- **Storage:** Google Cloud Storage
- **AI:** Vertex AI Gemini + Embeddings
- **DB:** Supabase Postgres + pgvector

---

## 🏁 Hackathon Readiness (ElevenLabs Track)

This project satisfies the **ElevenLabs Challenge** requirements by:

- Using **ElevenLabs Agents** for end-to-end conversational voice interaction
- Leveraging **Google Cloud AI (Vertex AI Gemini + Embeddings)** for intelligence
- Using **RAG** to ground feedback in YC knowledge + user materials
- Delivering a fully voice-driven experience (pitch + feedback)

---

## 🧪 Demo / Video (3 minutes)

Add your demo link here once ready:

- YouTube:
- Vimeo:

Recommended structure:

1. 10s: what it does
2. 60s: pitch agent experience
3. 60s: feedback report + spoken summary
4. 30s: architecture highlights
5. 20s: closing / why it matters

---

## ✅ Roadmap / Next Improvements

- Add “stage mode” (idea / pre-seed / seed / Series A rubrics)
- Add “pitch timer” and pacing coaching (too fast / too slow)
- Add “traction verification prompts” (numbers + time windows)
- Add “deck-to-pitch alignment” (does your spoken pitch match slides?)
- Multi-language evaluation and localized investor expectations
- Team + role-based practice (C.E.O. vs C.T.O. pitch variants)

---

## 📜 License

Apache License 2.0
