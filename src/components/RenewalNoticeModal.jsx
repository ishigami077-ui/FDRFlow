import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Send, 
  Building2, 
  AlertTriangle,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

export function RenewalNoticeModal({ fdr, currentDate, onClose }) {
  if (!fdr) return null;

  const handlePrint = () => {
    window.print();
  };

  const noticeDate = formatDate(currentDate);

  return (
    <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full border border-slate-300 overflow-hidden my-6">
        {/* Modal Controls */}
        <div className="no-print bg-slate-100 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-slate-800 text-sm font-semibold">
            <FileText className="w-4 h-4 text-blue-700" />
            <span>AICTE Official Formal Maturity & Renewal Notice Letter</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Letter</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official AICTE Letterhead */}
        <div className="p-8 sm:p-12 text-slate-900 bg-white">
          {/* Header */}
          <div className="text-center border-b-2 border-slate-800 pb-5 mb-6">
            <div className="flex justify-center mb-2">
              <div className="w-12 h-12 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-xl shadow">
                ★
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-slate-900 uppercase">
              अखिल भारतीय तकनीकी शिक्षा परिषद
            </h1>
            <h2 className="text-base sm:text-lg font-serif font-semibold text-slate-800 uppercase tracking-wide">
              All India Council for Technical Education
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              (A Statutory Body of the Government of India, Ministry of Education)
            </p>
            <p className="text-[11px] text-slate-500">
              Nelson Mandela Marg, Vasant Kunj, New Delhi - 110070 • Website: www.aicte-india.org
            </p>
          </div>

          {/* Reference & Date */}
          <div className="flex justify-between items-center text-xs text-slate-700 mb-6">
            <div>
              <strong>Ref No:</strong> AICTE/FIN/FDR-MAT/2026/{fdr.id}
            </div>
            <div>
              <strong>Date:</strong> {noticeDate}
            </div>
          </div>

          {/* Addressee */}
          <div className="text-xs sm:text-sm text-slate-800 mb-6 space-y-4">
            <div>
              <p className="font-semibold">To,</p>
              <p className="font-bold text-slate-900">{fdr.contactPerson || 'The Principal / Director'},</p>
              <p>{fdr.institutionName}</p>
              <p className="text-slate-600">AICTE Permanent ID: {fdr.institutionId}</p>
              <p>{fdr.state}, India</p>
            </div>

            <div className="pt-2">
              <p className="font-semibold text-slate-700">Copy marked to:</p>
              <p className="font-medium text-slate-900">The Branch Chief Manager,</p>
              <p>{fdr.bankName}, {fdr.branchName}</p>
              <p className="text-slate-600">IFSC Code: {fdr.ifscCode}</p>
            </div>
          </div>

          {/* Subject */}
          <div className="bg-slate-100 p-3 rounded border border-slate-300 text-xs sm:text-sm font-bold text-slate-900 mb-6">
            SUBJECT: MANDATORY EXTENSION / RENEWAL OF FIXED DEPOSIT RECEIPT NO. {fdr.fdrNumber} (AMOUNT: {formatCurrency(fdr.amount)}) UNDER AICTE JOINT LIEN
          </div>

          {/* Body */}
          <div className="text-xs sm:text-sm text-slate-700 space-y-3.5 leading-relaxed text-justify mb-8">
            <p>Sir / Madam,</p>
            <p>
              With reference to the security deposit created towards <strong>"{fdr.purpose}"</strong>, this is to bring to your urgent notice that the Fixed Deposit Receipt bearing No. <strong>{fdr.fdrNumber}</strong> held with <strong>{fdr.bankName}</strong> for the principal value of <strong>{formatCurrency(fdr.amount)}</strong> is maturing / has matured on <strong>{formatDate(fdr.maturityDate)}</strong>.
            </p>
            <p>
              Under Chapter II of the AICTE Approval Process Handbook (APH), technical institutions are legally mandated to maintain active security deposits under the joint lien of <em>The Member Secretary, AICTE, New Delhi</em> throughout the operational tenure of the approved programs. No fixed deposit under AICTE lien can be liquidated, encashed, or transferred without prior written clearance / NOC from the Council.
            </p>
            <p>
              In view of the approaching / elapsed maturity deadline, you are hereby directed to:
            </p>
            <ol className="list-decimal pl-5 space-y-1.5 font-medium text-slate-800">
              <li>
                Approach the designated branch of <strong>{fdr.bankName}</strong> and immediately execute an extension / renewal of the said FDR for a further mandated period of <strong>3 or 5 years</strong>.
              </li>
              <li>
                Ensure the renewed FDR continues to explicitly carry the endorsement: <em>"Lien in favor of The Member Secretary, AICTE, New Delhi"</em>.
              </li>
              <li>
                Submit the original renewed receipt or upload a certified bank copy on the FDRFlow digital portal within <strong>15 days</strong> of receipt of this notice.
              </li>
            </ol>
            <p className="text-red-700 font-semibold text-xs">
              Failure to submit the renewed deposit receipt within the stipulated timeframe shall be viewed seriously and may invite regulatory actions, including withdrawal of approval for subsequent academic sessions.
            </p>
          </div>

          {/* Signatures */}
          <div className="flex justify-between items-end pt-6 border-t border-slate-300 text-xs">
            <div>
              <div className="text-[11px] text-slate-500 font-mono">
                System Reference: AICTE-DIGITAL-NOTC-{fdr.id}
              </div>
              <div className="text-[10px] text-slate-400">
                This is a digitally issued regulatory communication from the AICTE Finance Division.
              </div>
            </div>

            <div className="text-right">
              <div className="font-serif italic text-base text-blue-900 font-semibold mb-1">
                Dr. R. K. Sharma
              </div>
              <div className="font-bold text-slate-900">Finance Officer & Authorized Signatory</div>
              <div className="text-slate-600">All India Council for Technical Education</div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="no-print bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-between items-center text-xs">
          <div className="text-slate-600">
            Automated Notice Template • Recipient Email: <strong>{fdr.contactEmail || 'registrar@institute.ac.in'}</strong>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 font-semibold bg-slate-800 hover:bg-slate-900 text-white rounded transition-colors cursor-pointer"
          >
            Close Notice
          </button>
        </div>
      </div>
    </div>
  );
}
