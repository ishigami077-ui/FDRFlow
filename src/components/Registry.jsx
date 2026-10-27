import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Download, 
  Plus, 
  FileText, 
  Eye, 
  Edit3, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  ClockAlert, 
  X,
  FileCheck2,
  Sparkles,
  RotateCcw,
  Landmark,
  Building2,
  ExternalLink
} from 'lucide-react';
import { BANK_LIST, PURPOSE_LIST } from '../data/mockData';
import { formatCurrency, formatDate, calculateMaturityStatus, downloadCSV } from '../utils/formatters';

export function Registry({ 
  records, 
  currentDate, 
  onOpenAddModal, 
  onEditRecord, 
  onDeleteRecord, 
  onViewCertificate, 
  onGenerateNotice,
  onNavigateToVerification 
}) {
  // Search & Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedBank, setSelectedBank] = useState('ALL');
  const [selectedPurpose, setSelectedPurpose] = useState('ALL');
  const [selectedMaturity, setSelectedMaturity] = useState('ALL');
  const [sortBy, setSortBy] = useState('maturity-asc'); // maturity-asc, maturity-desc, amount-desc, amount-asc, date-desc

  // Delete modal state
  const [recordToDelete, setRecordToDelete] = useState(null);

  // Compute enriched records with maturity calculations
  const enrichedRecords = useMemo(() => {
    return records.map((rec) => ({
      ...rec,
      maturityInfo: calculateMaturityStatus(rec.maturityDate, currentDate),
    }));
  }, [records, currentDate]);

  // Filter & Search Logic
  const filteredRecords = useMemo(() => {
    return enrichedRecords.filter((rec) => {
      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchName = rec.institutionName?.toLowerCase().includes(query);
        const matchId = rec.institutionId?.toLowerCase().includes(query);
        const matchFdr = rec.fdrNumber?.toLowerCase().includes(query);
        const matchBank = rec.bankName?.toLowerCase().includes(query);
        const matchBranch = rec.branchName?.toLowerCase().includes(query);
        const matchContact = rec.contactPerson?.toLowerCase().includes(query);

        if (!matchName && !matchId && !matchFdr && !matchBank && !matchBranch && !matchContact) {
          return false;
        }
      }

      // Status filter
      if (selectedStatus !== 'ALL' && rec.status !== selectedStatus) {
        return false;
      }

      // Bank filter
      if (selectedBank !== 'ALL' && rec.bankName !== selectedBank) {
        return false;
      }

      // Purpose filter
      if (selectedPurpose !== 'ALL' && rec.purpose !== selectedPurpose) {
        return false;
      }

      // Maturity filter
      if (selectedMaturity === 'APPROACHING') {
        if (!rec.maturityInfo.isApproaching || rec.maturityInfo.isMatured) return false;
      } else if (selectedMaturity === 'OVERDUE') {
        if (!rec.maturityInfo.isMatured) return false;
      } else if (selectedMaturity === '90DAYS') {
        if (rec.maturityInfo.daysRemaining < 0 || rec.maturityInfo.daysRemaining > 90) return false;
      } else if (selectedMaturity === 'ACTIVE') {
        if (rec.maturityInfo.daysRemaining <= 30) return false;
      }

      return true;
    });
  }, [enrichedRecords, searchTerm, selectedStatus, selectedBank, selectedPurpose, selectedMaturity]);

  // Sort Logic
  const sortedRecords = useMemo(() => {
    const list = [...filteredRecords];
    switch (sortBy) {
      case 'maturity-asc':
        return list.sort((a, b) => new Date(a.maturityDate) - new Date(b.maturityDate));
      case 'maturity-desc':
        return list.sort((a, b) => new Date(b.maturityDate) - new Date(a.maturityDate));
      case 'amount-desc':
        return list.sort((a, b) => (Number(b.amount) || 0) - (Number(a.amount) || 0));
      case 'amount-asc':
        return list.sort((a, b) => (Number(a.amount) || 0) - (Number(b.amount) || 0));
      case 'date-desc':
        return list.sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate));
      case 'name-asc':
        return list.sort((a, b) => (a.institutionName || '').localeCompare(b.institutionName || ''));
      default:
        return list;
    }
  }, [filteredRecords, sortBy]);

  // Summary figures
  const totalFilteredAmount = sortedRecords.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

  // Clear filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('ALL');
    setSelectedBank('ALL');
    setSelectedPurpose('ALL');
    setSelectedMaturity('ALL');
    setSortBy('maturity-asc');
  };

  // Export CSV handler
  const handleExportCSV = () => {
    const columns = [
      { label: 'Record ID', key: 'id' },
      { label: 'Institution Name', key: 'institutionName' },
      { label: 'AICTE ID', key: 'institutionId' },
      { label: 'State', key: 'state' },
      { label: 'FDR Number', key: 'fdrNumber' },
      { label: 'Bank Name', key: 'bankName' },
      { label: 'Branch Name', key: 'branchName' },
      { label: 'IFSC Code', key: 'ifscCode' },
      { label: 'Joint Account', key: 'accountNumber' },
      { label: 'Deposit Amount (INR)', key: 'amount' },
      { label: 'Interest Rate (%)', key: 'interestRate' },
      { label: 'Issue Date', key: 'issueDate' },
      { label: 'Maturity Date', key: 'maturityDate' },
      { label: 'Days Remaining', key: 'daysRemaining', format: (_, item) => item.maturityInfo?.daysRemaining },
      { label: 'Maturity Status', key: 'maturityStatus', format: (_, item) => item.maturityInfo?.status },
      { label: 'Purpose of Deposit', key: 'purpose' },
      { label: 'Verification Status', key: 'status' },
      { label: 'Verified By', key: 'verifiedBy' },
      { label: 'Verified Date', key: 'verifiedAt' },
      { label: 'Audit Notes', key: 'verificationNotes' },
      { label: 'Nodal Contact', key: 'contactPerson' },
      { label: 'Nodal Email', key: 'contactEmail' },
    ];

    downloadCSV(`AICTE_FDR_Master_Ledger_${new Date().toISOString().split('T')[0]}`, columns, sortedRecords);
  };

  const confirmDelete = () => {
    if (recordToDelete) {
      onDeleteRecord(recordToDelete.id);
      setRecordToDelete(null);
    }
  };

  const hasActiveFilters = 
    searchTerm || 
    selectedStatus !== 'ALL' || 
    selectedBank !== 'ALL' || 
    selectedPurpose !== 'ALL' || 
    selectedMaturity !== 'ALL';

  return (
    <div className="space-y-5 pb-12">
      {/* Top Banner & Title */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-900">
            <Landmark className="w-4 h-4 text-blue-700" />
            <span>AICTE Centralized FDR Ledger</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif mt-1">
            Institutional Fixed Deposit Registry
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Search, filter, inspect, edit, and audit fixed deposit receipts across all AICTE-affiliated institutions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenAddModal}
            className="px-4 py-2 text-xs font-semibold bg-blue-700 hover:bg-blue-800 text-white rounded-lg shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Deposit Record</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            title="Export filtered records as Excel CSV"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Institution Name, AICTE ID, FDR Number, Bank, Branch, or Nodal Officer..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-900"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dropdown Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 text-xs">
          {/* Status */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Verification Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
            >
              <option value="ALL">All Statuses</option>
              <option value="Verified">Verified Only</option>
              <option value="Pending Verification">Pending Verification</option>
              <option value="Under Correction">Under Correction</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Maturity Horizon */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Maturity Window
            </label>
            <select
              value={selectedMaturity}
              onChange={(e) => setSelectedMaturity(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
            >
              <option value="ALL">All Horizons</option>
              <option value="APPROACHING">⚠️ Expiring &lt;30 Days</option>
              <option value="OVERDUE">⛔ Matured / Overdue</option>
              <option value="90DAYS">Upcoming (Within 90d)</option>
              <option value="ACTIVE">Active &gt;30 Days</option>
            </select>
          </div>

          {/* Bank */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Scheduled Bank
            </label>
            <select
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 truncate"
            >
              <option value="ALL">All Banks</option>
              {BANK_LIST.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Purpose */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Deposit Purpose
            </label>
            <select
              value={selectedPurpose}
              onChange={(e) => setSelectedPurpose(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 truncate"
            >
              <option value="ALL">All Purposes</option>
              {PURPOSE_LIST.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Sort Order
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
            >
              <option value="maturity-asc">Maturity Date (Soonest First)</option>
              <option value="maturity-desc">Maturity Date (Furthest First)</option>
              <option value="amount-desc">Amount (Highest First)</option>
              <option value="amount-asc">Amount (Lowest First)</option>
              <option value="date-desc">Issue Date (Newest First)</option>
              <option value="name-asc">Institution Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Filter Summary & Reset Pill */}
        <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-600 gap-2">
          <div className="flex items-center gap-2">
            <span>
              Showing <strong>{sortedRecords.length}</strong> of <strong>{records.length}</strong> records
            </span>
            <span>•</span>
            <span>
              Cumulative Filtered Sum: <strong className="text-slate-900 font-serif">{formatCurrency(totalFilteredAmount)}</strong> ({formatCurrency(totalFilteredAmount, true)})
            </span>
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="text-xs text-red-600 hover:text-red-800 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear All Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#0B2545] text-white uppercase text-[11px] font-semibold tracking-wider">
              <tr>
                <th className="py-3 px-3.5">Institution Details</th>
                <th className="py-3 px-3.5">FDR & Bank Info</th>
                <th className="py-3 px-3.5">Principal Amount</th>
                <th className="py-3 px-3.5">Maturity Date & Countdown</th>
                <th className="py-3 px-3.5">Mandated Purpose</th>
                <th className="py-3 px-3.5">Verification</th>
                <th className="py-3 px-3.5">Document</th>
                <th className="py-3 px-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {sortedRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Search className="w-8 h-8 text-slate-300" />
                      <p className="font-semibold text-slate-700">No FDR records match your query.</p>
                      <p className="text-xs text-slate-500">Try adjusting your search criteria or resetting filters.</p>
                      <button
                        onClick={handleClearFilters}
                        className="mt-2 px-3 py-1 bg-blue-50 text-blue-700 rounded border border-blue-200 hover:bg-blue-100 text-xs font-semibold cursor-pointer"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedRecords.map((item) => {
                  return (
                    <tr 
                      key={item.id} 
                      className={`hover:bg-blue-50/50 transition-colors ${
                        item.maturityInfo.isMatured 
                          ? 'bg-red-50/20' 
                          : item.maturityInfo.isApproaching 
                          ? 'bg-amber-50/20' 
                          : ''
                      }`}
                    >
                      {/* Institution */}
                      <td className="py-3.5 px-3.5 align-top">
                        <div className="font-bold text-slate-900 leading-tight">
                          {item.institutionName}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                          {item.institutionId}
                        </div>
                        <div className="text-[11px] text-slate-600 mt-0.5">
                          {item.state} • {item.contactPerson || 'Nodal Officer'}
                        </div>
                      </td>

                      {/* FDR & Bank Info */}
                      <td className="py-3.5 px-3.5 align-top">
                        <div className="font-mono font-bold text-blue-950">
                          {item.fdrNumber}
                        </div>
                        <div className="text-slate-800 font-medium mt-0.5">
                          {item.bankName}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {item.branchName} • <span className="font-mono">{item.ifscCode}</span>
                        </div>
                      </td>

                      {/* Principal Amount */}
                      <td className="py-3.5 px-3.5 align-top whitespace-nowrap">
                        <div className="font-bold text-slate-900 font-mono text-sm">
                          {formatCurrency(item.amount)}
                        </div>
                        <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                          {item.interestRate}% p.a. • {item.tenureYears || 5}Y
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Issued: {formatDate(item.issueDate)}
                        </div>
                      </td>

                      {/* Maturity Date & Countdown */}
                      <td className="py-3.5 px-3.5 align-top">
                        <div className="font-bold text-slate-900 text-xs">
                          {formatDate(item.maturityDate)}
                        </div>
                        <div className="mt-1">
                          <span className={`inline-block px-2 py-0.5 rounded text-[11px] border ${item.maturityInfo.badgeClass}`}>
                            {item.maturityInfo.label}
                          </span>
                        </div>
                        {item.autoRenewal && (
                          <div className="text-[10px] text-blue-600 font-medium mt-0.5">
                            ⚡ Auto-Renewal Listed
                          </div>
                        )}
                      </td>

                      {/* Purpose */}
                      <td className="py-3.5 px-3.5 align-top">
                        <span className="inline-block bg-slate-100 text-slate-800 border border-slate-200 px-2 py-1 rounded text-[11px] font-medium leading-tight">
                          {item.purpose}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3.5 align-top whitespace-nowrap">
                        <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold border ${
                          item.status === 'Verified'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : item.status === 'Pending Verification'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : item.status === 'Under Correction'
                            ? 'bg-purple-50 text-purple-800 border-purple-300'
                            : 'bg-red-50 text-red-800 border-red-300'
                        }`}>
                          {item.status}
                        </span>

                        {item.status === 'Pending Verification' && (
                          <button
                            onClick={() => onNavigateToVerification(item)}
                            className="block text-[10px] text-blue-700 hover:underline font-semibold mt-1 cursor-pointer"
                          >
                            Review Now →
                          </button>
                        )}
                      </td>

                      {/* Attached Document */}
                      <td className="py-3.5 px-3.5 align-top whitespace-nowrap">
                        <button
                          onClick={() => onViewCertificate(item)}
                          className="flex items-center space-x-1 px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-[11px] font-medium transition-colors cursor-pointer"
                          title="Open Bank FDR Certificate Viewer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Receipt</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-3.5 align-top text-right whitespace-nowrap space-x-1">
                        {(item.maturityInfo.isApproaching || item.maturityInfo.isMatured) && (
                          <button
                            onClick={() => onGenerateNotice(item)}
                            className="p-1.5 text-amber-700 hover:text-amber-900 hover:bg-amber-100 rounded transition-colors cursor-pointer inline-block"
                            title="Generate AICTE Renewal Demand Notice"
                          >
                            <ClockAlert className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => onEditRecord(item)}
                          className="p-1.5 text-blue-700 hover:text-blue-900 hover:bg-blue-100 rounded transition-colors cursor-pointer inline-block"
                          title="Edit FDR Details"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setRecordToDelete(item)}
                          className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors cursor-pointer inline-block"
                          title="Delete FDR Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {recordToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 border border-slate-200">
            <div className="flex items-center space-x-2 text-red-600 font-bold text-base mb-2">
              <AlertCircle className="w-5 h-5" />
              <span>Confirm Permanent Deletion</span>
            </div>
            <p className="text-xs text-slate-700 mb-2 leading-relaxed">
              Are you sure you want to delete the FDR record for <strong>{recordToDelete.institutionName}</strong>?
            </p>
            <div className="bg-red-50 p-3 rounded border border-red-200 text-xs font-mono text-red-900 mb-4">
              <div>FDR No: {recordToDelete.fdrNumber}</div>
              <div>Bank: {recordToDelete.bankName}</div>
              <div>Principal: {formatCurrency(recordToDelete.amount)}</div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setRecordToDelete(null)}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded shadow-sm cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
