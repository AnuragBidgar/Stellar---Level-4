import { useState } from 'react';
import { CheckCircle, AlertCircle, Clock, ExternalLink } from 'lucide-react';

export default function ActiveContracts({ walletAddress }) {
  const [contracts, setContracts] = useState([
    { id: '102', client: 'GABC...1234', freelancer: 'GXYZ...9876', arbitrator: 'G789...5555', amount: 500, status: 'Locked', role: 'Freelancer' },
    { id: '104', client: 'GDEF...5678', freelancer: 'GXYZ...9876', arbitrator: 'G789...5555', amount: 1500, status: 'Completed', role: 'Freelancer' },
    { id: '105', client: 'GXYZ...9876', freelancer: 'GHJK...4321', arbitrator: 'G789...5555', amount: 250, status: 'Created', role: 'Client' },
    { id: '108', client: 'GABC...1111', freelancer: 'GDEF...2222', arbitrator: 'GXYZ...9876', amount: 1200, status: 'Disputed', role: 'Arbitrator' },
  ]);

  const handleAction = (id, action, params = {}) => {
    // Simulate smart contract interactions
    setContracts(contracts.map(c => {
      if (c.id === id) {
        if (action === 'submit') return { ...c, status: 'WorkSubmitted' };
        if (action === 'lock') return { ...c, status: 'Locked' };
        if (action === 'release') return { ...c, status: 'Completed' };
        if (action === 'dispute') return { ...c, status: 'Disputed' };
        if (action === 'resolve') return { ...c, status: 'Completed', resolvedTo: params.to };
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
      case 'Disputed': return <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">Disputed</span>;
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
                <span className={`text-xs px-2 py-1 rounded font-medium ${
                  contract.role === 'Arbitrator' ? 'bg-accent/20 text-accent' : 'bg-surface text-textMuted'
                }`}>Role: {contract.role}</span>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <div className="flex items-center gap-1 text-textMuted">
                  <span className="text-text">Client:</span> <span className="font-mono text-xs">{contract.client}</span>
                </div>
                <div className="flex items-center gap-1 text-textMuted">
                  <span className="text-text">Freelancer:</span> <span className="font-mono text-xs">{contract.freelancer}</span>
                </div>
                <div className="flex items-center gap-1 text-textMuted">
                  <span className="text-text">Arbitrator:</span> <span className="font-mono text-xs">{contract.arbitrator}</span>
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
                <div className="flex gap-2 w-full md:w-auto">
                  <button onClick={() => handleAction(contract.id, 'release')} className="btn-primary py-2 px-4 text-sm bg-secondary hover:bg-secondary/80 text-surface">Release</button>
                  <button onClick={() => handleAction(contract.id, 'dispute')} className="btn-secondary py-2 px-4 text-sm border-red-500/50 text-red-400">Dispute</button>
                </div>
              )}
              {contract.role === 'Arbitrator' && contract.status === 'Disputed' && (
                <div className="flex gap-2 w-full md:w-auto">
                  <button onClick={() => handleAction(contract.id, 'resolve', {to: 'Freelancer'})} className="btn-primary py-2 px-4 text-sm bg-accent">Pay Freelancer</button>
                  <button onClick={() => handleAction(contract.id, 'resolve', {to: 'Client'})} className="btn-secondary py-2 px-4 text-sm">Refund Client</button>
                </div>
              )}
              {contract.status === 'Completed' && (
                <button disabled className="btn-secondary py-2 px-4 text-sm w-full md:w-auto opacity-50 cursor-not-allowed">
                  <CheckCircle size={16} className="inline mr-2 text-secondary"/> {contract.resolvedTo ? `Resolved to ${contract.resolvedTo}` : 'Finished'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>

  );
}
