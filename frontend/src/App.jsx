import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Wallet, LayoutDashboard, FilePlus, Briefcase, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { isAllowed, setAllowed, getUserInfo } from '@stellar/freighter-api';

import Dashboard from './pages/Dashboard';
import CreateJob from './pages/CreateJob';
import ActiveContracts from './pages/ActiveContracts';

function App() {
  const [walletAddress, setWalletAddress] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (await isAllowed()) {
      const userInfo = await getUserInfo();
      if (userInfo.publicKey) setWalletAddress(userInfo.publicKey);
    }
  };

  const connectWallet = async () => {
    await setAllowed();
    await checkWalletConnection();
  };

  const truncateAddress = (addr) => `${addr.slice(0, 5)}...${addr.slice(-4)}`;

  return (
    <Router>
      <div className="min-h-screen bg-background text-text flex flex-col">
        <nav className="border-b border-border bg-surface/50 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Briefcase size={18} className="text-white" />
                </div>
                <span className="font-bold text-xl tracking-tight">TrustCrow</span>
              </div>
              
              <div className="hidden md:flex space-x-8">
                <Link to="/" className="text-textMuted hover:text-text flex items-center gap-2 transition-colors"><LayoutDashboard size={18} /> Dashboard</Link>
                <Link to="/create-job" className="text-textMuted hover:text-text flex items-center gap-2 transition-colors"><FilePlus size={18} /> Create Job</Link>
                <Link to="/contracts" className="text-textMuted hover:text-text flex items-center gap-2 transition-colors"><Briefcase size={18} /> Active Contracts</Link>
              </div>

              <div className="hidden md:flex items-center">
                {walletAddress ? (
                  <div className="px-4 py-2 bg-surface border border-border rounded-xl flex items-center gap-2 font-mono text-sm shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
                    {truncateAddress(walletAddress)}
                  </div>
                ) : (
                  <button onClick={connectWallet} className="btn-primary flex items-center gap-2 py-2 text-sm">
                    <Wallet size={16} /> Connect Freighter
                  </button>
                )}
              </div>
              
              <div className="md:hidden flex items-center">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-textMuted hover:text-text">
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>
          
          {isMenuOpen && (
            <div className="md:hidden bg-surface border-b border-border">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-textMuted hover:text-text hover:bg-background">Dashboard</Link>
                <Link to="/create-job" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-textMuted hover:text-text hover:bg-background">Create Job</Link>
                <Link to="/contracts" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-textMuted hover:text-text hover:bg-background">Active Contracts</Link>
                <div className="px-3 py-2">
                  {walletAddress ? (
                    <div className="text-sm font-mono text-primary">{truncateAddress(walletAddress)}</div>
                  ) : (
                    <button onClick={connectWallet} className="w-full btn-primary py-2 text-sm flex items-center justify-center gap-2">
                      <Wallet size={16} /> Connect Wallet
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </nav>

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Dashboard walletAddress={walletAddress} />} />
            <Route path="/create-job" element={<CreateJob walletAddress={walletAddress} />} />
            <Route path="/contracts" element={<ActiveContracts walletAddress={walletAddress} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
