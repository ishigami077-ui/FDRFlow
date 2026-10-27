import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  ShieldCheck, 
  Building2, 
  Landmark, 
  FileCheck2, 
  AlertCircle, 
  CheckCircle2,
  QrCode
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

// Number to words helper for Indian currency
function numberToWordsINR(amount) {
  const num = Math.floor(Number(amount));
  if (num === 0) return 'Zero';
  if (num === 5000000) return 'Fifty Lakh Rupees Only';
  if (num === 3500000) return 'Thirty Five Lakh Rupees Only';
  if (num === 6000000) return 'Sixty Lakh Rupees Only';
  if (num === 10000000) return 'One Crore Rupees Only';
  if (num === 4000000) return 'Forty Lakh Rupees Only';
  if (num === 7500000) return 'Seventy Five Lakh Rupees Only';
  if (num === 2500000) return 'Twenty Five Lakh Rupees Only';
  if (num === 3000000) return 'Thirty Lakh Rupees Only';
  if (num === 5500000) return 'Fifty Five Lakh Rupees Only';
  if (num === 4500000) return 'Forty Five Lakh Rupees Only';
  if (num === 8000000) return 'Eighty Lakh Rupees Only';
  if (num === 12000000) return 'One Crore Twenty Lakh Rupees Only';
  
  if (num >= 10000000) {
    const cr = (num / 10000000).toFixed(2);
    return `${cr} Crore Rupees Only`;
  }
  if (num >= 100000) {
    const lk = (num / 100000).toFixed(2);
    return `${lk} Lakh Rupees Only`;
  }
  return `${num.toLocaleString('en-IN')} Rupees Only`;
}

export function FDRCertificateModal({ fdr, onClose }) {
  if (!fdr) return null;

  const handlePrint = () => {
    window.print();
  };

  const amountInWords = numberToWordsINR(fdr.amount);

  return (
    <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full border border-slate-300 overflow-hidden my-6">
        {/* Top Modal Controls (Hidden in print) */}
        <div className="no-print bg-slate-100 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-slate-800 text-sm font-semibold">
            <Landmark className="w-4 h-4 text-blue-700" />
            <span>Official Fixed Deposit Receipt (E-FDR Viewer)</span>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono">
              {fdr.fdrNumber}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Certificate</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official FDR Certificate Layout */}
        <div className="p-8 sm:p-10 bg-[#FFFEF9] text-slate-900 relative">
          {/* Subtle Guilloche / Bank Security Border */}
          <div className="border-4 border-double border-slate-700 p-6 sm:p-8 rounded relative overflow-hidden bg-white/70">
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]">
              <span className="text-7xl font-bold tracking-widest text-slate-900 uppercase -rotate-25">
                AICTE JOINT LIEN
              </span>
            </div>

            {/* Bank Header */}
            <div className="flex items-start justify-between border-b-2 border-slate-800 pb-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded bg-blue-900 text-white flex items-center justify-center font-bold text-xl shadow">
                  {fdr.bankName?.charAt(0) || 'B'}
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 tracking-tight">
                    {fdr.bankName}
                  </h1>
                  <p className="text-xs text-slate-600 font-medium">
                    Branch: {fdr.branchName} • IFSC: <span className="font-mono">{fdr.ifscCode}</span>
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  SCHEDULED COMMERCIAL BANK
                </div>
                <div className="text-sm font-mono font-bold text-blue-900 mt-0.5">
                  FDR REF: {fdr.fdrNumber}
                </div>
                <div className="text-[11px] text-slate-600">
                  Date of Issue: <strong>{formatDate(fdr.issueDate)}</strong>
                </div>
              </div>
            </div>

            {/* Certificate Title */}
            <div className="text-center my-4">
              <span className="text-xs tracking-widest uppercase text-slate-500 font-semibold">
                GOVERNMENT / REGULATORY TERM DEPOSIT RECEIPT
              </span>
              <h2 className="text-lg sm:text-xl font-bold font-serif text-slate-900 uppercase tracking-wide mt-1">
                Fixed Deposit Receipt Under AICTE Lien
              </h2>
            </div>

            {/* Beneficiary & Joint Holder Box */}
            <div className="bg-slate-50 border border-slate-300 rounded p-4 mb-6 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase block">
                    Account Title / Depositor Name:
                  </span>
                  <strong className="text-slate-900 font-semibold block text-sm">
                    {fdr.institutionName}
                  </strong>
                  <span className="text-xs text-slate-600 font-mono">
                    AICTE Permanent ID: {fdr.institutionId}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase block">
                    Joint Beneficiary / Lienholder:
                  </span>
                  <strong className="text-blue-900 font-bold block text-sm">
                    The Member Secretary, AICTE, New Delhi
                  </strong>
                  <span className="text-xs text-slate-600">
                    Joint A/C: <span className="font-mono">{fdr.accountNumber || 'AICTE-JT-RECORD'}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Financial Details Table */}
            <div className="border border-slate-300 rounded overflow-hidden mb-6 text-xs sm:text-sm">
              <table className="w-full text-left">
                <tbody>
                  <tr className="border-b border-slate-200 bg-slate-100/70 font-semibold text-slate-700">
                    <td className="p-2.5 w-1/3">Principal Deposit Sum</td>
                    <td className="p-2.5 w-1/3">Interest Rate (% p.a.)</td>
                    <td className="p-2.5 w-1/3">Maturity Date</td>
                  </tr>
                  <tr className="border-b border-slate-200 font-medium">
                    <td className="p-3 text-lg font-bold text-slate-900">
                      {formatCurrency(fdr.amount)}
                    </td>
                    <td className="p-3 text-base text-slate-800">
                      {fdr.interestRate}% p.a.
                    </td>
                    <td className="p-3 text-base font-bold text-blue-950">
                      {formatDate(fdr.maturityDate)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="p-3 bg-amber-50/60 border-t border-slate-200 text-xs">
                      <span className="text-slate-600">Amount in Words: </span>
                      <strong className="text-slate-900 uppercase tracking-wide">
                        {amountInWords}
                      </strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Purpose & Compliance Clause */}
            <div className="mb-6 text-xs text-slate-700 leading-relaxed border-l-3 border-blue-900 pl-3">
              <p>
                <strong>Mandated AICTE Purpose:</strong> {fdr.purpose}
              </p>
              <p className="mt-1 text-slate-600">
                This Fixed Deposit is created in compliance with AICTE Approval Process Handbook guidelines. The principal sum along with accrued interest shall remain locked until AICTE issues formal liquidation instructions or No Objection Certificate (NOC).
              </p>
            </div>

            {/* Official Lien Stamp & Signatures */}
            <div className="pt-4 border-t-2 border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              {/* Red Lien Seal */}
              <div className="border-2 border-dashed border-red-700 bg-red-50/50 p-2.5 rounded text-center">
                <div className="text-[10px] font-bold uppercase text-red-900 tracking-wider">
                  ★ AICTE LIEN ENDORSEMENT ★
                </div>
                <div className="text-[11px] text-red-700 font-semibold mt-1">
                  UNDER OFFICIAL LIEN
                </div>
                <div className="text-[9px] text-red-800 mt-0.5">
                  Cannot be prematurely encashed or pledged without Council authorization.
                </div>
              </div>

              {/* QR Verification */}
              <div className="flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-slate-100 border border-slate-300 rounded flex items-center justify-center">
                  <QrCode className="w-12 h-12 text-slate-700" />
                </div>
                <span className="text-[9px] text-slate-500 mt-1 font-mono">
                  VERIFY: {fdr.id}
                </span>
              </div>

              {/* Bank Branch Signature */}
              <div className="text-right">
                <div className="h-10 flex items-center justify-end">
                  <span className="font-serif italic text-blue-900 text-sm opacity-80">
                    S. K. Ganguly
                  </span>
                </div>
                <div className="border-t border-slate-500 pt-1 text-xs">
                  <strong className="block text-slate-900">Branch Chief Manager</strong>
                  <span className="text-[10px] text-slate-500">
                    {fdr.bankName}, {fdr.branchName}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="no-print bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-between items-center text-xs text-slate-600">
          <div>
            Attached Receipt: <span className="font-mono font-medium">{fdr.documentFileName || 'Official_E_Receipt.pdf'}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 font-semibold bg-slate-800 hover:bg-slate-900 text-white rounded transition-colors cursor-pointer"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
}
