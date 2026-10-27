# NexusTrack 🚀

**NexusTrack** is an enterprise technical mentorship operations and daily trainee tracking platform designed for Nava Yuva Bharati Infotech (NYB Infotech). It automates trainee email submission processing, performs AI-assisted rubric verification, synchronizes with corporate SharePoint Excel status reports, and generates consolidated daily Team Lead (TL) reports.

---

## ✨ Features

- **Automated Mailbox Ingestion:** Background IMAP scanner for both Gmail and Microsoft 365 / Outlook accounts.
- **AI-Powered Code & Audit Verification:** Google Gemini integration to review trainee submissions, detect missing files/zip attachments, and score technical progress against daily syllabus requirements.
- **Bi-Directional SharePoint & Excel Synchronization:** Real-time updates to official daily status workbooks with exact SharePoint formatting and formula preservation.
- **Dynamic TL Daily Report Generator:** Automatically aligns daily progress with the 5-day curriculum (React Fundamentals, Props & State, Component Communication, Reducers/Hooks, and Context API Capstone) and generates ready-to-send Outlook drafts and `.eml` files.
- **Live Interactive Dashboard:** Multi-batch view (Batch 3 & Batch 4) with real-time status indicators, discrepancy notices, and standup tracking.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org) (App Router) & [React 19](https://react.dev)
- **Styling:** Tailwind CSS & Lucide Icons
- **Database:** MongoDB & Mongoose
- **Email Protocol:** `imap-simple`, `mailparser`, and `nodemailer`
- **Spreadsheet Engine:** `exceljs` & `xlsx`
- **AI Engine:** Google Gemini API (`@google/genai`)

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Khan-pathan33/nexustrack.git
cd nexustrack
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Copy the template configuration file:
```bash
cp .env.example .env.local
```
Edit `.env.local` with your actual MongoDB URI, Google App Passwords, and Gemini API keys.

> **Security Note:** `.env.local` contains private credentials and is strictly excluded via `.gitignore`. Never commit `.env.local` to public repositories.

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3002](http://localhost:3002) in your browser.

### 5. Start the background mail scanner (optional)
```bash
npm run worker:gmail
```

---

## 📄 License
Internal proprietary software for Nava Yuva Bharati Infotech (NYB Infotech). All rights reserved.
