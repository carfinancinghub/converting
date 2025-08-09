// File: ContractESignLauncher.js
// Path: frontend/src/components/ContractESignLauncher.js

import React, { useState } from 'react';
import axios from 'axios';

const ContractESignLauncher = ({ auctionId }) => {
  const [esignData, setEsignData] = useState(null);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  const launchESign = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/contracts/${auctionId}/esignature/initiate`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEsignData(res.data);
      setError('');
    } catch (err) {
      setError('❌ Failed to launch e-signature prep');
      setEsignData(null);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={launchESign}
        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        ✍ Prepare E-Signature Request
      </button>

      {error && <p className="mt-2 text-red-600 font-medium">{error}</p>}

      {esignData && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md border border-gray-300">
          <p className="mb-2">
            <strong>Contract Link:</strong>{' '}
            <a
              href={esignData.documentUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline"
            >
              View PDF
            </a>
          </p>

          <h5 className="font-semibold mb-2">Signers:</h5>
          <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
            {esignData.signers.map((s, idx) => (
              <li key={idx}>
                <strong>{s.role}:</strong> {s.email} <span className="text-gray-500">(Anchor: {s.anchorTag})</span>
              </li>
            ))}
          </ul>

          <p className="mt-3 text-xs text-gray-500 italic">
            Paste this metadata into HelloSign / DocuSign API or tool.
          </p>
        </div>
      )}
    </div>
  );
};

export default ContractESignLauncher;
