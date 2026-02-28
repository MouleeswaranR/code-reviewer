# 🚀 SteveGuard  
## 🤖 AI-Powered GitHub Code Reviewer (RAG + Gemini AI)

SteveGuard is a full-stack AI-powered SaaS platform that automatically reviews your GitHub Pull Requests using **Retrieval Augmented Generation (RAG)** and **Google Gemini AI**.

It doesn't just generate feedback — it understands your entire codebase before reviewing your PR.

---

## 🌐 Live Website

👉 https://steve-guard-code-reviewer.vercel.app  

> ⚠️ Important: Use the **same email for GitHub login and subscription** to ensure proper billing synchronization.

---

# 🧠 What SteveGuard Does

- Automatically reviews GitHub Pull Requests  
- Uses full codebase context via RAG  
- Generates structured AI feedback  
- Posts review comments directly to GitHub  
- Tracks usage and subscription limits  
- Provides analytics dashboard  
- Manages repositories and reviews  

---

# 🛠️ Tech Stack

## ⚡ Frontend
- Next.js 16  
- React 19  
- TypeScript  
- Tailwind CSS 4  

## 🎨 UI
- shadcn/ui  
- Radix UI  

## 🖥️ Backend
- Next.js API Routes  
- Server Actions  

## 🗄️ Database
- PostgreSQL  
- Prisma ORM  

## 🧠 AI & RAG
- Google Gemini 2.5 Flash  
- text-embedding-004  
- Pinecone (Vector Database)

## 🔁 Background Jobs
- Inngest  

## 🔐 Authentication
- Better Auth  

## 💳 Payments
- Polar (Subscription SaaS billing)

## 📊 Data & Charts
- TanStack Query  
- Recharts  

## 🐙 GitHub Integration
- Octokit API  

## 📋 Forms & Validation
- React Hook Form + Zod  

---

# 🔥 Key Features

## 1️⃣ AI-Powered Code Reviews
- Context-aware PR reviews  
- Code walkthrough  
- Sequence diagrams  
- Strengths & weaknesses  
- Suggestions  
- Even AI-generated poems  

---

## 2️⃣ GitHub Integration
- Connect multiple repositories  
- Automatic webhook handling  
- Real-time review generation  
- Direct PR comment posting  

---

## 3️⃣ RAG Implementation
- Automatic codebase indexing  
- Vector embeddings  
- Semantic search  
- Context retrieval before AI review  

---

## 4️⃣ Dashboard & Analytics
- Repository stats  
- PR and commit tracking  
- GitHub contribution graph  
- Monthly activity breakdown  
- Usage tracking  

---

## 5️⃣ Subscription System
- Free Tier → 5 repos, 5 reviews per repo  
- Pro Tier → Unlimited usage  
- Polar checkout integration  
- Webhook-based subscription sync  
- Usage limit enforcement  

---

# 🚨 Production Challenges Faced & Solved

Local success ≠ Production success.

Here are the major deployment issues encountered:

---

### 1️⃣ GitHub Webhook 308 Redirect  
**Problem:** Trailing slash mismatch caused redirect failure.  
**Fix:** Matched webhook URL exactly to deployed endpoint.

---

### 2️⃣ PR Not Triggering  
**Problem:** Only limited PR actions were handled.  
**Fix:** Added support for `reopened` and `ready_for_review`.

---

### 3️⃣ Inngest Not Triggering in Production  
**Problem:** Vercel Deployment Protection blocked background jobs.  
**Fix:** Enabled automation bypass secret.

---

### 4️⃣ Prisma Tables Missing in Production  
**Problem:** Migrations weren’t applied to production DB.  
**Fix:** Ran Prisma migrations on Neon database.

---

### 5️⃣ Polar Checkout 400 Error  
**Problem:** `trustedOrigins` mismatch.  
**Fix:** Aligned origin exactly with production domain.

---

### 6️⃣ Polar Webhook 405 Error  
**Problem:** Wrong webhook endpoint path.  
**Fix:** Updated to `/api/auth/polar/webhooks`.

---

### 7️⃣ Sandbox vs Production Credential Mismatch  
**Problem:** Product ID, token, and webhook secret belonged to different environments.  
**Fix:** Ensured all billing credentials matched environment.

---

### 8️⃣ Subscription Not Updating After Payment  
**Problem:** React Query cached stale subscription state.  
**Fix:** Disabled stale cache and triggered manual refetch.

---

### 9️⃣ Webhook Event Order Issue  
**Problem:** `subscription.active` fired before `customer.created`.  
**Fix:** Added fallback logic to sync customer ID using email.

---

### 🔟 Success URL 404 Redirect  
**Problem:** Misconfigured `POLAR_SUCCESS_URL`.  
**Fix:** Corrected environment variable to exact production path.

---

# 💡 Key Learnings

- Implementing RAG in production  
- Building AI-powered SaaS systems  
- Handling webhook reliability  
- Managing subscription billing lifecycle  
- Production debugging strategies  
- Background job orchestration  
- Full-stack system architecture  

---

# 🚀 Project Status

✅ Fully deployed  
✅ Subscription SaaS model working  
✅ GitHub automation live  
✅ AI reviews functioning  
✅ Background jobs stable  

---

## ⭐ If you found this project interesting, feel free to star the repository!