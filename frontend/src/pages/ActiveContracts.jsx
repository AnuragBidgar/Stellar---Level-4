import { useState } from 'react';
import { CheckCircle, AlertCircle, Clock, ExternalLink } from 'lucide-react';

export default function ActiveContracts({ walletAddress }) {
  const [contracts, setContracts] = useState([
    { id: '102', client: 'GABC...1234', freelancer: 'GXYZ...9876', amount: 500, status: 'Locked', role: 'Freelancer' },
    { id: '104', client: 'GDEF...5678', freelancer: 'GXYZ...9876', amount: 1500, status: 'Completed', role: 'Freelancer' },
    { id: '105', client: 'GXYZ...9876', freelancer: 'GHJK...4321', amount: 250, status: 'Created', role: 'Client' },
  ]);

  const handleAction = (id, action) => {
    // Simulate smart contract interactions
    setContracts(contracts.map(c => {
      if (c.id === id) {
        if (action === 'submit') return { ...c, status: 'WorkSubmitted' };
        if (action === 'lock') return { ...c, status: 'Locked' };
        if (action === 'release') return { ...c, status: 'Completed' };
      }
      return c;
    }));
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Created': return <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20">Awaiting Lock</span>;
      case 'Locked': return <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">In Progress</span>;
      case 'WorkSubmitted': return <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20">In Review</span>;
      case 'Completed': return <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary border border-secondary/20">Completed</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Active Contracts</h1>
          <p className="text-textMuted mt-1">Manage your escrow agreements and pending actions.</p>
        </div>
      </div>

      <div className="grid gap-4">
        {contracts.map(contract => (
          <div key={contract.id} className="glass-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <span className="font-bold text-lg">Job #{contract.id}</span>
                {getStatusBadge(contract.status)}
                <span className="text-xs text-textMuted bg-surface px-2 py-1 rounded">Role: {contract.role}</span>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <div className="flex items-center gap-1 text-textMuted">
                  <span className="text-text">Client:</span> <span className="font-mono">{contract.client}</span>
                </div>
                <div className="flex items-center gap-1 text-textMuted">
                  <span className="text-text">Freelancer:</span> <span className="font-mono">{contract.freelancer}</span>
                </div>
                <div className="flex items-center gap-1 text-textMuted">
                  <span className="text-text">Amount:</span> <span className="font-semibold text-primary">{contract.amount} TRUST</span>
                </div>
              </div>
            </div>

            <div className="w-full md:w-auto flex items-center gap-3">
              {contract.role === 'Client' && contract.status === 'Created' && (
                <button onClick={() => handleAction(contract.id, 'lock')} className="btn-primary py-2 px-4 text-sm w-full md:w-auto">Lock Payment</button>
              )}
              {contract.role === 'Freelancer' && contract.status === 'Locked' && (
                <button onClick={() => handleAction(contract.id, 'submit')} className="btn-primary py-2 px-4 text-sm w-full md:w-auto bg-accent hover:bg-accent/80 hover:shadow-accent/25">Submit Work</button>
              )}
              {contract.role === 'Client' && contract.status === 'WorkSubmitted' && (
                <button onClick={() => handleAction(contract.id, 'release')} className="btn-primary py-2 px-4 text-sm w-full md:w-auto bg-secondary hover:bg-secondary/80 hover:shadow-secondary/25 text-surface">Release Funds</button>
              )}
              {contract.status === 'Completed' && (
                <button disabled className="btn-secondary py-2 px-4 text-sm w-full md:w-auto opacity-50 cursor-not-allowed">
                  <CheckCircle size={16} className="inline mr-2 text-secondary"/> Finished
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
