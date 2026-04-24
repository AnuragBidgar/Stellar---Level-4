import { Trophy, Activity, Wallet, Star } from 'lucide-react';

export default function Dashboard({ walletAddress }) {
  // Mock data for UI demonstration
  const stats = [
    { title: 'TRUST Balance', value: '1,245.00', icon: <Wallet className="text-primary" />, change: '+12.5%' },
    { title: 'Reputation Score', value: '98', icon: <Star className="text-secondary" />, change: '+2' },
    { title: 'Completed Jobs', value: '14', icon: <Trophy className="text-accent" />, change: '+1' },
    { title: 'Active Escrows', value: '2', icon: <Activity className="text-orange-400" />, change: '0' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-textMuted mt-1">Welcome back! Here's your freelance overview.</p>
        </div>
      </div>

      {!walletAddress && (
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-lg text-primary">Connect your wallet</h3>
            <p className="text-textMuted text-sm">Please connect your Freighter wallet to view real-time contract data.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="glass-card p-6 flex flex-col gap-4 hover:border-primary/30 transition-colors cursor-default group">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-surface border border-border rounded-xl group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <span className="text-xs font-medium text-secondary bg-secondary/10 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-textMuted text-sm">{stat.title}</p>
              <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Activity size={18} className="text-primary"/> Recent Events
          </h3>
          <div className="space-y-4">
            {[
              { event: 'PaymentReleased', job: '#102', amount: '500 TRUST', time: '2 mins ago', status: 'text-secondary' },
              { event: 'WorkSubmitted', job: '#104', amount: '-', time: '1 hour ago', status: 'text-accent' },
              { event: 'PaymentLocked', job: '#105', amount: '250 TRUST', time: '3 hours ago', status: 'text-primary' },
              { event: 'ReputationUpdated', job: '-', amount: '+10 Points', time: '1 day ago', status: 'text-secondary' }
            ].map((e, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-border/50">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full bg-current ${e.status}`}></div>
                  <div>
                    <p className="font-medium text-sm">{e.event}</p>
                    <p className="text-xs text-textMuted">Job {e.job}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm">{e.amount}</p>
                  <p className="text-xs text-textMuted">{e.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Star size={18} className="text-secondary"/> Trust Network
          </h3>
          <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-accent to-primary p-1">
              <div className="w-full h-full bg-surface rounded-full flex items-center justify-center text-3xl font-bold">
                98
              </div>
            </div>
            <div>
              <p className="font-medium">Top 5% Freelancer</p>
              <p className="text-sm text-textMuted mt-1">Stake 100 TRUST to boost visibility</p>
            </div>
            <button className="btn-secondary w-full mt-4 text-sm py-2">Stake TRUST</button>
          </div>
        </div>
      </div>
    </div>
  );
}
