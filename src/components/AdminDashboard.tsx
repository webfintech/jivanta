import React, { useState } from 'react';
import { 
  Settings, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Search, 
  Download, 
  UserCheck, 
  DollarSign, 
  Users, 
  Activity, 
  Layers, 
  Bell, 
  Cpu, 
  Save, 
  RefreshCw,
  Eye,
  XCircle,
  FileSpreadsheet
} from 'lucide-react';
import { 
  Member, 
  GlobalProjectConfig, 
  SystemAlert, 
  CronTaskStatus, 
  BinaryClosingResult, 
  WalletTransaction 
} from '../types/mlm';
import { exportToCsv } from '../utils/binaryEngine';

interface AdminDashboardProps {
  config: GlobalProjectConfig;
  onUpdateConfig: (newConfig: GlobalProjectConfig) => void;
  members: Member[];
  onUpdateMembers: (newMembers: Member[]) => void;
  alerts: SystemAlert[];
  onDismissAlert: (id: string) => void;
  cronStatuses: CronTaskStatus[];
  onRunClosing: () => void;
  lastClosingResult: BinaryClosingResult | null;
  transactions: WalletTransaction[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  config,
  onUpdateConfig,
  members,
  onUpdateMembers,
  alerts,
  onDismissAlert,
  cronStatuses,
  onRunClosing,
  lastClosingResult,
  transactions
}) => {
  // Left panel form settings
  const [formConfig, setFormConfig] = useState<GlobalProjectConfig>({ ...config });
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterQualified, setFilterQualified] = useState<'all' | 'qualified' | 'unqualified'>('all');
  const [filterKyc, setFilterKyc] = useState<'all' | 'verified' | 'pending'>('all');

  // Member inspect modal
  const [inspectedMember, setInspectedMember] = useState<Member | null>(null);

  // Closing in progress indicator
  const [isClosingRunning, setIsClosingRunning] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig(formConfig);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  const handleRunClosingClick = () => {
    setIsClosingRunning(true);
    setTimeout(() => {
      onRunClosing();
      setIsClosingRunning(false);
    }, 800);
  };

  const handleKycAction = (memberId: string, action: 'verify' | 'reject') => {
    const updated = members.map((m) => {
      if (m.id === memberId) {
        return {
          ...m,
          kycStatus: (action === 'verify' ? 'verified' : 'rejected') as any
        };
      }
      return m;
    });
    onUpdateMembers(updated);
    if (inspectedMember && inspectedMember.id === memberId) {
      setInspectedMember({
        ...inspectedMember,
        kycStatus: action === 'verify' ? 'verified' : 'rejected'
      });
    }
  };

  // Filtered members
  const filteredMembers = members.filter((m) => {
    const matchesSearch = 
      m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesQualified = 
      filterQualified === 'all' 
        ? true 
        : filterQualified === 'qualified' 
          ? m.directLeftCount >= 1 && m.directRightCount >= 1 
          : !(m.directLeftCount >= 1 && m.directRightCount >= 1);

    const matchesKyc =
      filterKyc === 'all'
        ? true
        : filterKyc === 'verified'
          ? m.kycStatus === 'verified'
          : m.kycStatus === 'pending';

    return matchesSearch && matchesQualified && matchesKyc;
  });

  // Calculate aggregates
  const totalVolumePv = members.reduce((acc, m) => acc + m.leftTotalPv + m.rightTotalPv, 0);
  const totalCarryPv = members.reduce((acc, m) => acc + m.leftCarryForwardPv + m.rightCarryForwardPv, 0);
  const totalWalletBalances = members.reduce((acc, m) => acc + m.walletBalance, 0);
  const totalQualifiedCount = members.filter((m) => m.directLeftCount >= 1 && m.directRightCount >= 1).length;

  const handleExportMembersCsv = () => {
    const rows = filteredMembers.map((m) => ({
      ID: m.id,
      Username: m.username,
      FullName: m.fullName,
      Email: m.email,
      Rank: m.rank,
      LeftPv: m.leftTotalPv,
      RightPv: m.rightTotalPv,
      LeftCarryForward: m.leftCarryForwardPv,
      RightCarryForward: m.rightCarryForwardPv,
      DirectLeft: m.directLeftCount,
      DirectRight: m.directRightCount,
      Qualified: m.directLeftCount >= 1 && m.directRightCount >= 1 ? 'YES' : 'NO',
      KYC_Status: m.kycStatus,
      WalletBalance: m.walletBalance
    }));
    exportToCsv('Jivanta_Wellness_Members_Report', rows);
  };

  return (
    <div className="w-full bg-slate-950 text-slate-100 min-h-screen">
      
      {/* 3-Column Responsive Grid: Left (Settings), Center (Analytics & Table), Right (Alerts & Crons) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-b border-slate-800">
        
        {/* ========================================================
            LEFT PANEL: Project Settings & Global Configurations
        ======================================================== */}
        <aside className="lg:col-span-3 border-r border-slate-800 bg-slate-900/70 p-5 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Project Settings</h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/40">
              LIVE
            </span>
          </div>

          {settingsSaved && (
            <div className="p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-600/50 text-emerald-300 text-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Configurations saved successfully!</span>
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Company Display Name</label>
              <input
                type="text"
                value={formConfig.companyName}
                onChange={(e) => setFormConfig({ ...formConfig, companyName: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">TDS Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formConfig.tdsPercentage}
                  onChange={(e) => setFormConfig({ ...formConfig, tdsPercentage: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-amber-300 focus:outline-none focus:border-amber-500"
                />
                <span className="text-[10px] text-slate-500">Official Plan: 2%</span>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Admin Charge (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formConfig.adminChargePercentage}
                  onChange={(e) => setFormConfig({ ...formConfig, adminChargePercentage: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-amber-300 focus:outline-none focus:border-amber-500"
                />
                <span className="text-[10px] text-slate-500">Official Plan: 5%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Direct Sponsor (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formConfig.directSponsorCommissionPercentage}
                  onChange={(e) => setFormConfig({ ...formConfig, directSponsorCommissionPercentage: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-slate-200 focus:outline-none"
                />
                <span className="text-[10px] text-slate-500">Sponsor Sales: 9%</span>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Sponsor Bonus (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formConfig.sponsorBinaryBonusPercentage}
                  onChange={(e) => setFormConfig({ ...formConfig, sponsorBinaryBonusPercentage: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-slate-200 focus:outline-none"
                />
                <span className="text-[10px] text-slate-500">On Binary: 10%</span>
              </div>
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Weekly Closing Schedule</label>
              <select
                value={formConfig.weeklyClosingDay}
                onChange={(e) => setFormConfig({ ...formConfig, weeklyClosingDay: e.target.value as any })}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none"
              >
                <option value="Sunday">Every Sunday 23:59 IST</option>
                <option value="Monday">Every Monday 00:00 IST</option>
                <option value="Friday">Every Friday 23:59 IST</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Minimum Withdrawal (₹)</label>
              <input
                type="number"
                value={formConfig.minWithdrawalAmount}
                onChange={(e) => setFormConfig({ ...formConfig, minWithdrawalAmount: Number(e.target.value) })}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-slate-200 focus:outline-none"
              />
            </div>

            <div className="pt-2 border-t border-slate-800 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formConfig.autoApproveKyc}
                  onChange={(e) => setFormConfig({ ...formConfig, autoApproveKyc: e.target.checked })}
                  className="rounded accent-amber-500"
                />
                <span className="text-slate-300">Auto-Approve Aadhaar/PAN KYC</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formConfig.maintenanceMode}
                  onChange={(e) => setFormConfig({ ...formConfig, maintenanceMode: e.target.checked })}
                  className="rounded accent-rose-500"
                />
                <span className="text-slate-300">Maintenance Mode</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Plan Configurations</span>
            </button>
          </form>

          {/* Quick Stats in Left Sidebar */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
            <div className="text-slate-400 font-semibold flex items-center justify-between">
              <span>Rule Qualification</span>
              <span className="text-amber-400">1L & 1R Direct</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Qualified Members:</span>
              <span className="font-mono text-emerald-400 font-bold">{totalQualifiedCount} / {members.length}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Carry Forward Guarantee:</span>
              <span className="font-mono text-sky-400 font-bold">Lifetime Active</span>
            </div>
          </div>
        </aside>

        {/* ========================================================
            CENTER PANEL: Member Performance Analytics & Actions
        ======================================================== */}
        <main className="lg:col-span-6 p-5 space-y-6">
          
          {/* Top Headline & Commission Closing Trigger */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>Performance Analytics Console</span>
              </h2>
              <p className="text-xs text-slate-400">
                Multi-level binary volume tracking, e-wallet liabilities, and automated weekly closing
              </p>
            </div>

            <button
              onClick={handleRunClosingClick}
              disabled={isClosingRunning}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg transition-all ${
                isClosingRunning
                  ? 'bg-amber-600 text-slate-950 opacity-80 cursor-wait'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 shadow-emerald-500/20'
              }`}
            >
              <Play className={`w-3.5 h-3.5 fill-current ${isClosingRunning ? 'animate-spin' : ''}`} />
              <span>{isClosingRunning ? 'Calculating Closings...' : 'Run Weekly Binary Closing'}</span>
            </button>
          </div>

          {/* KPI Cards Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Distributors</span>
                <Users className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-white mt-1">{members.length}</div>
              <div className="text-[10px] text-emerald-400 mt-0.5">{totalQualifiedCount} Binary Qualified</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Accumulated PV</span>
                <Activity className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-amber-400 mt-1">{totalVolumePv.toLocaleString()}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Left + Right subtree</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Carry Pool</span>
                <Layers className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-purple-300 mt-1">{totalCarryPv.toLocaleString()}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Lifetime Unmatched PV</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Wallet Liability</span>
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">₹{(totalWalletBalances / 1000).toFixed(1)}k</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Ready for disbursement</div>
            </div>
          </div>

          {/* Recent Closing Execution Banner if available */}
          {lastClosingResult && (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-600/40 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-bold text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Closing Cycle Successfully Executed ({lastClosingResult.payoutBatchId})</span>
                </div>
                <span className="font-mono text-slate-400 text-[11px]">{lastClosingResult.closingDate}</span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block">Volume Matched:</span>
                  <span className="font-mono text-white font-bold">{lastClosingResult.totalBinaryVolumeMatched.toLocaleString()} PV</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Gross Commission:</span>
                  <span className="font-mono text-white font-bold">₹{lastClosingResult.totalGrossCommission.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">TDS (2%) + Admin (5%):</span>
                  <span className="font-mono text-rose-400 font-bold">
                    - ₹{(lastClosingResult.totalTdsDeducted + lastClosingResult.totalAdminChargeDeducted).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Net Credited:</span>
                  <span className="font-mono text-emerald-400 font-bold">₹{lastClosingResult.totalNetPayout.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Members Analytics & Search Filter Table */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by ID, Name or Username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={filterQualified}
                  onChange={(e) => setFilterQualified(e.target.value as any)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Qualifications</option>
                  <option value="qualified">Qualified (1L & 1R)</option>
                  <option value="unqualified">Unqualified</option>
                </select>

                <select
                  value={filterKyc}
                  onChange={(e) => setFilterKyc(e.target.value as any)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none cursor-pointer"
                >
                  <option value="all">All KYC Status</option>
                  <option value="verified">KYC Verified</option>
                  <option value="pending">KYC Pending</option>
                </select>

                <button
                  onClick={handleExportMembersCsv}
                  title="Export Current Filtered List"
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs flex items-center gap-1 transition-colors"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">CSV</span>
                </button>
              </div>
            </div>

            {/* Members Data Grid */}
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/80">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Member</th>
                    <th className="py-2.5 px-3">Rank & Package</th>
                    <th className="py-2.5 px-3">Left / Right Volume</th>
                    <th className="py-2.5 px-3">Carry Forward</th>
                    <th className="py-2.5 px-3">Qualified</th>
                    <th className="py-2.5 px-3">KYC</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-medium">
                  {filteredMembers.map((m) => {
                    const isQual = m.directLeftCount >= 1 && m.directRightCount >= 1;
                    return (
                      <tr key={m.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-white">{m.fullName}</div>
                          <div className="text-[11px] font-mono text-slate-400">{m.id} · @{m.username}</div>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="text-amber-300 font-semibold">{m.rank}</div>
                          <div className="text-[10px] text-slate-400">Pack #{m.packageId}</div>
                        </td>
                        <td className="py-2.5 px-3 font-mono">
                          <span className="text-amber-400">{m.leftTotalPv.toLocaleString()} L</span>
                          <span className="text-slate-600 mx-1">/</span>
                          <span className="text-emerald-400">{m.rightTotalPv.toLocaleString()} R</span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[11px]">
                          <span className="text-slate-300">{m.leftCarryForwardPv} L</span>
                          <span className="text-slate-600 mx-1">/</span>
                          <span className="text-slate-300">{m.rightCarryForwardPv} R</span>
                        </td>
                        <td className="py-2.5 px-3">
                          {isQual ? (
                            <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>1L & 1R Active</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-amber-400 text-[11px]">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              <span>L:{m.directLeftCount} R:{m.directRightCount}</span>
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                            m.kycStatus === 'verified'
                              ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40'
                              : m.kycStatus === 'pending'
                                ? 'bg-amber-950/60 text-amber-400 border-amber-800/40'
                                : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}>
                            {m.kycStatus}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => setInspectedMember(m)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="Inspect Details & KYC"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </main>

        {/* ========================================================
            RIGHT PANEL: Real-Time System Alerts & Task Monitoring
        ======================================================== */}
        <aside className="lg:col-span-3 border-l border-slate-800 bg-slate-900/70 p-5 space-y-6">
          
          {/* Section 1: System Alerts Feed */}
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">System Alerts</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                {alerts.length} Total
              </span>
            </div>

            <div className="mt-4 space-y-3 max-h-[280px] overflow-y-auto pr-1">
              {alerts.map((al) => (
                <div
                  key={al.id}
                  className={`p-3 rounded-xl border transition-all text-xs relative ${
                    al.type === 'success'
                      ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-200'
                      : al.type === 'warning'
                        ? 'bg-amber-950/30 border-amber-800/40 text-amber-200'
                        : al.type === 'alert'
                          ? 'bg-rose-950/30 border-rose-800/40 text-rose-200'
                          : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <button
                    onClick={() => onDismissAlert(al.id)}
                    className="absolute top-2 right-2 text-slate-400 hover:text-white"
                    title="Dismiss alert"
                  >
                    <XCircle className="w-3 h-3" />
                  </button>
                  <div className="font-bold text-white pr-4">{al.title}</div>
                  <div className="text-[11px] text-slate-300 mt-1 leading-snug">{al.message}</div>
                  <div className="text-[10px] font-mono text-slate-400 mt-2">{al.timestamp}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Individual Task Monitoring & Cron Daemon Status */}
          <div className="pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">Task Monitor Status</h3>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <div className="mt-4 space-y-3">
              {cronStatuses.map((task) => (
                <div key={task.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{task.name}</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/40">
                      {task.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 font-mono flex justify-between">
                    <span>Frequency:</span>
                    <span className="text-slate-300">{task.frequency}</span>
                  </div>

                  <div className="text-[11px] text-slate-400 font-mono flex justify-between">
                    <span>Last Execution:</span>
                    <span className="text-slate-300">{task.lastRun.split(' ')[1] || task.lastRun}</span>
                  </div>

                  <div className="text-[10px] text-slate-500 font-mono flex justify-between pt-1 border-t border-slate-900">
                    <span>Time: {task.executionTimeMs}ms</span>
                    <span>Processed: {task.recordsProcessed} rows</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </aside>

      </div>

      {/* Member Inspection & KYC Modal */}
      {inspectedMember && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white">{inspectedMember.fullName}</h3>
                <p className="text-xs font-mono text-amber-400">{inspectedMember.id} · @{inspectedMember.username}</p>
              </div>
              <button
                onClick={() => setInspectedMember(null)}
                className="text-slate-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Rank Tier</span>
                <span className="font-bold text-amber-400 text-sm">{inspectedMember.rank}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">E-Wallet Balance</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">₹{inspectedMember.walletBalance.toLocaleString()}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Left Leg Total</span>
                <span className="font-mono text-slate-200">{inspectedMember.leftTotalPv.toLocaleString()} PV (Carry: {inspectedMember.leftCarryForwardPv})</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Right Leg Total</span>
                <span className="font-mono text-slate-200">{inspectedMember.rightTotalPv.toLocaleString()} PV (Carry: {inspectedMember.rightCarryForwardPv})</span>
              </div>
            </div>

            {/* KYC Details */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="font-bold text-white flex items-center justify-between">
                <span>KYC Verification Documents</span>
                <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded ${
                  inspectedMember.kycStatus === 'verified' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                }`}>
                  {inspectedMember.kycStatus}
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Aadhaar Number:</span>
                <span className="font-mono font-bold text-white">{inspectedMember.kycAadhaar || 'Not Uploaded'}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>PAN Number:</span>
                <span className="font-mono font-bold text-white">{inspectedMember.kycPan || 'Not Uploaded'}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Bank Account:</span>
                <span className="font-mono text-slate-400">{inspectedMember.bankAccount.bankName} ({inspectedMember.bankAccount.accountNumber})</span>
              </div>
            </div>

            {/* Verification Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => handleKycAction(inspectedMember.id, 'verify')}
                className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approve KYC Documents</span>
              </button>
              <button
                onClick={() => handleKycAction(inspectedMember.id, 'reject')}
                className="py-2 px-4 rounded-xl bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 font-bold text-xs transition-colors"
              >
                Reject KYC
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
