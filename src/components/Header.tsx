import React from 'react';
import { 
  Network, 
  LayoutDashboard, 
  GitFork, 
  Wallet, 
  LifeBuoy, 
  FileCode2, 
  ShieldCheck, 
  User, 
  Download,
  Globe
} from 'lucide-react';
import { Member } from '../types/mlm';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  activeMember: Member;
  allMembers: Member[];
  onSelectMember: (memberId: string) => void;
  isAdmin: boolean;
  setIsAdmin: (admin: boolean) => void;
  onExportCsv: () => void;
  twoFactorActive: boolean;
  onToggle2Fa: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  activeMember,
  allMembers,
  onSelectMember,
  isAdmin,
  setIsAdmin,
  onExportCsv,
  twoFactorActive,
  onToggle2Fa
}) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="w-full px-4 lg:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Zone 1: Single text element Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-black text-lg">
            JW
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-extrabold tracking-wider text-amber-400 font-sans leading-tight">
              JIVANTA WELLNESS
            </span>
            <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">
              MLM Core Management OS
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-medium">
          <button
            onClick={() => setCurrentTab('landing')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              currentTab === 'landing'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>CMS Onboarding</span>
          </button>

          <button
            onClick={() => setCurrentTab('admin')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              currentTab === 'admin'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Admin Console</span>
          </button>

          <button
            onClick={() => setCurrentTab('tree')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              currentTab === 'tree'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <GitFork className="w-3.5 h-3.5" />
            <span>Binary Tree</span>
          </button>

          <button
            onClick={() => setCurrentTab('portal')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              currentTab === 'portal'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Member Portal</span>
          </button>

          <button
            onClick={() => setCurrentTab('wallet')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              currentTab === 'wallet'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>E-Wallet & Payouts</span>
          </button>

          <button
            onClick={() => setCurrentTab('tickets')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              currentTab === 'tickets'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>Tickets</span>
          </button>

          <button
            onClick={() => setCurrentTab('php_code')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              currentTab === 'php_code'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Core PHP & SQL Engine</span>
          </button>
        </nav>

        {/* Zone 3: Actions & Profile Context */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* Quick Export CSV */}
          <button
            onClick={onExportCsv}
            title="Export System Data to CSV"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700/80 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden xl:inline">Export CSV</span>
          </button>

          {/* 2FA Toggle simulation */}
          <button
            onClick={onToggle2Fa}
            title={twoFactorActive ? "2FA Multi-Factor Auth Active" : "Enable 2FA Security"}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors border ${
              twoFactorActive 
                ? 'bg-emerald-950/60 border-emerald-700/50 text-emerald-300' 
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">{twoFactorActive ? '2FA: Verified' : '2FA: Off'}</span>
          </button>

          {/* Switch User dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/80 rounded-lg px-2 py-1">
            <User className="w-3.5 h-3.5 text-amber-400" />
            <select
              value={activeMember.id}
              onChange={(e) => onSelectMember(e.target.value)}
              className="bg-transparent text-xs text-slate-200 font-medium focus:outline-none cursor-pointer max-w-[130px] truncate"
            >
              {allMembers.map((m) => (
                <option key={m.id} value={m.id} className="bg-slate-900 text-slate-200">
                  {m.id}: {m.fullName} ({m.rank})
                </option>
              ))}
            </select>
          </div>

          {/* Role Toggle */}
          <button
            onClick={() => setIsAdmin(!isAdmin)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all shadow-sm ${
              isAdmin
                ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-red-500/20'
                : 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-blue-500/20'
            }`}
          >
            {isAdmin ? 'Admin Mode' : 'Member View'}
          </button>
        </div>

      </div>

      {/* Mobile secondary tab strip */}
      <div className="lg:hidden flex items-center gap-2 overflow-x-auto px-4 py-2 border-t border-slate-800/80 bg-slate-950/90 text-xs">
        {[
          { key: 'landing', label: 'CMS Landing' },
          { key: 'admin', label: 'Admin' },
          { key: 'tree', label: 'Binary Tree' },
          { key: 'portal', label: 'Member' },
          { key: 'wallet', label: 'E-Wallet' },
          { key: 'tickets', label: 'Tickets' },
          { key: 'php_code', label: 'PHP & SQL' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setCurrentTab(tab.key)}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              currentTab === tab.key
                ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </header>
  );
};
