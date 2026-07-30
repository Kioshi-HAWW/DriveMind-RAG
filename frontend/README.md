# 🌐 DriveMind RAG — Vercel Frontend

A high-performance Next.js 14 web application designed specifically for **Vercel** deployment, providing a dark library UI to chat with your Google Drive knowledge base via your Render FastAPI backend.

---

## 🚀 How to Deploy on Vercel (1-Click or GitHub Link)

### Option 1: Via Vercel Dashboard (Recommended)

1. **Push code to GitHub** (if not already done).
2. Open [Vercel Dashboard](https://vercel.com/new) and click **Add New Project**.
3. Import your `DriveMind-RAG` GitHub repository.
4. In the Project Setup screen:
   - **Root Directory**: Select `frontend` (click Edit -> select `frontend`).
   - **Framework Preset**: Next.js
   - **Environment Variables**:
     - Key: `NEXT_PUBLIC_API_URL`
     - Value: `https://drivemind-rag-1.onrender.com` *(or your custom Render backend URL)*
5. Click **Deploy**. Vercel will build and host your site on a free `.vercel.app` URL!

---

### Option 2: Deploying with Vercel CLI

```bash
cd frontend
npx vercel
```

Follow the prompts, set `NEXT_PUBLIC_API_URL` when asked, and Vercel will deploy your application immediately.

---

## 🛠️ Features

- **Grounded Vector Answers**: Interactive AI chat powered by Gemini and Qdrant Cloud.
- **Source Citation Chips**: View exact document names, pages, and direct Google Drive file links (`drive_link`).
- **Live Backend Health Indicator**: Real-time checking of your Render backend status (`/health`).
- **One-Click Drive Synchronization**: Trigger background document ingestion (`/ingest`) directly from the UI settings drawer.
- **Dynamic API URL Switcher**: Test or switch Render backend URLs on the fly from the UI without rebuilding.
- **Dark Theme**: Curated dark library color palette with gold accents (`#D9A441`).

---

## 💻 Local Development

```bash
# 1. Enter frontend folder
cd frontend

# 2. Install dependencies
npm install

# 3. Create .env.local file
cp .env.example .env.local

# 4. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
