// File: DisputeTimeline.js
// Path: frontend/src/components/DisputeTimeline.js

import React from 'react';

const DisputeTimeline = ({ dispute }) => {
  const steps = [
    {
      label: 'Filed',
      icon: '📝',
      active: true
    },
    {
      label: 'Judges Assigned',
      icon: '👥',
      active: dispute.judges?.length === 3
    },
    {
      label: 'Voting in Progress',
      icon: '🗳️',
      active: dispute.votes?.length > 0 && dispute.votes.length < 3
    },
    {
      label: 'Resolved',
      icon: '✅',
      active: dispute.status === 'resolved'
    },
    {
      label: 'Escalated',
      icon: '⚖️',
      active: dispute.status === 'escalated'
    }
  ];

  return (
    <div style={{ margin: '1rem 0' }}>
      <h4>📊 Dispute Timeline</h4>
      <ul style={{ listStyle: 'none', paddingLeft: 0, display: 'flex', gap: '20px' }}>
        {steps.map((step, idx) => (
          <li key={idx} style={{
            color: step.active ? '#0a0' : '#999',
            fontWeight: step.active ? 'bold' : 'normal'
          }}>
            {step.icon} {step.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DisputeTimeline;
