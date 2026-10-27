import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Upload, 
  FileText, 
  Building2, 
  Landmark, 
  Calendar, 
  Percent, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  Info
} from 'lucide-react';
import { BANK_LIST, PURPOSE_LIST, INDIAN_STATES } from '../data/mockData';
import { formatCurrency } from '../utils/formatters';

export function FDRFormModal({ isOpen, onClose, onSave, editingRecord = null }) {
  const isEditMode = Boolean(editingRecord);

  // Form states
  const [formData, setFormData] = useState({
    institutionName: '',
    institutionId: 'AICTE-1-',
    state: 'Maharashtra',
    fdrNumber: '',
    bankName: BANK_LIST[0],
    branchName: '',
    ifscCode: '',
    accountNumber: '',
    amount: '',
    interestRate: '7.25',
    issueDate: new Date().toISOString().split('T')[0],
    maturityDate: '',
    purpose: PURPOSE_LIST[0],
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    autoRenewal: false,
    documentFileName: '',
  });

  const [errors, setErrors] = useState({});
  const [fileAttached, setFileAttached] = useState(false);

  // Set default 5-year maturity date when issueDate changes if not in edit mode
  useEffect(() => {
    if (isOpen) {
      if (editingRecord) {
        setFormData({
          ...editingRecord,
          amount: editingRecord.amount ? String(editingRecord.amount) : '',
          interestRate: editingRecord.interestRate ? String(editingRecord.interestRate) : '7.25',
        });
        setFileAttached(Boolean(editingRecord.documentFileName));
      } else {
        const today = new Date();
        const future = new Date(today);
        future.setFullYear(today.getFullYear() + 5);
        
        setFormData({
          institutionName: '',
          institutionId: `AICTE-1-${Math.floor(1000000 + Math.random() * 9000000)}`,
          state: 'Maharashtra',
          fdrNumber: `FDR-${Math.floor(100000 + Math.random() * 900000)}`,
          bankName: BANK_LIST[0],
          branchName: 'Main Corporate Branch',
          ifscCode: 'SBIN0001829',
          accountNumber: `${Math.floor(1000000000 + Math.random() * 9000000000)}-AICTE`,
          amount: '5000000',
          interestRate: '7.25',
          issueDate: today.toISOString().split('T')[0],
          maturityDate: future.toISOString().split('T')[0],
          purpose: PURPOSE_LIST[0],
          contactPerson: 'Dr. Principal / Director',
          contactEmail: 'registrar@institution.edu.in',
          contactPhone: '+91 98765 43210',
          autoRenewal: false,
          documentFileName: 'AICTE_Joint_FDR_Receipt.pdf',
        });
        setFileAttached(true);
      }
      setErrors({});
    }
  }, [isOpen, editingRecord]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field-specific error
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        documentFileName: file.name,
      }));
      setFileAttached(true);
    }
  };

  const generateQuickReceipt = () => {
    const generatedName = `${formData.bankName.replace(/\s+/g, '_')}_FDR_${formData.fdrNumber || 'REC'}.pdf`;
    setFormData((prev) => ({
      ...prev,
      documentFileName: generatedName,
    }));
    setFileAttached(true);
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.institutionName.trim()) {
      newErrors.institutionName = 'Institution name is required';
    }
    if (!formData.institutionId.trim() || formData.institutionId.length < 5) {
      newErrors.institutionId = 'Valid AICTE Permanent ID is required (e.g., AICTE-1-XXXXXXX)';
    }
    if (!formData.fdrNumber.trim()) {
      newErrors.fdrNumber = 'FDR Receipt number is mandatory';
    }
    if (!formData.branchName.trim()) {
      newErrors.branchName = 'Bank branch name is required';
    }
    if (!formData.ifscCode.trim() || formData.ifscCode.length < 8) {
      newErrors.ifscCode = 'Valid 11-digit bank IFSC code is required';
    }
    
    const amountNum = Number(formData.amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      newErrors.amount = 'Please enter a valid deposit amount greater than ₹0';
    }

    const rateNum = Number(formData.interestRate);
    if (isNaN(rateNum) || rateNum <= 0 || rateNum > 20) {
      newErrors.interestRate = 'Please specify realistic interest rate (e.g. 7.25%)';
    }

    if (!formData.issueDate) {
      newErrors.issueDate = 'Issue date is required';
    }
    if (!formData.maturityDate) {
      newErrors.maturityDate = 'Maturity date is required';
    } else if (new Date(formData.maturityDate) <= new Date(formData.issueDate)) {
      newErrors.maturityDate = 'Maturity date must be strictly after the issue date';
    }

    if (!fileAttached && !formData.documentFileName) {
      newErrors.document = 'Please attach an FDR receipt document or generate an e-receipt';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Calculate tenure in years
    const start = new Date(formData.issueDate);
    const end = new Date(formData.maturityDate);
    const diffYears = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24 * 365.25)));

    const recordToSave = {
      ...formData,
      amount: Number(formData.amount),
      interestRate: Number(formData.interestRate),
      tenureYears: diffYears,
      lienEndorsed: true,
      documentFileName: formData.documentFileName || 'Digital_Bank_FDR_Receipt.pdf',
    };

    onSave(recordToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full border border-slate-300 overflow-hidden my-6">
        {/* Form Modal Header */}
        <div className="bg-[#0B2545] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-blue-700 flex items-center justify-center shadow">
              <Landmark className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-serif">
                {isEditMode ? 'Edit Fixed Deposit Receipt Record' : 'Register New Institutional FDR'}
              </h2>
              <p className="text-xs text-blue-200">
                AICTE Official Security Deposit & Joint Lien Central Ledger Submission
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-blue-300 hover:text-white hover:bg-blue-900 rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[78vh] overflow-y-auto text-xs sm:text-sm">
          {/* Quick Demo Pre-fill Pill */}
          {!isEditMode && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center space-x-2 text-blue-900">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  <strong>Hackathon Demo Tip:</strong> Fields are pre-filled with realistic sample parameters for quick testing. You can customize them or click Save directly!
                </span>
              </div>
            </div>
          )}

          {/* Section 1: Institution Details */}
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/60">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-950 flex items-center gap-1.5 mb-3">
              <Building2 className="w-4 h-4 text-blue-700" />
              1. Technical Institution Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Institution Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.institutionName}
                  onChange={(e) => handleChange('institutionName', e.target.value)}
                  placeholder="e.g., Delhi Institute of Engineering & Technology"
                  className={`w-full px-3 py-2 border rounded-md text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                    errors.institutionName ? 'border-red-400 bg-red-50' : 'border-slate-300'
                  }`}
                />
                {errors.institutionName && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.institutionName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  AICTE Permanent ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.institutionId}
                  onChange={(e) => handleChange('institutionId', e.target.value)}
                  placeholder="AICTE-1-XXXXXXX"
                  className={`w-full px-3 py-2 border rounded-md text-xs sm:text-sm font-mono bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                    errors.institutionId ? 'border-red-400 bg-red-50' : 'border-slate-300'
                  }`}
                />
                {errors.institutionId && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.institutionId}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  State / Region <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nodal Officer / Principal
                </label>
                <input
                  type="text"
                  value={formData.contactPerson}
                  onChange={(e) => handleChange('contactPerson', e.target.value)}
                  placeholder="e.g. Dr. Ramesh Kumar"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Official Email
                </label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleChange('contactEmail', e.target.value)}
                  placeholder="registrar@college.edu.in"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Banking Particulars */}
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/60">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-950 flex items-center gap-1.5 mb-3">
              <Landmark className="w-4 h-4 text-blue-700" />
              2. Bank & Branch Particulars
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Scheduled Bank Name <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.bankName}
                  onChange={(e) => handleChange('bankName', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                >
                  {BANK_LIST.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Branch Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.branchName}
                  onChange={(e) => handleChange('branchName', e.target.value)}
                  placeholder="e.g. Connaught Place, New Delhi"
                  className={`w-full px-3 py-2 border rounded-md text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                    errors.branchName ? 'border-red-400 bg-red-50' : 'border-slate-300'
                  }`}
                />
                {errors.branchName && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.branchName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Branch IFSC Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.ifscCode}
                  onChange={(e) => handleChange('ifscCode', e.target.value.toUpperCase())}
                  placeholder="e.g. SBIN0001829"
                  maxLength={11}
                  className={`w-full px-3 py-2 border rounded-md text-xs sm:text-sm font-mono uppercase bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                    errors.ifscCode ? 'border-red-400 bg-red-50' : 'border-slate-300'
                  }`}
                />
                {errors.ifscCode && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.ifscCode}</p>
                )}
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mandatory Joint Account Title
                </label>
                <input
                  type="text"
                  disabled
                  value="Jointly in the Name of [Institution] & The Member Secretary, AICTE, New Delhi"
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs bg-slate-100 text-slate-600 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Deposit Financials & Dates */}
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/60">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-950 flex items-center gap-1.5 mb-3">
              <FileText className="w-4 h-4 text-blue-700" />
              3. Fixed Deposit Financial Terms & Tenures
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  FDR Receipt Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.fdrNumber}
                  onChange={(e) => handleChange('fdrNumber', e.target.value)}
                  placeholder="e.g. SBI-FDR-9840291"
                  className={`w-full px-3 py-2 border rounded-md text-xs sm:text-sm font-mono bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                    errors.fdrNumber ? 'border-red-400 bg-red-50' : 'border-slate-300'
                  }`}
                />
                {errors.fdrNumber && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.fdrNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Deposit Amount (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleChange('amount', e.target.value)}
                  placeholder="e.g. 5000000"
                  step="10000"
                  className={`w-full px-3 py-2 border rounded-md text-xs sm:text-sm font-bold bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                    errors.amount ? 'border-red-400 bg-red-50' : 'border-slate-300'
                  }`}
                />
                <span className="text-[11px] text-blue-700 font-semibold mt-1 block">
                  {formatCurrency(formData.amount)} ({formatCurrency(formData.amount, true)})
                </span>
                {errors.amount && (
                  <p className="text-[11px] text-red-600 mt-0.5">{errors.amount}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Interest Rate (% p.a.) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.interestRate}
                  onChange={(e) => handleChange('interestRate', e.target.value)}
                  placeholder="7.25"
                  step="0.05"
                  className={`w-full px-3 py-2 border rounded-md text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                    errors.interestRate ? 'border-red-400 bg-red-50' : 'border-slate-300'
                  }`}
                />
                {errors.interestRate && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.interestRate}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Deposit Purpose <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.purpose}
                  onChange={(e) => handleChange('purpose', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {PURPOSE_LIST.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Date of Issue <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.issueDate}
                  onChange={(e) => handleChange('issueDate', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Maturity Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.maturityDate}
                  onChange={(e) => handleChange('maturityDate', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                    errors.maturityDate ? 'border-red-400 bg-red-50' : 'border-slate-300'
                  }`}
                />
                {errors.maturityDate && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.maturityDate}</p>
                )}
              </div>

              <div className="md:col-span-2 flex items-center pt-5">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.autoRenewal}
                    onChange={(e) => handleChange('autoRenewal', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <span className="text-xs font-medium text-slate-800">
                    Auto-Renewal Clause recorded in Bank Treasury Instructions
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Section 4: Supporting Document Attachment */}
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/60">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-950 flex items-center gap-1.5 mb-2">
              <Upload className="w-4 h-4 text-blue-700" />
              4. Attached Fixed Deposit Receipt (E-FDR / Scan)
            </h3>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-2 border-dashed border-slate-300 rounded-lg bg-white">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-800">
                    {formData.documentFileName || 'No Document Attached Yet'}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Upload scanned copy of original Bank Fixed Deposit Receipt (PDF, PNG, JPG)
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <label className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-300 cursor-pointer transition-colors">
                  <span>Browse File</span>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={generateQuickReceipt}
                  className="px-3 py-1.5 text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 rounded border border-blue-200 flex items-center gap-1 cursor-pointer transition-colors"
                  title="Generate realistic digital bank receipt attachment"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate E-Receipt</span>
                </button>
              </div>
            </div>

            {errors.document && (
              <p className="text-[11px] text-red-600 mt-1">{errors.document}</p>
            )}
          </div>

          {/* Form Actions Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-200">
            <div className="text-[11px] text-slate-500">
              Record will be submitted to the AICTE Digital Ledger and queued for verification.
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold bg-blue-700 hover:bg-blue-800 text-white rounded-md shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isEditMode ? 'Update Record' : 'Register FDR'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
