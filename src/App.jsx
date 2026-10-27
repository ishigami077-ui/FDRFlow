import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Registry } from './components/Registry';
import { VerificationDesk } from './components/VerificationDesk';
import { MaturityRadar } from './components/MaturityRadar';
import { Reports } from './components/Reports';
import { GuidelinesView } from './components/GuidelinesView';
import { FDRFormModal } from './components/FDRFormModal';
import { FDRCertificateModal } from './components/FDRCertificateModal';
import { RenewalNoticeModal } from './components/RenewalNoticeModal';
import { GuidelinesModal } from './components/GuidelinesModal';
import { storageService } from './services/storageService';
import { calculateMaturityStatus } from './utils/formatters';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function App() {
  // Main data state
  const [records, setRecords] = useState(() => storageService.getRecords());
  const [currentDate, setCurrentDate] = useState(() => storageService.getSimulatedDate());
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [activeRole, setActiveRole] = useState('admin'); // 'admin' | 'institute'

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [viewingCertificateRecord, setViewingCertificateRecord] = useState(null);
  const [generatingNoticeRecord, setGeneratingNoticeRecord] = useState(null);
  const [isGuidelinesModalOpen, setIsGuidelinesModalOpen] = useState(false);
  const [verificationFdrId, setVerificationFdrId] = useState(null);

  // Toast notification state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Sync records from localStorage if updated
  const refreshRecords = () => {
    setRecords(storageService.getRecords());
  };

  // KPI counts for badges
  const pendingCount = records.filter((r) => r.status === 'Pending Verification').length;
  
  const maturityEnriched = records.map((r) => calculateMaturityStatus(r.maturityDate, currentDate));
  const urgentMaturityCount = maturityEnriched.filter((m) => m.isApproaching && !m.isMatured).length;
  const overdueCount = maturityEnriched.filter((m) => m.isMatured).length;

  // Handlers
  const handleOpenAdd = () => {
    setEditingRecord(null);
    setIsFormModalOpen(true);
  };

  const handleEditRecord = (record) => {
    setEditingRecord(record);
    setIsFormModalOpen(true);
  };

  const handleSaveRecord = (recordData) => {
    if (editingRecord) {
      const updated = storageService.updateRecord(recordData);
      setRecords(updated);
      showToast(`Record ${recordData.fdrNumber} updated successfully!`);
    } else {
      const updated = storageService.addRecord(recordData);
      setRecords(updated);
      showToast(`New FDR ${recordData.fdrNumber} registered and added to AICTE digital ledger!`);
    }
  };

  const handleDeleteRecord = (id) => {
    const updated = storageService.deleteRecord(id);
    setRecords(updated);
    showToast(`FDR record deleted from registry.`, 'info');
  };

  const handleUpdateVerification = (id, status, reviewerName, notes) => {
    const updated = storageService.updateVerification(id, status, reviewerName, notes);
    setRecords(updated);
    showToast(`Deposit status updated to "${status}". Audit trail logged.`);
  };

  const handleRenewDeposit = (id, newDate, newFdrNumber, additionalYears, remarks) => {
    const updated = storageService.renewRecord(id, newDate, newFdrNumber, additionalYears, remarks);
    setRecords(updated);
    showToast(`FDR successfully extended for +${additionalYears} years (Maturity: ${newDate}).`);
  };

  const handleResetData = () => {
    const defaults = storageService.resetToDefault();
    setRecords(defaults);
    showToast('Reset to original Smart India Hackathon demo dataset.', 'info');
  };

  const handleDateChange = (newDate) => {
    storageService.setSimulatedDate(newDate);
    setCurrentDate(newDate);
    showToast(`Portal reference date simulated to: ${newDate}`);
  };

  const handleNavigateToVerification = (record) => {
    setVerificationFdrId(record.id);
    setCurrentTab('verification');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Official Government / AICTE Top Header */}
      <Header
        currentDate={currentDate}
        onDateChange={handleDateChange}
        onResetData={handleResetData}
        onOpenAddModal={handleOpenAdd}
        onOpenGuidelines={() => setIsGuidelinesModalOpen(true)}
        activeRole={activeRole}
        onRoleChange={setActiveRole}
        pendingCount={pendingCount}
        urgentMaturityCount={urgentMaturityCount}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Navy Blue Government Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          pendingCount={pendingCount}
          urgentMaturityCount={urgentMaturityCount}
          overdueCount={overdueCount}
          totalRecords={records.length}
          onOpenGuidelines={() => setIsGuidelinesModalOpen(true)}
        />

        {/* Tab Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          {currentTab === 'dashboard' && (
            <Dashboard
              records={records}
              currentDate={currentDate}
              onNavigate={setCurrentTab}
              onOpenAddModal={handleOpenAdd}
              onViewCertificate={setViewingCertificateRecord}
              onGenerateNotice={setGeneratingNoticeRecord}
            />
          )}

          {currentTab === 'registry' && (
            <Registry
              records={records}
              currentDate={currentDate}
              onOpenAddModal={handleOpenAdd}
              onEditRecord={handleEditRecord}
              onDeleteRecord={handleDeleteRecord}
              onViewCertificate={setViewingCertificateRecord}
              onGenerateNotice={setGeneratingNoticeRecord}
              onNavigateToVerification={handleNavigateToVerification}
            />
          )}

          {currentTab === 'verification' && (
            <VerificationDesk
              records={records}
              onUpdateVerification={handleUpdateVerification}
              onViewCertificate={setViewingCertificateRecord}
              selectedFdrId={verificationFdrId}
            />
          )}

          {currentTab === 'maturity' && (
            <MaturityRadar
              records={records}
              currentDate={currentDate}
              onGenerateNotice={setGeneratingNoticeRecord}
              onViewCertificate={setViewingCertificateRecord}
              onRenewDeposit={handleRenewDeposit}
            />
          )}

          {currentTab === 'reports' && (
            <Reports
              records={records}
              currentDate={currentDate}
            />
          )}

          {currentTab === 'guidelines' && (
            <GuidelinesView
              onOpenAddModal={handleOpenAdd}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      {/* 1. Register / Edit FDR Modal */}
      <FDRFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveRecord}
        editingRecord={editingRecord}
      />

      {/* 2. Official Bank FDR Certificate Viewer Modal */}
      {viewingCertificateRecord && (
        <FDRCertificateModal
          fdr={viewingCertificateRecord}
          onClose={() => setViewingCertificateRecord(null)}
        />
      )}

      {/* 3. Official AICTE Renewal Notice Demand Letter Modal */}
      {generatingNoticeRecord && (
        <RenewalNoticeModal
          fdr={generatingNoticeRecord}
          currentDate={currentDate}
          onClose={() => setGeneratingNoticeRecord(null)}
        />
      )}

      {/* 4. AICTE Regulatory Guidelines Reference Modal */}
      {isGuidelinesModalOpen && (
        <GuidelinesModal
          onClose={() => setIsGuidelinesModalOpen(false)}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in flex items-center space-x-2.5 px-4 py-3 rounded-lg shadow-xl text-xs font-semibold border bg-slate-900 text-white border-slate-700">
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-red-400" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-blue-400" />}
          <span>{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="p-1 text-slate-400 hover:text-white rounded cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
