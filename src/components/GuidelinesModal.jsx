import React from 'react';
import { 
  X, 
  BookOpen, 
  ShieldCheck, 
  CheckCircle, 
  AlertTriangle, 
  HelpCircle,
  FileText,
  Landmark
} from 'lucide-react';

export function GuidelinesModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full border border-slate-300 overflow-hidden my-6">
        <div className="bg-blue-950 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-base font-bold text-white">AICTE Security Deposit & FDR Regulatory Guidelines</h2>
              <p className="text-xs text-blue-200">Approval Process Handbook (APH) Statutory Norms & Portal Verification Rules</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-blue-200 hover:text-white hover:bg-blue-900 rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-slate-700 max-h-[75vh] overflow-y-auto">
          {/* Section 1 */}
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
            <h3 className="text-sm font-bold text-blue-950 flex items-center gap-2 mb-2">
              <Landmark className="w-4 h-4 text-blue-700" />
              1. Permissible Banking Institutions
            </h3>
            <p className="text-slate-600 leading-relaxed mb-2">
              As per AICTE regulations, Fixed Deposit Receipts (FDR) can <strong>ONLY</strong> be accepted from:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-800">
              <li><strong>Nationalized Public Sector Banks</strong> (e.g., State Bank of India, Punjab National Bank, Canara Bank, Bank of Baroda, Union Bank of India).</li>
              <li><strong>Scheduled Commercial Private Sector Banks</strong> with RBI approval (e.g., HDFC Bank, ICICI Bank, Axis Bank).</li>
              <li><span className="text-red-700 font-semibold">Strictly Prohibited:</span> Urban / Rural Co-operative Banks, Non-Banking Financial Companies (NBFCs), and unapproved local credit societies.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
            <h3 className="text-sm font-bold text-blue-950 flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              2. Mandatory Joint Account & Lien Endorsement
            </h3>
            <p className="text-slate-600 leading-relaxed mb-2">
              Every FDR created by an affiliated institution must satisfy these statutory legal requirements:
            </p>
            <div className="bg-white p-3 rounded border border-slate-200 text-xs font-mono space-y-1 text-slate-800">
              <div><strong>Account Title:</strong> [Institution Name] & The Member Secretary, AICTE, New Delhi</div>
              <div><strong>Lien Clause:</strong> "Under Lien to AICTE. No partial or full liquidation permitted without formal written NOC from AICTE New Delhi."</div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
            <h3 className="text-sm font-bold text-blue-950 flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-indigo-700" />
              3. Typical Security Deposit Amounts & Lock-in Periods
            </h3>
            <div className="overflow-x-auto mt-2">
              <table className="w-full text-xs text-left border border-slate-200">
                <thead className="bg-slate-200 font-semibold text-slate-800">
                  <tr>
                    <th className="p-2 border">Category / Purpose</th>
                    <th className="p-2 border">Deposit Amount</th>
                    <th className="p-2 border">Mandatory Lock-in</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-2 border font-medium">New Technical Institution (Engineering)</td>
                    <td className="p-2 border">₹35 Lakhs to ₹1.00 Crore</td>
                    <td className="p-2 border">10 Years</td>
                  </tr>
                  <tr>
                    <td className="p-2 border font-medium">Management (MBA) / Computer Applications (MCA)</td>
                    <td className="p-2 border">₹15 Lakhs to ₹35 Lakhs</td>
                    <td className="p-2 border">5 Years</td>
                  </tr>
                  <tr>
                    <td className="p-2 border font-medium">New Integrated Course / Additional Division</td>
                    <td className="p-2 border">₹10 Lakhs to ₹25 Lakhs</td>
                    <td className="p-2 border">3 to 5 Years</td>
                  </tr>
                  <tr>
                    <td className="p-2 border font-medium">Joint Corpus Fund (Autonomous Colleges)</td>
                    <td className="p-2 border">₹50 Lakhs to ₹1.50 Crore</td>
                    <td className="p-2 border">5 Years (Renewable)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4 - Hackathon Solution Pitch */}
          <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50/70">
            <h3 className="text-sm font-bold text-blue-950 flex items-center gap-2 mb-2">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              How FDRFlow Solves the AICTE Problem Statement
            </h3>
            <p className="text-slate-700 leading-relaxed text-xs">
              Historically, AICTE regional offices managed thousands of paper FDR certificates across 10,000+ colleges in physical filing cabinets. This resulted in three critical problems:
            </p>
            <ol className="list-decimal pl-5 space-y-1.5 text-xs text-slate-800 mt-2">
              <li><strong>Lost & Damaged Physical Certificates:</strong> Physical receipts deteriorate or get misplaced over 5–10 years. FDRFlow creates an encrypted digital repository with instant retrieval.</li>
              <li><strong>Unnoticed Maturity Expirations:</strong> Banks frequently liquidate or revert expired FDRs when notices aren't sent in time. FDRFlow's Intelligent Maturity Radar automatically calculates countdowns and dispatches formal demand letters 30 days prior.</li>
              <li><strong>Verification Bottlenecks:</strong> Regional finance officers can now digitally review, mark joint lien compliance, return for deficiencies, or approve records with a complete audit trail.</li>
            </ol>
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold bg-blue-900 hover:bg-blue-950 text-white rounded transition-colors cursor-pointer"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
}
