import React, { useState } from 'react';
import { 
  ClockAlert, 
  AlertTriangle, 
  AlertOctagon, 
  Calendar, 
  FileText, 
  RotateCw, 
  CheckCircle2, 
  Landmark, 
  Building2, 
  Download, 
  Eye, 
  ArrowRight,
  ShieldAlert,
  Send,
  X
} from 'lucide-react';
import { formatCurrency, formatDate, calculateMaturityStatus } from '../utils/formatters';

export function MaturityRadar({ 
  records, 
  currentDate, 
  onGenerateNotice, 
  onViewCertificate, 
  onRenewDeposit 
}) {
  const [filterBucket, setFilterBucket] = useState('ALL'); // ALL, CRITICAL, OVERDUE, UPCOMING, SAFE
  const [renewingRecord, setRenewingRecord] = useState(null);
  const [renewalYears, setRenewalYears] = useState(5);
  const [newFdrRef, setNewFdrRef] = useState('');
  const [renewalRemarks, setRenewalRemarks] = useState('');

  // Calculate maturity status for each record
  const enriched = records.map((rec) => {
    const statusInfo = calculateMaturityStatus(rec.maturityDate, currentDate);

    // Calculate elapsed percentage
    const start = new Date(rec.issueDate || '2021-01-01').getTime();
    const end = new Date(rec.maturityDate).getTime();
    const current = new Date(currentDate).getTime();
    let percentElapsed = 0;
    if (end > start) {
      percentElapsed = Math.min(100, Math.max(0, Math.round(((current - start) / (end - start)) * 100)));
    }

    return {
      ...rec,
      statusInfo,
      percentElapsed,
    };
  });

  const criticalList = enriched.filter((r) => r.statusInfo.isApproaching && !r.statusInfo.isMatured);
  const overdueList = enriched.filter((r) => r.statusInfo.isMatured);
  const upcomingList = enriched.filter((r) => !r.statusInfo.isMatured && !r.statusInfo.isApproaching && r.statusInfo.daysRemaining <= 90);
  const safeList = enriched.filter((r) => !r.statusInfo.isMatured && r.statusInfo.daysRemaining > 90);

  const criticalAmount = criticalList.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  const overdueAmount = overdueList.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

  const displayedRecords = enriched.filter((r) => {
    if (filterBucket === 'CRITICAL') return r.statusInfo.isApproaching && !r.statusInfo.isMatured;
    if (filterBucket === 'OVERDUE') return r.statusInfo.isMatured;
    if (filterBucket === 'UPCOMING') return !r.statusInfo.isMatured && !r.statusInfo.isApproaching && r.statusInfo.daysRemaining <= 90;
    if (filterBucket === 'SAFE') return !r.statusInfo.isMatured && r.statusInfo.daysRemaining > 90;
    return true;
  }).sort((a, b) => a.statusInfo.daysRemaining - b.statusInfo.daysRemaining);

  const handleOpenRenew = (record) => {
    setRenewingRecord(record);
    setNewFdrRef(`${record.fdrNumber}-RNW`);
    setRenewalYears(5);
    setRenewalRemarks('Tenure extended with renewed joint lien endorsement in favor of Member Secretary AICTE.');
  };

  const handleConfirmRenew = (e) => {
    e.preventDefault();
    if (!renewingRecord) return;

    // Calculate new maturity date: current maturity date + renewalYears
    const baseDate = new Date(renewingRecord.maturityDate);
    const newMaturity = new Date(baseDate);
    newMaturity.setFullYear(baseDate.getFullYear() + Number(renewalYears));
    const newDateStr = newMaturity.toISOString().split('T')[0];

    onRenewDeposit(
      renewingRecord.id,
      newDateStr,
      newFdrRef,
      renewalYears,
      renewalRemarks
    );

    setRenewingRecord(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-900">
            <ClockAlert className="w-4 h-4 text-blue-700" />
            <span>AICTE Predictive Monitoring Engine</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif mt-1">
            Intelligent Fixed Deposit Maturity Radar
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Automated tracking of remaining days to maturity, prompt renewal demand letters, and overdue deposit containment.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs flex items-center space-x-2 text-slate-700">
          <Calendar className="w-4 h-4 text-amber-600" />
          <span>Active Reference Date: <strong className="text-slate-900">{formatDate(currentDate)}</strong></span>
        </div>
      </div>

      {/* 4 Horizon Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Critical <30 Days */}
        <div 
          onClick={() => setFilterBucket('CRITICAL')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            filterBucket === 'CRITICAL'
              ? 'bg-amber-100/70 border-amber-500 ring-2 ring-amber-400 shadow-md'
              : 'bg-white border-amber-200 hover:border-amber-400 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
              Expiring &lt;30 Days
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-600 animate-bounce" />
          </div>
          <div className="text-2xl font-bold text-amber-900 font-serif">
            {criticalList.length} Deposits
          </div>
          <div className="text-xs text-amber-800 font-medium mt-1">
            Exposure: <strong>{formatCurrency(criticalAmount, true)}</strong>
          </div>
          <div className="text-[10px] text-amber-700 mt-0.5">
            Requires AICTE demand letter
          </div>
        </div>

        {/* Overdue / Matured */}
        <div 
          onClick={() => setFilterBucket('OVERDUE')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            filterBucket === 'OVERDUE'
              ? 'bg-red-100/70 border-red-500 ring-2 ring-red-400 shadow-md'
              : 'bg-white border-red-200 hover:border-red-400 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-red-900">
              Matured / Overdue
            </span>
            <AlertOctagon className="w-4 h-4 text-red-600 animate-pulse" />
          </div>
          <div className="text-2xl font-bold text-red-900 font-serif">
            {overdueList.length} Deposits
          </div>
          <div className="text-xs text-red-800 font-medium mt-1">
            Exposure: <strong>{formatCurrency(overdueAmount, true)}</strong>
          </div>
          <div className="text-[10px] text-red-700 mt-0.5">
            Mandate immediate extension
          </div>
        </div>

        {/* Upcoming (31-90 Days) */}
        <div 
          onClick={() => setFilterBucket('UPCOMING')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            filterBucket === 'UPCOMING'
              ? 'bg-blue-100/70 border-blue-500 ring-2 ring-blue-400 shadow-md'
              : 'bg-white border-blue-200 hover:border-blue-400 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
              Upcoming (31–90 Days)
            </span>
            <ClockAlert className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-900 font-serif">
            {upcomingList.length} Deposits
          </div>
          <div className="text-xs text-blue-800 font-medium mt-1">
            Exposure: <strong>{formatCurrency(upcomingList.reduce((s, r) => s + (Number(r.amount) || 0), 0), true)}</strong>
          </div>
          <div className="text-[10px] text-blue-600 mt-0.5">
            Pre-notice advisory phase
          </div>
        </div>

        {/* Safe / Long-Term (>90 Days) */}
        <div 
          onClick={() => setFilterBucket('SAFE')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            filterBucket === 'SAFE'
              ? 'bg-emerald-100/70 border-emerald-500 ring-2 ring-emerald-400 shadow-md'
              : 'bg-white border-emerald-200 hover:border-emerald-400 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">
              Safe / Long Term (&gt;90d)
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-900 font-serif">
            {safeList.length} Deposits
          </div>
          <div className="text-xs text-emerald-800 font-medium mt-1">
            Active compliances
          </div>
          <div className="text-[10px] text-emerald-700 mt-0.5">
            No immediate action needed
          </div>
        </div>
      </div>

      {/* Filter Tabs Ribbon */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-2">
        <div className="flex items-center space-x-2 text-xs">
          <span className="font-semibold text-slate-500">Filter View:</span>
          <button
            onClick={() => setFilterBucket('ALL')}
            className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer ${
              filterBucket === 'ALL' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Horizons ({enriched.length})
          </button>
          <button
            onClick={() => setFilterBucket('CRITICAL')}
            className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer ${
              filterBucket === 'CRITICAL' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            &lt;30 Days ({criticalList.length})
          </button>
          <button
            onClick={() => setFilterBucket('OVERDUE')}
            className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer ${
              filterBucket === 'OVERDUE' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-800 hover:bg-red-100'
            }`}
          >
            Overdue ({overdueList.length})
          </button>
        </div>

        <div className="text-xs text-slate-500">
          Showing <strong>{displayedRecords.length}</strong> matching fixed deposit records
        </div>
      </div>

      {/* Main Radar Table */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#0B2545] text-white uppercase text-[11px] font-semibold tracking-wider">
              <tr>
                <th className="py-3 px-3.5">Institution & AICTE ID</th>
                <th className="py-3 px-3.5">Bank & FDR Ref</th>
                <th className="py-3 px-3.5">Deposit Amount</th>
                <th className="py-3 px-3.5">Maturity Date</th>
                <th className="py-3 px-3.5">Remaining Countdown</th>
                <th className="py-3 px-3.5">Tenure Elapsed</th>
                <th className="py-3 px-3.5 text-right">Maturity Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {displayedRecords.map((item) => {
                const isOverdue = item.statusInfo.isMatured;
                const isApproaching = item.statusInfo.isApproaching && !isOverdue;

                return (
                  <tr 
                    key={item.id} 
                    className={`hover:bg-blue-50/50 transition-colors ${
                      isOverdue ? 'bg-red-50/40' : isApproaching ? 'bg-amber-50/40' : ''
                    }`}
                  >
                    {/* Institution */}
                    <td className="py-3.5 px-3.5 align-top">
                      <div className="font-bold text-slate-900">{item.institutionName}</div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">{item.institutionId} • {item.state}</div>
                    </td>

                    {/* Bank & FDR */}
                    <td className="py-3.5 px-3.5 align-top">
                      <div className="font-mono font-bold text-blue-900">{item.fdrNumber}</div>
                      <div className="text-slate-700 font-medium">{item.bankName}</div>
                      <div className="text-[11px] text-slate-500">{item.branchName}</div>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-3.5 align-top whitespace-nowrap">
                      <div className="font-bold text-slate-900 font-mono text-sm">
                        {formatCurrency(item.amount)}
                      </div>
                      <div className="text-[11px] text-emerald-700 font-semibold">
                        {item.interestRate}% p.a.
                      </div>
                    </td>

                    {/* Maturity Date */}
                    <td className="py-3.5 px-3.5 align-top whitespace-nowrap">
                      <div className="font-bold text-slate-900">
                        {formatDate(item.maturityDate)}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Issued: {formatDate(item.issueDate)}
                      </div>
                    </td>

                    {/* Remaining Countdown Badge */}
                    <td className="py-3.5 px-3.5 align-top">
                      <span className={`inline-block px-2.5 py-1 rounded text-[11px] font-bold border ${item.statusInfo.badgeClass}`}>
                        {item.statusInfo.label}
                      </span>
                    </td>

                    {/* Elapsed Progress Bar */}
                    <td className="py-3.5 px-3.5 align-top min-w-[130px]">
                      <div className="flex justify-between items-center text-[10px] text-slate-500 mb-1">
                        <span>{item.percentElapsed}% Elapsed</span>
                        <span>{item.tenureYears || 5}Y Term</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isOverdue
                              ? 'bg-red-600'
                              : isApproaching
                              ? 'bg-amber-500'
                              : 'bg-blue-600'
                          }`}
                          style={{ width: `${item.percentElapsed}%` }}
                        ></div>
                      </div>
                    </td>

                    {/* Action Controls */}
                    <td className="py-3.5 px-3.5 align-top text-right whitespace-nowrap space-x-1.5">
                      <button
                        onClick={() => onViewCertificate(item)}
                        className="px-2 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors cursor-pointer"
                        title="View Fixed Deposit Receipt"
                      >
                        Receipt
                      </button>

                      {/* Demand Notice Generator */}
                      <button
                        onClick={() => onGenerateNotice(item)}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded shadow-xs transition-colors cursor-pointer ${
                          isOverdue
                            ? 'bg-red-700 hover:bg-red-800 text-white'
                            : isApproaching
                            ? 'bg-amber-600 hover:bg-amber-700 text-white'
                            : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                        }`}
                        title="Generate official AICTE demand notice letter to institution and bank manager"
                      >
                        Notice
                      </button>

                      {/* Quick Renewal Action */}
                      <button
                        onClick={() => handleOpenRenew(item)}
                        className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded transition-colors cursor-pointer"
                        title="Record extension / renewal of fixed deposit"
                      >
                        Renew
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Renewal Modal */}
      {renewingRecord && (
        <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 border border-slate-300">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <div className="flex items-center space-x-2 text-blue-900 font-bold text-base">
                <RotateCw className="w-5 h-5 text-emerald-600" />
                <span>Execute FDR Extension / Renewal</span>
              </div>
              <button
                onClick={() => setRenewingRecord(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmRenew} className="space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900">{renewingRecord.institutionName}</div>
                <div className="text-slate-600">
                  Current FDR: <span className="font-mono">{renewingRecord.fdrNumber}</span> • {renewingRecord.bankName}
                </div>
                <div className="text-slate-600">
                  Principal Amount: <strong>{formatCurrency(renewingRecord.amount)}</strong>
                </div>
                <div className="text-slate-600">
                  Current Maturity: <strong>{formatDate(renewingRecord.maturityDate)}</strong>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Extension Tenure Period
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[3, 5, 10].map((yr) => (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => setRenewalYears(yr)}
                      className={`py-2 text-center rounded-lg border font-semibold text-xs transition-colors cursor-pointer ${
                        renewalYears === yr
                          ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      +{yr} Years
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Renewed FDR Receipt Reference Number
                </label>
                <input
                  type="text"
                  value={newFdrRef}
                  onChange={(e) => setNewFdrRef(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-xs font-mono bg-white text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Renewal Audit Remarks
                </label>
                <textarea
                  rows={2}
                  value={renewalRemarks}
                  onChange={(e) => setRenewalRemarks(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded text-xs bg-white text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setRenewingRecord(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded shadow-sm flex items-center gap-1 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Execute Renewal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
