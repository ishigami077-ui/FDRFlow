import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Calendar, 
  RotateCcw, 
  PlusCircle, 
  UserCheck, 
  ExternalLink,
  ChevronDown,
  Sparkles,
  Info
} from 'lucide-react';
import { formatDate } from '../utils/formatters';

export function Header({ 
  currentDate, 
  onDateChange, 
  onResetData, 
  onOpenAddModal, 
  onOpenGuidelines,
  activeRole,
  onRoleChange,
  pendingCount,
  urgentMaturityCount
}) {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [tempDate, setTempDate] = useState(currentDate);

  const handleApplyDate = () => {
    onDateChange(tempDate);
    setShowDateModal(false);
  };

  const handleResetConfirm = () => {
    if (window.confirm('Reset all demo data back to the default Smart India Hackathon dataset? Any custom additions will be restored to original sample records.')) {
      onResetData();
    }
  };

  return (
    <header className="bg-[#0B2545] text-white border-b border-blue-900 sticky top-0 z-30 shadow-md">
      {/* Top Ministry / AICTE Identity Bar */}
      <div className="bg-[#071930] px-4 py-1.5 border-b border-blue-950/60 text-xs text-blue-200 flex flex-wrap justify-between items-center">
        <div className="flex items-center space-x-3">
          <span className="font-semibold tracking-wide text-amber-300">
            भारत सरकार | Government of India
          </span>
          <span className="text-blue-400">|</span>
          <span className="hidden sm:inline text-blue-200">
            अखिल भारतीय तकनीकी शिक्षा परिषद (AICTE)
          </span>
          <span className="hidden md:inline text-blue-400">•</span>
          <span className="hidden md:inline text-blue-300">
            Ministry of Education
          </span>
        </div>

        <div className="flex items-center space-x-3 text-[11px]">
          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            SIH Prototype • Fictional Demo Sandbox
          </span>

          <button
            onClick={onOpenGuidelines}
            className="hover:text-white text-blue-300 underline underline-offset-2 flex items-center gap-1 transition-colors"
          >
            <Info className="w-3 h-3" />
            AICTE FDR Norms
          </button>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
        {/* Brand Logo & Council Name */}
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center shadow-inner border border-blue-400/30">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white font-serif">
                FDR<span className="text-amber-400">Flow</span>
              </span>
              <span className="bg-blue-800/80 text-blue-200 text-[10px] font-semibold px-2 py-0.5 rounded border border-blue-700 uppercase tracking-wider">
                AICTE e-Ledger
              </span>
            </div>
            <p className="text-[11px] text-blue-200/80 hidden sm:block">
              Security Deposit & Fixed Deposit Receipt Central Management Portal
            </p>
          </div>
        </div>

        {/* Action Controls & User Switcher */}
        <div className="flex items-center space-x-2.5">
          {/* Quick Date Simulation Button */}
          <button
            onClick={() => setShowDateModal(true)}
            className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1.5 rounded bg-blue-900/60 hover:bg-blue-900 text-blue-200 hover:text-white border border-blue-700/60 text-xs transition-colors"
            title="Adjust Simulated Date to test maturity countdowns"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>Ref Date: <strong className="text-white">{formatDate(currentDate)}</strong></span>
          </button>

          {/* Quick Register FDR Button */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold px-3 py-1.5 rounded shadow-sm hover:shadow text-xs transition-all active:scale-95 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-slate-950" />
            <span className="hidden sm:inline">Register FDR</span>
            <span className="sm:hidden">New</span>
          </button>

          {/* Reset Demo Data Button */}
          <button
            onClick={handleResetConfirm}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded bg-blue-950/80 hover:bg-red-950/80 text-blue-300 hover:text-red-200 border border-blue-800 hover:border-red-800 text-xs transition-colors cursor-pointer"
            title="Reset to default mock records"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Reset Demo</span>
          </button>

          {/* Role Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center space-x-2 bg-blue-950/90 hover:bg-blue-900/90 border border-blue-700/80 rounded px-2.5 py-1 text-xs cursor-pointer transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center font-bold text-[11px]">
                {activeRole === 'admin' ? 'FO' : 'NO'}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-[11px] font-semibold text-white leading-tight">
                  {activeRole === 'admin' ? 'Finance Officer' : 'Institute Nodal'}
                </div>
                <div className="text-[9px] text-blue-300">
                  {activeRole === 'admin' ? 'AICTE HQ Delhi' : 'Affiliated College'}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-blue-300" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white text-slate-900 rounded-lg shadow-xl border border-slate-200 py-2 z-50 text-xs">
                <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] text-slate-500 font-medium">
                  Switch Active Role Persona:
                </div>
                <button
                  onClick={() => {
                    onRoleChange('admin');
                    setShowRoleMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center space-x-2.5 hover:bg-slate-50 ${
                    activeRole === 'admin' ? 'bg-blue-50 font-semibold text-blue-900' : ''
                  }`}
                >
                  <div className="w-6 h-6 rounded bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                    HQ
                  </div>
                  <div>
                    <div className="text-slate-900 font-medium">AICTE Finance Officer</div>
                    <div className="text-[10px] text-slate-500">Full verification & registry audit privileges</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onRoleChange('institute');
                    setShowRoleMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center space-x-2.5 hover:bg-slate-50 ${
                    activeRole === 'institute' ? 'bg-blue-50 font-semibold text-blue-900' : ''
                  }`}
                >
                  <div className="w-6 h-6 rounded bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold">
                    CL
                  </div>
                  <div>
                    <div className="text-slate-900 font-medium">College Nodal Officer</div>
                    <div className="text-[10px] text-slate-500">Submit deposit & view institution receipts</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Date Simulation Modal */}
      {showDateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white text-slate-900 rounded-xl shadow-2xl max-w-md w-full p-5 border border-slate-200">
            <div className="flex items-center space-x-2.5 text-blue-900 font-bold text-base mb-2">
              <Calendar className="w-5 h-5 text-blue-700" />
              <span>Simulate Reference Date</span>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              For Smart India Hackathon testing: Change the portal reference date to see maturity radar recalculate days remaining, trigger the 30-day alerts, and highlight overdue deposits.
            </p>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Portal Current Date (YYYY-MM-DD):
              </label>
              <input
                type="date"
                value={tempDate}
                onChange={(e) => setTempDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
              />
            </div>

            <div className="flex flex-wrap gap-2 mb-4 text-xs">
              <span className="text-slate-500 text-[11px] w-full">Quick jump presets:</span>
              <button
                type="button"
                onClick={() => setTempDate('2026-10-27')}
                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-700"
              >
                Today (27 Oct 2026)
              </button>
              <button
                type="button"
                onClick={() => setTempDate('2026-11-04')}
                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-700"
              >
                1 Week Later (04 Nov 2026)
              </button>
              <button
                type="button"
                onClick={() => setTempDate('2026-11-16')}
                className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded border border-amber-200"
              >
                Matured Presets (16 Nov 2026)
              </button>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowDateModal(false)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyDate}
                className="px-4 py-1.5 text-xs font-semibold bg-blue-700 hover:bg-blue-800 text-white rounded shadow-sm"
              >
                Apply Date
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
