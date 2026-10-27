import React, { useState } from 'react';
import { 
  CheckCheck, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  AlertTriangle, 
  FileText, 
  Eye, 
  ShieldCheck, 
  Landmark, 
  Building2, 
  Clock, 
  AlertOctagon,
  ChevronRight,
  Send,
  Sparkles,
  Info
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

export function VerificationDesk({ 
  records, 
  onUpdateVerification, 
  onViewCertificate,
  selectedFdrId = null 
}) {
  const [activeQueueTab, setActiveQueueTab] = useState('Pending Verification');
  const [selectedRecordId, setSelectedRecordId] = useState(
    selectedFdrId || records.find((r) => r.status === 'Pending Verification')?.id || records[0]?.id
  );

  // Verification decision form state
  const [decisionNotes, setDecisionNotes] = useState('');
  const [reviewerName, setReviewerName] = useState('Dr. R. K. Sharma (Finance Officer, AICTE)');
  const [checklist, setChecklist] = useState({
    scheduledBank: true,
    jointLienMandate: true,
    mandatedLockIn: true,
    branchSealLegible: true,
  });

  // Filter queue
  const queueRecords = records.filter((r) => {
    if (activeQueueTab === 'ALL') return true;
    return r.status === activeQueueTab;
  });

  const selectedRecord = records.find((r) => r.id === selectedRecordId) || queueRecords[0] || records[0];

  const handleAction = (status) => {
    if (!selectedRecord) return;

    if ((status === 'Rejected' || status === 'Under Correction') && !decisionNotes.trim()) {
      alert(`Please provide specific ${status === 'Rejected' ? 'rejection reasons' : 'deficiency correction notes'} for the institution.`);
      return;
    }

    const defaultNotes = status === 'Verified' 
      ? 'Joint lien and Scheduled Bank compliance audited and approved under AICTE APH Chapter II.'
      : decisionNotes;

    onUpdateVerification(
      selectedRecord.id,
      status,
      reviewerName,
      decisionNotes.trim() || defaultNotes
    );

    setDecisionNotes('');
  };

  const pendingCount = records.filter((r) => r.status === 'Pending Verification').length;
  const correctionCount = records.filter((r) => r.status === 'Under Correction').length;
  const rejectedCount = records.filter((r) => r.status === 'Rejected').length;
  const verifiedCount = records.filter((r) => r.status === 'Verified').length;

  return (
    <div className="space-y-5 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-900">
            <CheckCheck className="w-4 h-4 text-blue-700" />
            <span>AICTE Finance & Audit Division</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif mt-1">
            Institutional FDR Verification Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Review submitted Fixed Deposit Receipts, audit joint lien clauses against banking records, and issue approvals.
          </p>
        </div>

        {/* Quick Reviewer Identity Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-3.5 py-2 text-xs">
          <span className="text-blue-600 font-medium block text-[10px] uppercase">Active Reviewing Officer</span>
          <strong className="text-blue-950 font-bold text-xs">{reviewerName}</strong>
          <span className="text-blue-700/80 block text-[10px]">AICTE Headquarters, New Delhi</span>
        </div>
      </div>

      {/* Queue Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveQueueTab('Pending Verification')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeQueueTab === 'Pending Verification'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span>Pending Review</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
            activeQueueTab === 'Pending Verification' ? 'bg-amber-800 text-white' : 'bg-amber-100 text-amber-900'
          }`}>
            {pendingCount}
          </span>
        </button>

        <button
          onClick={() => setActiveQueueTab('Under Correction')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeQueueTab === 'Under Correction'
              ? 'bg-purple-700 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span>Under Correction</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
            activeQueueTab === 'Under Correction' ? 'bg-purple-900 text-white' : 'bg-purple-100 text-purple-900'
          }`}>
            {correctionCount}
          </span>
        </button>

        <button
          onClick={() => setActiveQueueTab('Verified')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeQueueTab === 'Verified'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span>Verified & Sanctioned</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
            activeQueueTab === 'Verified' ? 'bg-emerald-900 text-white' : 'bg-emerald-100 text-emerald-900'
          }`}>
            {verifiedCount}
          </span>
        </button>

        <button
          onClick={() => setActiveQueueTab('Rejected')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeQueueTab === 'Rejected'
              ? 'bg-red-700 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span>Rejected Deposits</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
            activeQueueTab === 'Rejected' ? 'bg-red-900 text-white' : 'bg-red-100 text-red-900'
          }`}>
            {rejectedCount}
          </span>
        </button>

        <button
          onClick={() => setActiveQueueTab('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            activeQueueTab === 'ALL'
              ? 'bg-slate-800 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span>All Submissions ({records.length})</span>
        </button>
      </div>

      {/* Main Split-Screen Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Submissions Queue List (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden flex flex-col max-h-[820px]">
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {activeQueueTab} Queue ({queueRecords.length})
            </span>
            <span className="text-[11px] text-slate-500">Select a record to inspect</span>
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto flex-1">
            {queueRecords.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No FDR submissions currently in <strong>{activeQueueTab}</strong> queue.
              </div>
            ) : (
              queueRecords.map((item) => {
                const isSelected = item.id === selectedRecord?.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedRecordId(item.id)}
                    className={`p-3.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/90 border-l-4 border-blue-600'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <strong className="text-xs font-semibold text-slate-900 leading-snug line-clamp-1">
                        {item.institutionName}
                      </strong>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        item.status === 'Verified'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'Pending Verification'
                          ? 'bg-amber-100 text-amber-800 animate-pulse'
                          : item.status === 'Under Correction'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs mt-1">
                      <span className="font-mono text-blue-900 font-medium">
                        {item.fdrNumber}
                      </span>
                      <span className="font-bold text-slate-900 font-mono">
                        {formatCurrency(item.amount)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                      <span>{item.bankName}</span>
                      <span>Maturity: {formatDate(item.maturityDate)}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Detailed Verification Workbench (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden flex flex-col">
          {selectedRecord ? (
            <div className="p-6 space-y-5 overflow-y-auto max-h-[820px]">
              {/* Selected Deposit Header */}
              <div className="border-b border-slate-200 pb-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-semibold uppercase text-slate-500 tracking-wider">
                      SUBMISSION ID: {selectedRecord.id} • AICTE PERMANENT ID: {selectedRecord.institutionId}
                    </span>
                    <h2 className="text-lg font-bold text-slate-900 font-serif mt-0.5">
                      {selectedRecord.institutionName}
                    </h2>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {selectedRecord.state} • Nodal Contact: {selectedRecord.contactPerson || 'Institution Registrar'} ({selectedRecord.contactEmail})
                    </p>
                  </div>

                  <span className={`px-2.5 py-1 rounded text-xs font-bold border ${
                    selectedRecord.status === 'Verified'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : selectedRecord.status === 'Pending Verification'
                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                      : selectedRecord.status === 'Under Correction'
                      ? 'bg-purple-50 text-purple-800 border-purple-300'
                      : 'bg-red-50 text-red-800 border-red-300'
                  }`}>
                    {selectedRecord.status}
                  </span>
                </div>
              </div>

              {/* Deposit Financial Details Card */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">Principal Deposit</span>
                  <strong className="text-slate-900 font-bold text-sm block font-mono">
                    {formatCurrency(selectedRecord.amount)}
                  </strong>
                  <span className="text-[10px] text-blue-700">{formatCurrency(selectedRecord.amount, true)}</span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[11px]">FDR Number</span>
                  <strong className="text-blue-950 font-mono font-semibold block">
                    {selectedRecord.fdrNumber}
                  </strong>
                  <span className="text-[10px] text-slate-500">{selectedRecord.interestRate}% p.a.</span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[11px]">Bank & Branch</span>
                  <strong className="text-slate-900 font-semibold block truncate">
                    {selectedRecord.bankName}
                  </strong>
                  <span className="text-[10px] text-slate-500 font-mono">{selectedRecord.ifscCode}</span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[11px]">Maturity Term</span>
                  <strong className="text-slate-900 font-semibold block">
                    {formatDate(selectedRecord.maturityDate)}
                  </strong>
                  <span className="text-[10px] text-slate-500">{selectedRecord.tenureYears || 5} Years Lock-in</span>
                </div>
              </div>

              {/* Supporting Document View Card */}
              <div className="border border-slate-200 rounded-lg p-4 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2 text-xs font-bold text-blue-950 uppercase tracking-wider">
                    <FileText className="w-4 h-4 text-blue-700" />
                    <span>Attached Document Audit Preview</span>
                  </div>

                  <button
                    onClick={() => onViewCertificate(selectedRecord)}
                    className="px-3 py-1 text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 rounded border border-blue-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Open Full E-Certificate</span>
                  </button>
                </div>

                <div className="bg-slate-50 p-3 rounded border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs">
                      PDF
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">
                        {selectedRecord.documentFileName || 'Bank_FDR_Receipt.pdf'}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Joint Lien Endorsement Clause Stamp Visible
                      </div>
                    </div>
                  </div>
                  <span className="text-emerald-700 font-semibold text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Digitally Sealed
                  </span>
                </div>
              </div>

              {/* Statutory Compliance Checklist */}
              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/60">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-950 flex items-center gap-1.5 mb-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  AICTE Compliance Verification Checklist
                </h3>

                <div className="space-y-2 text-xs">
                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklist.scheduledBank}
                      onChange={(e) => setChecklist({ ...checklist, scheduledBank: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300"
                    />
                    <span className="text-slate-800 font-medium">
                      Deposit issued by a recognized Scheduled Commercial / Nationalized Bank (Non-cooperative).
                    </span>
                  </label>

                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklist.jointLienMandate}
                      onChange={(e) => setChecklist({ ...checklist, jointLienMandate: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300"
                    />
                    <span className="text-slate-800 font-medium">
                      Joint title explicitly names: <em>The Member Secretary, AICTE, New Delhi</em> with lien clause.
                    </span>
                  </label>

                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklist.mandatedLockIn}
                      onChange={(e) => setChecklist({ ...checklist, mandatedLockIn: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300"
                    />
                    <span className="text-slate-800 font-medium">
                      Deposit tenure and principal meet mandated norms for <strong>"{selectedRecord.purpose}"</strong>.
                    </span>
                  </label>

                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklist.branchSealLegible}
                      onChange={(e) => setChecklist({ ...checklist, branchSealLegible: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300"
                    />
                    <span className="text-slate-800 font-medium">
                      Original branch seal and Branch Chief Manager signature are clear and authentic.
                    </span>
                  </label>
                </div>
              </div>

              {/* Reviewer Remarks & Action Box */}
              <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50/40 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Officer Decision Remarks / Correction Deficiency Instructions:
                  </label>
                  <textarea
                    rows={3}
                    value={decisionNotes}
                    onChange={(e) => setDecisionNotes(e.target.value)}
                    placeholder="Enter audit notes, instructions for correction, or reasons for rejection..."
                    className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
                  />
                  {selectedRecord.verificationNotes && (
                    <div className="mt-1 text-[11px] text-slate-600 bg-white/80 p-2 rounded border border-slate-200">
                      <strong>Current Audit Note:</strong> {selectedRecord.verificationNotes}
                    </div>
                  )}
                </div>

                {/* Verification Action Buttons */}
                <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleAction('Rejected')}
                    className="px-3.5 py-1.5 text-xs font-semibold bg-red-100 hover:bg-red-200 text-red-800 border border-red-300 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5 text-red-600" />
                    <span>Reject Deposit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAction('Under Correction')}
                    className="px-3.5 py-1.5 text-xs font-semibold bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-300 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-purple-600" />
                    <span>Return for Correction</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAction('Verified')}
                    className="px-4 py-1.5 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-md shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                    <span>Approve & Verify FDR</span>
                  </button>
                </div>
              </div>

              {/* Audit History Timeline */}
              {selectedRecord.history && selectedRecord.history.length > 0 && (
                <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Verification Audit Log & History</span>
                  </h4>

                  <div className="space-y-3">
                    {selectedRecord.history.map((h, idx) => (
                      <div key={idx} className="flex items-start space-x-3 text-xs">
                        <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0"></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <strong className="text-slate-900">{h.action}</strong>
                            <span className="text-[10px] text-slate-500">{h.timestamp}</span>
                          </div>
                          <p className="text-slate-600 text-[11px] mt-0.5">{h.remarks}</p>
                          <div className="text-[10px] text-blue-700 font-medium">By: {h.by}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500">
              Select an institutional FDR from the queue to start verification.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
