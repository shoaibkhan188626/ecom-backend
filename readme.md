# Backend Architecture Review Request

## Context
You are a senior backend engineer / system design reviewer.

I have built a **production-oriented Node.js (Express) backend** for an e-commerce system.
The project follows a layered architecture with security, validation, and authorization as first-class concerns.

This is NOT a tutorial project.  
Treat it as a real backend that could go to production with further work.

---

## Tech Stack
- Node.js (ESM)
- Express
- MongoDB (Mongoose)
- JWT (access + refresh tokens)
- Zod validation
- Centralized error handling
- Role & permission based authorization
- Security middlewares (rate limit, honeypot, hpp, helmet, cors)
- Background jobs
- OpenAPI docs
- Structured folder layout

---

## Folder Structure


---

## What I want from you (IMPORTANT)

### 1️⃣ Strengths
- Identify **what is done well**
- Call out **senior-level design decisions**
- Mention anything that shows production thinking

### 2️⃣ Weaknesses / Risks
- Architectural smells
- Security gaps
- Scalability or maintainability issues
- Overengineering OR underengineering
- Anything that would worry you in a real code review

### 3️⃣ Improvements (Actionable)
For each weakness, suggest:
- **What to improve**
- **Why**
- **How** (high-level, not full code)

### 4️⃣ Middleware & Auth Review
Specifically evaluate:
- Authentication flow
- Authorization (roles & permissions)
- Middleware ordering
- Error handling strategy

### 5️⃣ Production Readiness Score
Rate this backend on:
- Code organization
- Security
- Scalability
- Maintainability
- Overall production readiness

Give a **brutally honest score out of 10**, and justify it.

---

## Constraints
- Do NOT rewrite the entire project
- Do NOT suggest switching frameworks
- Focus on **incremental, realistic improvements**
- Assume this is a **solo developer aiming for backend/system roles**

---

## Tone
Be:
- Direct
- Honest
- Critical
- Practical

Avoid:
- Generic advice
- Tutorial explanations
- Surface-level comments

Treat this like a **real internal architecture review**.
