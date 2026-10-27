import React from 'react';
import { 
  BookOpen, 
  ShieldCheck, 
  Landmark, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  HelpCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export function GuidelinesView({ onOpenAddModal }) {
  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-900">
            <BookOpen className="w-4 h-4 text-blue-700" />
            <span>AICTE Statutory Regulatory Framework</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif mt-1">
            Approval Process Handbook (APH) Security Deposit Regulations
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Official guidelines governing Fixed Deposit Receipts (FDR) created jointly under AICTE lien.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="px-4 py-2 text-xs font-semibold bg-blue-700 hover:bg-blue-800 text-white rounded-lg shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Register Compliant FDR</span>
        </button>
      </div>

      {/* Grid of Regulatory Mandates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Banking Mandates */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center space-x-3 text-blue-900">
            <div className="p-2.5 rounded-lg bg-blue-50 text-blue-700">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider">1. Eligible Banking Entities</h2>
              <span className="text-[11px] text-slate-500">Clause 4.1.2 of AICTE APH Regulations</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            All security deposits and corpus fund investments must be maintained in designated Scheduled Commercial Banks or Nationalized Public Sector Banks approved by RBI:
          </p>

          <ul className="space-y-1.5 text-xs text-slate-800">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span><strong>Nationalized Banks:</strong> SBI, PNB, Canara Bank, Bank of Baroda, Union Bank.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span><strong>Scheduled Commercial Private Banks:</strong> HDFC, ICICI, Axis Bank.</span>
            </li>
            <li className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
              <span><strong>Non-Permissible:</strong> Cooperative Urban/Rural Banks and NBFCs are strictly ineligible.</span>
            </li>
          </ul>
        </div>

        {/* Card 2: Joint Lien Mandates */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center space-x-3 text-blue-900">
            <div className="p-2.5 rounded-lg bg-blue-50 text-blue-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider">2. Joint Lien & Title Inscription</h2>
              <span className="text-[11px] text-slate-500">Statutory Legal Requirement</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Every deposit must be established in joint names and legally stamped with AICTE lien:
          </p>

          <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs font-mono space-y-1">
            <div className="text-slate-900">
              <strong>Account Title:</strong> [Institution Name] & The Member Secretary, AICTE, New Delhi
            </div>
            <div className="text-blue-900 text-[11px]">
              <strong>Mandatory Stamp:</strong> "Lien registered in favor of AICTE New Delhi. No partial or full liquidation permitted without formal written NOC from Council."
            </div>
          </div>
        </div>

        {/* Card 3: Mandated Tenures & Lock-In */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center space-x-3 text-blue-900">
            <div className="p-2.5 rounded-lg bg-blue-50 text-blue-700">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider">3. Mandated Deposit Scales & Tenures</h2>
              <span className="text-[11px] text-slate-500">Security Deposit Slabs by Category</span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2 rounded bg-slate-50 border border-slate-100 flex justify-between">
              <div>
                <strong className="text-slate-900 block">Establishment of New Engineering College</strong>
                <span className="text-slate-500">Tenure: 10 Years Minimum</span>
              </div>
              <span className="font-bold text-blue-900 font-mono text-sm">₹35L – ₹1.00 Cr</span>
            </div>

            <div className="p-2 rounded bg-slate-50 border border-slate-100 flex justify-between">
              <div>
                <strong className="text-slate-900 block">Management (MBA/PGDM) or MCA Course</strong>
                <span className="text-slate-500">Tenure: 5 Years</span>
              </div>
              <span className="font-bold text-blue-900 font-mono text-sm">₹15L – ₹35 Lakh</span>
            </div>

            <div className="p-2 rounded bg-slate-50 border border-slate-100 flex justify-between">
              <div>
                <strong className="text-slate-900 block">New Technical Course / Division Addition</strong>
                <span className="text-slate-500">Tenure: 3 to 5 Years</span>
              </div>
              <span className="font-bold text-blue-900 font-mono text-sm">₹10L – ₹25 Lakh</span>
            </div>
          </div>
        </div>

        {/* Card 4: SIH Solution Architecture */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center space-x-3 text-blue-900">
            <div className="p-2.5 rounded-lg bg-amber-50 text-amber-700">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider">4. Smart India Hackathon Innovation</h2>
              <span className="text-[11px] text-slate-500">Transforming Paper Chaos into Digital Governance</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Prior to <strong>FDRFlow</strong>, over 10,000 institutions submitted physical paper receipts to regional offices. This led to:
          </p>

          <ul className="space-y-1.5 text-xs text-slate-800">
            <li className="flex items-center gap-2">
              <ArrowRight className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span><strong>Paper Loss:</strong> Receipts lost or damaged during the 5–10 year lock-in period.</span>
            </li>
            <li className="flex items-center gap-2">
              <ArrowRight className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span><strong>Overlooked Maturities:</strong> Banks reverting uncollected funds when Council notices weren't delivered.</span>
            </li>
            <li className="flex items-center gap-2">
              <ArrowRight className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span><strong>Solution:</strong> Automated maturity countdowns, instant demand letters, and encrypted e-ledger audit trails.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
