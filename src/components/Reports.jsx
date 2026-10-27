import React from 'react';
import { 
  BarChart3, 
  Download, 
  Printer, 
  FileSpreadsheet, 
  Landmark, 
  Building2, 
  ShieldCheck, 
  PieChart, 
  ClockAlert, 
  CheckCircle2, 
  AlertTriangle,
  ArrowUpRight
} from 'lucide-react';
import { formatCurrency, formatDate, calculateMaturityStatus, downloadCSV } from '../utils/formatters';

export function Reports({ records, currentDate }) {
  // Aggregate KPIs
  const totalAmount = records.reduce((s, r) => s + (Number(r.amount) || 0), 0);
  const totalCount = records.length;

  const verified = records.filter((r) => r.status === 'Verified');
  const pending = records.filter((r) => r.status === 'Pending Verification');
  const correction = records.filter((r) => r.status === 'Under Correction');
  const rejected = records.filter((r) => r.status === 'Rejected');

  const verifiedAmount = verified.reduce((s, r) => s + (Number(r.amount) || 0), 0);
  const pendingAmount = pending.reduce((s, r) => s + (Number(r.amount) || 0), 0);

  // Maturity summary
  const maturityEnriched = records.map((r) => ({
    ...r,
    maturity: calculateMaturityStatus(r.maturityDate, currentDate),
  }));

  const urgentApproaching = maturityEnriched.filter(
    (r) => r.maturity.isApproaching && !r.maturity.isMatured
  );
  const overdue = maturityEnriched.filter((r) => r.maturity.isMatured);
  const approachingAmount = urgentApproaching.reduce((s, r) => s + (Number(r.amount) || 0), 0);
  const overdueAmount = overdue.reduce((s, r) => s + (Number(r.amount) || 0), 0);

  // Bank summary
  const bankMap = records.reduce((acc, r) => {
    const bank = r.bankName || 'Other';
    if (!acc[bank]) {
      acc[bank] = {
        name: bank,
        count: 0,
        amount: 0,
        totalInterest: 0,
        type: bank.includes('HDFC') || bank.includes('ICICI') || bank.includes('Axis') 
          ? 'Scheduled Commercial (Private)' 
          : bank.includes('Cooperative') 
          ? 'Co-operative Bank (Unapproved)'
          : 'Public Sector Nationalized',
      };
    }
    acc[bank].count += 1;
    acc[bank].amount += Number(r.amount) || 0;
    acc[bank].totalInterest += Number(r.interestRate) || 0;
    return acc;
  }, {});

  const bankSummaryList = Object.values(bankMap).sort((a, b) => b.amount - a.amount);

  // Purpose summary
  const purposeMap = records.reduce((acc, r) => {
    const p = r.purpose || 'Other';
    if (!acc[p]) {
      acc[p] = { purpose: p, count: 0, amount: 0 };
    }
    acc[p].count += 1;
    acc[p].amount += Number(r.amount) || 0;
    return acc;
  }, {});

  const purposeSummaryList = Object.values(purposeMap).sort((a, b) => b.amount - a.amount);

  // Institution summary
  const institutionMap = records.reduce((acc, r) => {
    const key = r.institutionId || r.institutionName;
    if (!acc[key]) {
      acc[key] = {
        name: r.institutionName,
        id: r.institutionId,
        state: r.state,
        count: 0,
        amount: 0,
        primaryBank: r.bankName,
        status: r.status,
      };
    }
    acc[key].count += 1;
    acc[key].amount += Number(r.amount) || 0;
    return acc;
  }, {});

  const institutionSummaryList = Object.values(institutionMap).sort((a, b) => b.amount - a.amount);

  // Export Complete Master Ledger
  const handleExportMasterCSV = () => {
    const columns = [
      { label: 'Record ID', key: 'id' },
      { label: 'Institution Name', key: 'institutionName' },
      { label: 'AICTE ID', key: 'institutionId' },
      { label: 'State', key: 'state' },
      { label: 'FDR Number', key: 'fdrNumber' },
      { label: 'Bank Name', key: 'bankName' },
      { label: 'Branch Name', key: 'branchName' },
      { label: 'IFSC Code', key: 'ifscCode' },
      { label: 'Amount (INR)', key: 'amount' },
      { label: 'Interest Rate (%)', key: 'interestRate' },
      { label: 'Issue Date', key: 'issueDate' },
      { label: 'Maturity Date', key: 'maturityDate' },
      { label: 'Purpose of Deposit', key: 'purpose' },
      { label: 'Verification Status', key: 'status' },
      { label: 'Nodal Contact', key: 'contactPerson' },
    ];
    downloadCSV(`AICTE_Full_FDR_Master_Report_${new Date().toISOString().split('T')[0]}`, columns, records);
  };

  // Export Bank Summary CSV
  const handleExportBankCSV = () => {
    const columns = [
      { label: 'Bank Name', key: 'name' },
      { label: 'Bank Classification', key: 'type' },
      { label: 'Count of FDRs', key: 'count' },
      { label: 'Total Value Held (INR)', key: 'amount' },
      { label: 'Share of Portfolio (%)', key: 'share', format: (_, item) => ((item.amount / totalAmount) * 100).toFixed(2) },
      { label: 'Average Rate (%)', key: 'avgRate', format: (_, item) => (item.totalInterest / item.count).toFixed(2) },
    ];
    downloadCSV(`AICTE_Bank_Exposure_Summary_${new Date().toISOString().split('T')[0]}`, columns, bankSummaryList);
  };

  // Export Expiring CSV
  const handleExportExpiringCSV = () => {
    const columns = [
      { label: 'Institution Name', key: 'institutionName' },
      { label: 'AICTE ID', key: 'institutionId' },
      { label: 'FDR Number', key: 'fdrNumber' },
      { label: 'Bank Name', key: 'bankName' },
      { label: 'Deposit Amount (INR)', key: 'amount' },
      { label: 'Maturity Date', key: 'maturityDate' },
      { label: 'Days Remaining', key: 'days', format: (_, item) => item.maturity.daysRemaining },
      { label: 'Status', key: 'status', format: (_, item) => item.maturity.status },
      { label: 'Contact Email', key: 'contactEmail' },
    ];
    downloadCSV(`AICTE_Maturing_Liabilities_${new Date().toISOString().split('T')[0]}`, columns, [...urgentApproaching, ...overdue]);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-900">
            <BarChart3 className="w-4 h-4 text-blue-700" />
            <span>AICTE Financial Governance & Audit Division</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif mt-1">
            Deposit Portfolio Reports & CSV Export Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Statistical breakdown of institutional security deposits by bank exposure, mandated purposes, and compliance status.
          </p>
        </div>

        {/* Global Export Buttons */}
        <div className="no-print flex flex-wrap items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Print Report</span>
          </button>

          <button
            onClick={handleExportMasterCSV}
            className="px-4 py-2 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Master CSV Ledger</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Total Custody Portfolio
          </span>
          <div className="text-2xl font-bold text-slate-900 font-serif mt-1">
            {formatCurrency(totalAmount, true)}
          </div>
          <div className="text-xs text-slate-600 mt-0.5">
            {formatCurrency(totalAmount)} across {totalCount} FDRs
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Verified & Compliant
          </span>
          <div className="text-2xl font-bold text-emerald-700 font-serif mt-1">
            {formatCurrency(verifiedAmount, true)}
          </div>
          <div className="text-xs text-emerald-800 mt-0.5">
            {verified.length} FDRs ({totalCount > 0 ? Math.round((verified.length / totalCount) * 100) : 0}% of portfolio)
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Pending AICTE Verification
          </span>
          <div className="text-2xl font-bold text-amber-600 font-serif mt-1">
            {formatCurrency(pendingAmount, true)}
          </div>
          <div className="text-xs text-amber-800 mt-0.5">
            {pending.length} institutional submissions in audit
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Maturing &lt;30d or Overdue
          </span>
          <div className="text-2xl font-bold text-red-600 font-serif mt-1">
            {formatCurrency(approachingAmount + overdueAmount, true)}
          </div>
          <div className="text-xs text-red-700 mt-0.5">
            {urgentApproaching.length + overdue.length} FDRs requiring demand notice
          </div>
        </div>
      </div>

      {/* Bank Exposure Summary Table */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-serif">
              Summary of Fixed Deposits by Scheduled Bank
            </h2>
            <p className="text-xs text-slate-500">
              Concentration analysis across nationalized public and scheduled private commercial banks
            </p>
          </div>

          <button
            onClick={handleExportBankCSV}
            className="no-print text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Export Bank Summary (CSV)</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Bank Name</th>
                <th className="py-2.5 px-3">Regulatory Classification</th>
                <th className="py-2.5 px-3 text-center">FDR Count</th>
                <th className="py-2.5 px-3">Cumulative Deposit (INR)</th>
                <th className="py-2.5 px-3 text-center">Portfolio Share</th>
                <th className="py-2.5 px-3 text-right">Avg Interest Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bankSummaryList.map((item) => {
                const share = totalAmount > 0 ? ((item.amount / totalAmount) * 100).toFixed(1) : 0;
                const avgRate = (item.totalInterest / item.count).toFixed(2);
                return (
                  <tr key={item.name} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      {item.name}
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                        item.type.includes('Public') 
                          ? 'bg-blue-50 text-blue-800' 
                          : item.type.includes('Private') 
                          ? 'bg-indigo-50 text-indigo-800'
                          : 'bg-red-50 text-red-800 font-bold'
                      }`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-800">
                      {item.count}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900 font-mono">
                      {formatCurrency(item.amount)}
                      <span className="text-slate-500 font-normal ml-1">({formatCurrency(item.amount, true)})</span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-600 h-full rounded-full"
                            style={{ width: `${share}%` }}
                          ></div>
                        </div>
                        <span className="font-semibold text-slate-800">{share}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right font-semibold text-emerald-700">
                      {avgRate}% p.a.
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Purpose Breakdown & Maturing Liabilities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Purpose Summary */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
          <h2 className="text-base font-bold text-slate-900 font-serif border-b border-slate-100 pb-3 mb-4">
            Deposit Allocation by Mandated Statutory Purpose
          </h2>

          <div className="space-y-3">
            {purposeSummaryList.map((item) => {
              const share = totalAmount > 0 ? ((item.amount / totalAmount) * 100).toFixed(1) : 0;
              return (
                <div key={item.purpose} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-800 line-clamp-1">
                      {item.purpose}
                      <span className="text-slate-500 font-normal ml-1">({item.count} colleges)</span>
                    </span>
                    <span className="font-bold text-slate-900 font-mono">
                      {formatCurrency(item.amount, true)} ({share}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-700 to-indigo-600 h-full rounded-full"
                      style={{ width: `${share}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Maturing Liabilities Summary */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h2 className="text-base font-bold text-slate-900 font-serif">
              Urgent Maturity Liabilities (&lt;30d & Overdue)
            </h2>
            <button
              onClick={handleExportExpiringCSV}
              className="no-print text-xs font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-amber-600" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="space-y-2.5 text-xs">
            {[...overdue, ...urgentApproaching].slice(0, 4).map((item) => {
              return (
                <div key={item.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-900 line-clamp-1">
                      {item.institutionName}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      FDR: {item.fdrNumber} • {item.bankName}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900 font-mono">
                      {formatCurrency(item.amount)}
                    </div>
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${item.maturity.badgeClass}`}>
                      {item.maturity.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Institution-wise Aggregation Table */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
        <h2 className="text-base font-bold text-slate-900 font-serif border-b border-slate-100 pb-3 mb-4">
          Institution-wise Security Deposit Summary
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Institution Name & AICTE ID</th>
                <th className="py-2.5 px-3">State</th>
                <th className="py-2.5 px-3 text-center">FDR Count</th>
                <th className="py-2.5 px-3">Primary Banker</th>
                <th className="py-2.5 px-3">Total Deposit Held (INR)</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {institutionSummaryList.map((inst) => (
                <tr key={inst.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{inst.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{inst.id}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-700">{inst.state}</td>
                  <td className="py-3 px-3 text-center font-bold text-slate-800">{inst.count}</td>
                  <td className="py-3 px-3 text-slate-700">{inst.primaryBank}</td>
                  <td className="py-3 px-3 font-bold text-slate-900 font-mono">
                    {formatCurrency(inst.amount)}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                      inst.status === 'Verified'
                        ? 'bg-emerald-100 text-emerald-800'
                        : inst.status === 'Pending Verification'
                        ? 'bg-amber-100 text-amber-800'
                        : inst.status === 'Under Correction'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {inst.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
