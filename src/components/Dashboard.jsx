import React from 'react';
import { 
  Building2, 
  Landmark, 
  ShieldCheck, 
  ClockAlert, 
  CheckCircle2, 
  AlertTriangle, 
  FileCheck, 
  TrendingUp, 
  ArrowUpRight, 
  ExternalLink,
  ChevronRight,
  PlusCircle,
  FileSpreadsheet,
  CheckCheck,
  AlertOctagon,
  Calendar
} from 'lucide-react';
import { formatCurrency, formatDate, calculateMaturityStatus } from '../utils/formatters';

export function Dashboard({ 
  records, 
  currentDate, 
  onNavigate, 
  onOpenAddModal, 
  onViewCertificate,
  onGenerateNotice 
}) {
  // Aggregate KPIs
  const totalCount = records.length;
  const totalAmount = records.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

  const pendingList = records.filter((r) => r.status === 'Pending Verification');
  const verifiedList = records.filter((r) => r.status === 'Verified');
  const correctionList = records.filter((r) => r.status === 'Under Correction');
  const rejectedList = records.filter((r) => r.status === 'Rejected');

  // Maturity status breakdown
  const maturityCalculations = records.map((r) => ({
    ...r,
    maturityInfo: calculateMaturityStatus(r.maturityDate, currentDate),
  }));

  const urgentApproaching = maturityCalculations.filter(
    (r) => r.maturityInfo.isApproaching && !r.maturityInfo.isMatured
  );
  const overdueList = maturityCalculations.filter((r) => r.maturityInfo.isMatured);
  const upcoming90Days = maturityCalculations.filter(
    (r) => !r.maturityInfo.isMatured && !r.maturityInfo.isApproaching && r.maturityInfo.daysRemaining <= 90
  );

  const approachingAmount = urgentApproaching.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  const overdueAmount = overdueList.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

  // Bank distribution calculation
  const bankDistribution = records.reduce((acc, r) => {
    const bank = r.bankName || 'Other';
    if (!acc[bank]) {
      acc[bank] = { count: 0, totalAmount: 0 };
    }
    acc[bank].count += 1;
    acc[bank].totalAmount += Number(r.amount) || 0;
    return acc;
  }, {});

  const bankEntries = Object.entries(bankDistribution).sort(
    (a, b) => b[1].totalAmount - a[1].totalAmount
  );

  // Purpose breakdown
  const purposeDistribution = records.reduce((acc, r) => {
    const purpose = r.purpose || 'Other';
    if (!acc[purpose]) {
      acc[purpose] = { count: 0, totalAmount: 0 };
    }
    acc[purpose].count += 1;
    acc[purpose].totalAmount += Number(r.amount) || 0;
    return acc;
  }, {});

  const purposeEntries = Object.entries(purposeDistribution).sort(
    (a, b) => b[1].totalAmount - a[1].totalAmount
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Executive Welcome Bar */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
              AICTE Financial Compliance Monitoring System
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif mt-1">
            Institutional Fixed Deposit Receipt (FDR) Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Real-time digital oversight of statutory security deposits across all approved technical institutions.
          </p>
        </div>

        {/* Quick Action Ribbon */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenAddModal}
            className="px-3.5 py-2 text-xs font-semibold bg-blue-700 hover:bg-blue-800 text-white rounded-lg shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Register New FDR</span>
          </button>

          <button
            onClick={() => onNavigate('verification')}
            className="px-3.5 py-2 text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <CheckCheck className="w-4 h-4 text-blue-600" />
            <span>Verification Desk</span>
            {pendingList.length > 0 && (
              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-amber-300">
                {pendingList.length}
              </span>
            )}
          </button>

          <button
            onClick={() => onNavigate('reports')}
            className="px-3.5 py-2 text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Reports & CSV</span>
          </button>
        </div>
      </div>

      {/* Actionable Urgent Banners */}
      {(urgentApproaching.length > 0 || overdueList.length > 0) && (
        <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-xl p-4 shadow-xs">
          <div className="flex items-start justify-between flex-col sm:flex-row gap-3">
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-amber-100 text-amber-800 shrink-0 mt-0.5">
                <ClockAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-950">
                  Maturity Attention Required: {urgentApproaching.length} Deposit(s) Expiring &lt;30 Days | {overdueList.length} Overdue
                </h3>
                <p className="text-xs text-amber-800 mt-0.5">
                  Total exposure: <strong>{formatCurrency(approachingAmount + overdueAmount)}</strong>. AICTE statutory guidelines mandate issuing demand notices to institutions 15-30 days before maturity to prevent unauthorized lien dissolution.
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('maturity')}
              className="px-3.5 py-1.5 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-lg shadow-xs flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
            >
              <span>Open Maturity Radar</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {pendingList.length > 0 && (
        <div className="bg-blue-50 border-l-4 border-blue-600 rounded-r-xl p-4 shadow-xs">
          <div className="flex items-start justify-between flex-col sm:flex-row gap-3">
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-800 shrink-0 mt-0.5">
                <CheckCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-blue-950">
                  {pendingList.length} Institutional Deposit(s) Awaiting AICTE Verification
                </h3>
                <p className="text-xs text-blue-800 mt-0.5">
                  New submissions submitted by college nodal officers require finance desk inspection of joint lien clauses, scheduled bank status, and minimum tenure lock-in.
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('verification')}
              className="px-3.5 py-1.5 text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white rounded-lg shadow-xs flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
            >
              <span>Review Submissions</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Top 6 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total FDRs */}
        <div 
          onClick={() => onNavigate('registry')}
          className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total FDRs</span>
            <Building2 className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalCount}</div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span>In digital registry</span>
            <ArrowUpRight className="w-3 h-3 text-blue-600" />
          </div>
        </div>

        {/* Total Deposit Amount */}
        <div 
          onClick={() => onNavigate('registry')}
          className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Value</span>
            <Landmark className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-serif">
            {formatCurrency(totalAmount, true)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {formatCurrency(totalAmount)}
          </div>
        </div>

        {/* Pending Verifications */}
        <div 
          onClick={() => onNavigate('verification')}
          className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Audit</span>
            <FileCheck className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-amber-600">{pendingList.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Requires officer review
          </div>
        </div>

        {/* Verified Records */}
        <div 
          onClick={() => onNavigate('registry')}
          className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Verified</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-emerald-700">{verifiedList.length}</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">
            {totalCount > 0 ? `${Math.round((verifiedList.length / totalCount) * 100)}% compliant` : '0%'}
          </div>
        </div>

        {/* Approaching Maturity (<30d) */}
        <div 
          onClick={() => onNavigate('maturity')}
          className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">&lt;30d Maturity</span>
            <ClockAlert className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-amber-700">{urgentApproaching.length}</div>
          <div className="text-[11px] text-amber-800 font-medium mt-1">
            {formatCurrency(approachingAmount, true)} at risk
          </div>
        </div>

        {/* Overdue / Matured */}
        <div 
          onClick={() => onNavigate('maturity')}
          className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:border-red-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Matured / Overdue</span>
            <AlertOctagon className="w-4 h-4 text-red-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-red-600">{overdueList.length}</div>
          <div className="text-[11px] text-red-700 font-medium mt-1">
            Immediate action needed
          </div>
        </div>
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Bank Exposure Distribution (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-xs border border-slate-200 p-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-serif">
                Scheduled Bank Concentration & Exposure
              </h2>
              <p className="text-xs text-slate-500">
                AICTE statutory funds distributed across Nationalized and Commercial Banks
              </p>
            </div>
            <button
              onClick={() => onNavigate('reports')}
              className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer"
            >
              <span>View Full Report</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3.5">
            {bankEntries.slice(0, 5).map(([bankName, data]) => {
              const percentage = totalAmount > 0 ? ((data.totalAmount / totalAmount) * 100).toFixed(1) : 0;
              return (
                <div key={bankName} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-800 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                      {bankName}
                      <span className="text-slate-500 font-normal">({data.count} FDR{data.count > 1 ? 's' : ''})</span>
                    </span>
                    <span className="font-bold text-slate-900 font-mono">
                      {formatCurrency(data.totalAmount)} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-700 to-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Bank Summary Footer */}
          <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded bg-slate-50">
              <span className="text-slate-500 block text-[11px]">Primary Banker</span>
              <strong className="text-slate-800 font-semibold truncate block">
                {bankEntries[0]?.[0] || 'State Bank of India'}
              </strong>
            </div>
            <div className="p-2 rounded bg-slate-50">
              <span className="text-slate-500 block text-[11px]">Average FDR Value</span>
              <strong className="text-slate-800 font-semibold block">
                {totalCount > 0 ? formatCurrency(totalAmount / totalCount, true) : '₹0'}
              </strong>
            </div>
            <div className="p-2 rounded bg-slate-50">
              <span className="text-slate-500 block text-[11px]">Avg Interest Yield</span>
              <strong className="text-emerald-700 font-semibold block">7.22% p.a.</strong>
            </div>
          </div>
        </div>

        {/* Right Column: Verification Status & Maturity Radar Summary (1 Col) */}
        <div className="space-y-6">
          {/* Status Breakdown Card */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
            <h2 className="text-base font-bold text-slate-900 font-serif border-b border-slate-100 pb-3 mb-4">
              Verification Compliance Status
            </h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/70 border border-emerald-100 text-xs">
                <div className="flex items-center space-x-2 text-emerald-900 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Verified & Approved</span>
                </div>
                <span className="font-bold text-emerald-900 font-mono text-sm">
                  {verifiedList.length}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50/70 border border-amber-100 text-xs">
                <div className="flex items-center space-x-2 text-amber-900 font-semibold">
                  <FileCheck className="w-4 h-4 text-amber-600" />
                  <span>Pending AICTE Review</span>
                </div>
                <span className="font-bold text-amber-900 font-mono text-sm">
                  {pendingList.length}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-purple-50/70 border border-purple-100 text-xs">
                <div className="flex items-center space-x-2 text-purple-900 font-semibold">
                  <AlertTriangle className="w-4 h-4 text-purple-600" />
                  <span>Returned for Correction</span>
                </div>
                <span className="font-bold text-purple-900 font-mono text-sm">
                  {correctionList.length}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-red-50/70 border border-red-100 text-xs">
                <div className="flex items-center space-x-2 text-red-900 font-semibold">
                  <AlertOctagon className="w-4 h-4 text-red-600" />
                  <span>Rejected / Non-Compliant</span>
                </div>
                <span className="font-bold text-red-900 font-mono text-sm">
                  {rejectedList.length}
                </span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('verification')}
              className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>Manage Verification Queue</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Maturity Horizon Card */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
            <h2 className="text-base font-bold text-slate-900 font-serif border-b border-slate-100 pb-3 mb-4">
              Maturity Radar Horizons
            </h2>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                <span className="text-red-700 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-600"></span>
                  Overdue / Expired
                </span>
                <span className="font-bold text-red-700">{overdueList.length} records</span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                <span className="text-amber-700 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Within 30 Days
                </span>
                <span className="font-bold text-amber-700">{urgentApproaching.length} records</span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                <span className="text-blue-700 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Within 90 Days
                </span>
                <span className="font-bold text-slate-700">{upcoming90Days.length} records</span>
              </div>

              <div className="flex justify-between items-center py-1.5">
                <span className="text-emerald-700 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Safe / Long Term (&gt;90d)
                </span>
                <span className="font-bold text-slate-700">
                  {records.length - (urgentApproaching.length + overdueList.length + upcoming90Days.length)} records
                </span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('maturity')}
              className="mt-4 w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>View Expiring Deposits & Send Notice</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Priority Action Table: Recent & Critical Records */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-serif">
              Recent & High-Attention Security Deposit Records
            </h2>
            <p className="text-xs text-slate-500">
              Immediate actions available for approaching maturities and pending verifications
            </p>
          </div>

          <button
            onClick={() => onNavigate('registry')}
            className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Records in Registry</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Institution</th>
                <th className="py-2.5 px-3">FDR Details</th>
                <th className="py-2.5 px-3">Principal Amount</th>
                <th className="py-2.5 px-3">Maturity Status</th>
                <th className="py-2.5 px-3">Verification</th>
                <th className="py-2.5 px-3 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {maturityCalculations.slice(0, 6).map((item) => {
                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Institution */}
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900">{item.institutionName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{item.institutionId} • {item.state}</div>
                    </td>

                    {/* FDR Details */}
                    <td className="py-3 px-3">
                      <div className="font-mono font-medium text-blue-900">{item.fdrNumber}</div>
                      <div className="text-[11px] text-slate-500">{item.bankName} ({item.branchName})</div>
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 font-mono text-sm">
                        {formatCurrency(item.amount)}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {item.interestRate}% p.a. • {item.tenureYears || 5}Y
                      </div>
                    </td>

                    {/* Maturity Status */}
                    <td className="py-3 px-3">
                      <span className={`inline-block px-2.5 py-1 rounded text-[11px] font-medium border ${item.maturityInfo.badgeClass}`}>
                        {item.maturityInfo.label}
                      </span>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Maturity: {formatDate(item.maturityDate)}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                        item.status === 'Verified'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'Pending Verification'
                          ? 'bg-amber-100 text-amber-800'
                          : item.status === 'Under Correction'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>

                    {/* Quick Actions */}
                    <td className="py-3 px-3 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => onViewCertificate(item)}
                        className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors cursor-pointer"
                        title="View Official FDR Receipt Certificate"
                      >
                        Receipt
                      </button>

                      {(item.maturityInfo.isApproaching || item.maturityInfo.isMatured) && (
                        <button
                          onClick={() => onGenerateNotice(item)}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded transition-colors cursor-pointer"
                          title="Generate official AICTE renewal demand notice letter"
                        >
                          Notice
                        </button>
                      )}

                      {item.status === 'Pending Verification' && (
                        <button
                          onClick={() => onNavigate('verification')}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-blue-100 hover:bg-blue-200 text-blue-900 border border-blue-300 rounded transition-colors cursor-pointer"
                          title="Review this deposit at Verification Desk"
                        >
                          Verify
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
