# FDRFlow — AICTE Security Deposit & Fixed Deposit Receipt (FDR) Management Portal

**Smart India Hackathon Prototype Edition**  
*A centralized, modern administrative portal designed to digitize how AICTE and technical institutions submit, track, audit, verify, and monitor statutory security deposits and Fixed Deposit Receipts (FDR).*

---

## 🏛️ Problem Statement Background
Under the **AICTE Approval Process Handbook (APH)**, thousands of affiliated technical institutions across India are legally required to maintain security deposits and joint corpus funds (typically ranging from ₹15 Lakhs to ₹1.5 Crores) locked under the joint lien of *The Member Secretary, AICTE, New Delhi*.

Historically, paper receipts submitted to regional offices led to:
1. **Misplaced / Damaged Physical Certificates:** Receipts degrading over 5–10 year lock-in periods.
2. **Overlooked Maturity Deadlines:** Banks releasing or rolling over deposits without AICTE knowledge because renewal demand notices were not issued in time.
3. **Manual Verification Bottlenecks:** Lack of a centralized ledger to audit scheduled commercial bank compliance, joint account titles, and lock-in norms.

**FDRFlow** resolves this by providing a unified digital ledger, intelligent automated countdowns, instant demand notice generation, and end-to-end verification workflows.

---

## 🚀 Key Implemented Features

### 1. 📊 Executive Financial Dashboard
- **Real-time KPI Cards:** Total FDRs, Total Deposit Volume (formatted in ₹ Crores & Lakhs), Pending Audit Queue, Verified Compliant Records, Approaching Maturity (<30 Days), and Matured/Overdue Deposits.
- **Actionable Banners:** High-priority alerts for deposits approaching maturity or awaiting officer verification with direct jump links.
- **Visual Analytics:**
  - Scheduled Bank Concentration (SBI, PNB, Canara Bank, BOB, HDFC, ICICI, etc.)
  - Verification Compliance breakdown
  - 4-Tier Maturity Horizon distribution (<30d, 31-90d, 90d+)
  - Deposit Allocation by mandated statutory purpose.

### 2. 🗄️ Centralized FDR Registry
- **Master Ledger Table:** Institution Name, AICTE Permanent ID, FDR Number, Bank, Branch, IFSC, Deposit Amount, Interest Rate, Issue & Maturity Dates, Days Remaining, Purpose, Verification Status, and Attached Document.
- **Search & Multi-Filtering:**
  - Real-time text search across institutions, IDs, FDR numbers, and bank branches.
  - Filter by Verification Status (`Verified`, `Pending Verification`, `Under Correction`, `Rejected`).
  - Filter by Maturity Window (Expiring <30d, Overdue, Upcoming <90d, Active).
  - Filter by Bank & Mandated Purpose.
  - Multi-criteria Sorting: By Maturity Date, Deposit Amount, Issue Date, Institution Name.
- **CRUD Operations:** Register new deposits, Edit existing parameters, and Delete with safe confirmation modals.

### 3. ✍️ Institutional FDR Registration (With Live Validation)
- Multi-section form: Institution Profile, Bank Details, Deposit Financials, and Receipt Attachment.
- **Form Validations:** Required field enforcement, maturity date strictly after issue date, amount > 0, IFSC format checking.
- **Document Attachment:** File upload supporting PDF/PNG/JPG or 1-click **"Generate Digital E-Receipt"** button for live demo presentations.
- Immediate real-time update of all registry tables and dashboard KPIs.

### 4. 🔍 Document Verification Desk
- Master-detail workflow for AICTE Finance Officers.
- Submissions queue filtered by status: *Pending Review*, *Under Correction*, *Verified*, and *Rejected*.
- **Statutory Checklist:** Scheduled commercial bank verification, joint lien title check, tenure compliance, and signature legibility.
- **Audit Actions:**
  - **Approve & Mark Verified:** Logs reviewing officer stamp and timestamp.
  - **Return for Correction:** Delivers deficiency instructions to the college.
  - **Reject Deposit:** Mandates formal rejection rationale.
- Immutable timestamped verification history audit trail.

### 5. ⏱️ Intelligent Maturity Radar & Demand Notice Generator
- Automatically calculates remaining days until maturity relative to system date.
- Highlights urgent deposits maturing within **30 days** and identifies **overdue** records.
- **AICTE Renewal Notice Generator:** Generates a formal, printable demand letter on official AICTE letterhead addressed to the College Principal and Bank Branch Manager citing FDR details and mandating 15-day compliance.
- **1-Click Term Extension:** Action to renew deposit for +3, +5, or +10 years with auto-updated maturity dates and ledger history.

### 6. 📈 Reports & CSV Export Engine
- Summary matrices of deposits by Bank and by Mandated Purpose.
- Institution-wise consolidated liability breakdown.
- **Downloadable CSV Reports (Excel UTF-8 BOM compatible):**
  - Download Full AICTE FDR Master Ledger (`.csv`)
  - Download Bank Exposure Summary (`.csv`)
  - Download Maturing & Overdue Liabilities (`.csv`)
- Official printable executive report layout.

### 7. 📜 Realistic Bank FDR Certificate Viewer
- Photorealistic Fixed Deposit Receipt modal with:
  - Bank header & IFSC
  - Red AICTE Joint Lien stamp: *"UNDER LIEN TO AICTE — NO LIQUIDATION WITHOUT NOC"*
  - Deposit amount in words and figures
  - Authorized branch manager seal and verification QR code
  - Print & export support.

### 8. 💾 Offline Persistence & Hackathon Demo Tools
- LocalStorage persistence under key `fdrflow_aicte_records_v1`.
- **Date Simulation Tool:** Allows judges to change the portal date to test how maturity countdowns recalculate dynamically.
- **Reset Demo Data Button:** Instantly restores the default Smart India Hackathon dataset.

---

## 🛠️ Technology Stack
- **Frontend Framework:** React 19 + Vite 8
- **Styling:** Modern Tailwind CSS + Custom Government Design System
- **Icons:** Lucide React
- **Persistence:** LocalStorage Engine (`storageService.js`)
- **Typography:** Inter & Merriweather (Official Government Serif)

---

## 💻 Running the Application Locally

1. Clone or navigate into the repository:
   ```bash
   cd sih
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

---

## ⚖️ Hackathon Disclaimer
*This project is a functional software prototype created for demonstration in the Smart India Hackathon. All institutional names, fixed deposit numbers, and banking details are synthetic and fictional for presentation purposes. It demonstrates the feasibility and architectural advantages of digitizing AICTE fixed deposit operations.*
