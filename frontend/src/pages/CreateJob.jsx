import { useState } from 'react';
import { Send, Lock, User, DollarSign } from 'lucide-react';

export default function CreateJob({ walletAddress }) {
  const [formData, setFormData] = useState({
    freelancerAddress: '',
    amount: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!walletAddress) return alert("Please connect wallet first");
    
    setIsSubmitting(true);
    // Simulate smart contract call
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setFormData({ freelancerAddress: '', amount: '', description: '' });
      setTimeout(() => setSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Create Escrow Job</h1>
        <p className="text-textMuted mt-2">Lock funds securely in a smart contract. They are only released upon successful completion.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
        {success && (
          <div className="p-4 bg-secondary/10 border border-secondary/30 rounded-xl text-secondary flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
            JobCreated event emitted successfully! Funds are pending lock.
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-textMuted mb-1">Freelancer Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-textMuted" />
              </div>
              <input 
                type="text" 
                required
                placeholder="G..." 
                className="input-field pl-10"
                value={formData.freelancerAddress}
                onChange={(e) => setFormData({...formData, freelancerAddress: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-textMuted mb-1">Amount (TRUST)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign size={18} className="text-textMuted" />
              </div>
              <input 
                type="number" 
                required
                min="1"
                placeholder="0.00" 
                className="input-field pl-10"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-textMuted mb-1">Job Description</label>
            <textarea 
              required
              rows="4"
              placeholder="Describe the deliverables..." 
              className="input-field"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting || !walletAddress}
          className="w-full btn-primary flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Lock size={18} />
              Create & Lock Funds
            </>
          )}
        </button>
        {!walletAddress && <p className="text-xs text-center text-orange-400 mt-2">Connect wallet to create a job</p>}
      </form>
    </div>
  );
}
