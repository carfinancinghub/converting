// File: InstitutionalWaiverModal.js
// Path: frontend/src/components/InstitutionalWaiverModal.js

import React from 'react';

const InstitutionalWaiverModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.6)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', width: '90%', maxWidth: '600px', margin: '80px auto' }}>
        <h3>⚠️ Waiver: Missing or Unverified Title</h3>
        <p style={{ fontSize: '15px' }}>
          By proceeding with this transaction, you acknowledge that the vehicle's title is currently either <strong>missing</strong> or <strong>rejected</strong>.
          As an institutional buyer, you accept full responsibility for title recovery, and waive liability against this platform.
        </p>
        <p>This action is legally binding and cannot be reversed.</p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', marginTop: '24px' }}>
          <button onClick={onCancel}>Cancel</button>
          <button onClick={onConfirm} style={{ backgroundColor: '#e53935', color: '#fff' }}>I Accept & Proceed</button>
        </div>
      </div>
    </div>
  );
};

export default InstitutionalWaiverModal;
