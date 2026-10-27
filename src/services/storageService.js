/**
 * FDRFlow - LocalStorage Persistence Service
 * Enables smooth offline persistence with reset controls for the hackathon prototype.
 */

import { INITIAL_FDR_RECORDS } from '../data/mockData';

const STORAGE_KEY = 'fdrflow_aicte_records_v1';
const SIMULATED_DATE_KEY = 'fdrflow_aicte_simulated_date_v1';

export const storageService = {
  /**
   * Get all FDR records from localStorage or seed with defaults
   */
  getRecords: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load FDR records from localStorage:', e);
    }
    // Seed default records
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_FDR_RECORDS));
    return INITIAL_FDR_RECORDS;
  },

  /**
   * Save records array to localStorage
   */
  saveRecords: (records) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
      return true;
    } catch (e) {
      console.error('Failed to save FDR records:', e);
      return false;
    }
  },

  /**
   * Add a new FDR record
   */
  addRecord: (newRecord) => {
    const records = storageService.getRecords();
    const id = `FDR-${new Date().getFullYear()}-${String(records.length + 1).padStart(3, '0')}`;
    
    const recordWithMeta = {
      ...newRecord,
      id,
      amount: Number(newRecord.amount),
      interestRate: Number(newRecord.interestRate),
      status: newRecord.status || 'Pending Verification',
      verifiedBy: null,
      verifiedAt: null,
      verificationNotes: null,
      history: [
        {
          action: 'Record Created & Registered',
          by: newRecord.submittedBy || 'Institution Nodal Officer',
          timestamp: new Date().toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          remarks: 'FDR receipt registered into digital ledger.',
        },
      ],
    };

    const updated = [recordWithMeta, ...records];
    storageService.saveRecords(updated);
    return updated;
  },

  /**
   * Update an existing FDR record
   */
  updateRecord: (updatedData) => {
    const records = storageService.getRecords();
    const updated = records.map((rec) => {
      if (rec.id === updatedData.id) {
        return {
          ...rec,
          ...updatedData,
          amount: Number(updatedData.amount),
          interestRate: Number(updatedData.interestRate),
          history: [
            ...(rec.history || []),
            {
              action: 'Record Updated',
              by: 'Finance Administrator',
              timestamp: new Date().toLocaleString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }),
              remarks: 'Details updated via Administrative Portal.',
            },
          ],
        };
      }
      return rec;
    });
    storageService.saveRecords(updated);
    return updated;
  },

  /**
   * Delete an FDR record
   */
  deleteRecord: (id) => {
    const records = storageService.getRecords();
    const updated = records.filter((rec) => rec.id !== id);
    storageService.saveRecords(updated);
    return updated;
  },

  /**
   * Update verification status (Verify, Reject, Return for Correction)
   */
  updateVerification: (id, status, reviewerName, notes) => {
    const records = storageService.getRecords();
    const nowStr = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const updated = records.map((rec) => {
      if (rec.id === id) {
        return {
          ...rec,
          status,
          verifiedBy: status === 'Verified' ? reviewerName : (rec.verifiedBy || reviewerName),
          verifiedAt: status === 'Verified' ? new Date().toISOString().split('T')[0] : rec.verifiedAt,
          verificationNotes: notes || '',
          history: [
            ...(rec.history || []),
            {
              action: `Status changed to: ${status}`,
              by: reviewerName,
              timestamp: nowStr,
              remarks: notes || `Marked as ${status} by verification officer.`,
            },
          ],
        };
      }
      return rec;
    });
    storageService.saveRecords(updated);
    return updated;
  },

  /**
   * Mark record as renewed (adds new tenure & resets to verified)
   */
  renewRecord: (id, newMaturityDate, newFdrNumber, additionalYears, remarks) => {
    const records = storageService.getRecords();
    const nowStr = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const updated = records.map((rec) => {
      if (rec.id === id) {
        return {
          ...rec,
          maturityDate: newMaturityDate,
          fdrNumber: newFdrNumber || rec.fdrNumber,
          tenureYears: (rec.tenureYears || 0) + Number(additionalYears),
          status: 'Verified',
          history: [
            ...(rec.history || []),
            {
              action: `Deposit Renewed for +${additionalYears} Years`,
              by: 'AICTE Finance Officer',
              timestamp: nowStr,
              remarks: remarks || `FDR term extended to ${newMaturityDate}. New FDR Ref: ${newFdrNumber || rec.fdrNumber}`,
            },
          ],
        };
      }
      return rec;
    });
    storageService.saveRecords(updated);
    return updated;
  },

  /**
   * Reset to initial sample data
   */
  resetToDefault: () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_FDR_RECORDS));
    return INITIAL_FDR_RECORDS;
  },

  /**
   * Simulated system reference date (useful for demonstrating maturity calculations)
   */
  getSimulatedDate: () => {
    const stored = localStorage.getItem(SIMULATED_DATE_KEY);
    return stored || '2026-10-27'; // Default to current reference date
  },

  setSimulatedDate: (dateStr) => {
    localStorage.setItem(SIMULATED_DATE_KEY, dateStr);
    return dateStr;
  },
};
