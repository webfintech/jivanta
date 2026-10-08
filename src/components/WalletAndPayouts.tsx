import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Download, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ShieldCheck, 
  Search, 
  Filter,
  DollarSign
} from 'lucide-react';
import { Member, WalletTransaction, GlobalProjectConfig } from '../types/mlm';
import { exportToCsv } from '../utils/binaryEngine';

interface WalletAndPayoutsProps {
  member: Member;
  transactions: WalletTransaction[];
  config: GlobalProjectConfig;
  onSendTransfer: (recipientCode: string, amount: number, otp: string) => { success: boolean; message: string };
  onRequestWithdrawal: (amount: number) => { success: boolean; message: string };
}

export const WalletAndPayouts: React.FC<WalletAndPayoutsProps> = ({
  member,
  transactions,
  config,
  onSendTransfer,
  onRequestWithdrawal
}) => {
  // P2P Transfer modal states
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [recipientCode, setRecipientCode] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferOtp, setTransferOtp] = useState('');
  const [transferFeedback, setTransferFeedback] = useState<{ success: boolean; text: string } | null>(null);

  // Withdrawal modal states
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawFeedback, setWithdrawFeedback] = useState<{ success: boolean; text: string } | null>(null);

  // Filter
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchTx, setSearchTx] = useState('');

  // Transactions specific to active member or all if admin
  const memberTxs = transactions.filter((t) => t.memberId === member.id);

  const filteredTxs = memberTxs.filter((t) => {
    const matchesType = typeFilter === 'all' || t.type === typeFilter;
    const matchesSearch = 
      t.description.toLowerCase().includes(searchTx.toLowerCase()) ||
      t.id.toLowerCase().includes(searchTx.toLowerCase()) ||
      t.referenceId.toLowerCase().includes(searchTx.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Calculate totals
  const totalEarnedGross = memberTxs
    .filter((t) => ['binary_income', 'direct_sponsor_commission', 'sponsor_bonus'].includes(t.type))
    .reduce((acc, t) => acc + t.amount, 0);

  const totalTdsDeducted = memberTxs.reduce((acc, t) => acc + t.tdsDeduction, 0);
  const totalAdminDeducted = memberTxs.reduce((acc, t) => acc + t.adminCharge, 0);

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(transferAmount);
    if (!recipientCode || isNaN(amt) || amt <= 0) return;

    const res = onSendTransfer(recipientCode, amt, transferOtp);
    setTransferFeedback({ success: res.success, text: res.message });
    if (res.success) {
      setTimeout(() => {
        setShowTransferModal(false);
        setTransferFeedback(null);
        setRecipientCode('');
        setTransferAmount('');
        setTransferOtp('');
      }, 2000);
    }
  };

  const handleWithdrawalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt <= 0) return;

    const res = onRequestWithdrawal(amt);
    setWithdrawFeedback({ success: res.success, text: res.message });
    if (res.success) {
      setTimeout(() => {
        setShowWithdrawModal(false);
        setWithdrawFeedback(null);
        setWithdrawAmount('');
      }, 2000);
    }
  };

  const handleExportCsv = () => {
    const rows = filteredTxs.map((t) => ({
      Transaction_ID: t.id,
      Reference: t.referenceId,
      Type: t.type,
      Description: t.description,
      Gross_Amount: t.amount,
      TDS_2_Percent: t.tdsDeduction,
      Admin_5_Percent: t.adminCharge,
      Net_Amount: t.netAmount,
      Date: t.date,
      Status: t.status
    }));
    exportToCsv(`Jivanta_Wallet_Ledger_${member.id}`, rows);
  };

  return (
    <div className="w-full bg-slate-950 text-slate-100 min-h-screen p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* 1. E-Wallet KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Available Balance */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/40 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            <span>Available E-Wallet</span>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black font-mono text-white">
            ₹{member.walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => setShowTransferModal(true)}
              className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1 transition-colors"
            >
              <Send className="w-3 h-3" />
              <span>Transfer</span>
            </button>
            <button
              onClick={() => setShowWithdrawModal(true)}
              className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center justify-center gap-1 transition-colors"
            >
              <ArrowUpRight className="w-3 h-3 text-amber-400" />
              <span>Withdraw</span>
            </button>
          </div>
        </div>

        {/* Total Earned Gross */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Cumulative Gross</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400">
            ₹{totalEarnedGross.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-400">
            Binary Matching + Sponsor Bonuses
          </div>
        </div>

        {/* Total TDS Deducted (2%) */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>TDS Deductions (2%)</span>
            <span className="text-[10px] font-mono text-rose-400 bg-rose-950/80 px-1.5 py-0.5 rounded">TDS 2%</span>
          </div>
          <div className="text-2xl font-bold font-mono text-rose-400">
            ₹{totalTdsDeducted.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-400">
            Deposited against PAN: {member.kycPan || 'N/A'}
          </div>
        </div>

        {/* Total Admin Charge (5%) */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Admin Charges (5%)</span>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">Fee 5%</span>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-300">
            ₹{totalAdminDeducted.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-400">
            Official system maintenance fee
          </div>
        </div>

      </div>

      {/* 2. Transaction History Ledger */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        
        {/* Table controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white">Immutable Ledger & Payout History</h3>
            <p className="text-xs text-slate-400">Real-time audit log of binary credits, deductions, and withdrawals</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTx}
                onChange={(e) => setSearchTx(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="binary_income">Binary Income</option>
              <option value="sponsor_bonus">Sponsor Bonus</option>
              <option value="direct_sponsor_commission">Direct Commission</option>
              <option value="transfer_in">Received Transfers</option>
              <option value="transfer_out">Sent Transfers</option>
              <option value="withdrawal">Withdrawals</option>
            </select>

            <button
              onClick={handleExportCsv}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Tx ID & Ref</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3">Gross</th>
                <th className="py-2.5 px-3">TDS (2%)</th>
                <th className="py-2.5 px-3">Admin (5%)</th>
                <th className="py-2.5 px-3">Net Credited</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-medium">
              {filteredTxs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No ledger transactions found matching filters.
                  </td>
                </tr>
              ) : (
                filteredTxs.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="font-mono text-white font-bold">{tx.id}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{tx.referenceId}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 max-w-xs truncate">
                      {tx.description}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-200">
                      ₹{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-rose-400">
                      {tx.tdsDeduction > 0 ? `- ₹${tx.tdsDeduction.toFixed(2)}` : '—'}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-rose-400">
                      {tx.adminCharge > 0 ? `- ₹${tx.adminCharge.toFixed(2)}` : '—'}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">
                      {tx.type === 'transfer_out' || tx.type === 'withdrawal' ? '-' : '+'} ₹{tx.netAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-400 text-[11px]">
                      {tx.date}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* P2P Fund Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-emerald-400" />
                <span>P2P Member Fund Transfer</span>
              </h3>
              <button
                onClick={() => setShowTransferModal(false)}
                className="text-slate-400 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
            </div>

            {transferFeedback && (
              <div className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                transferFeedback.success
                  ? 'bg-emerald-950 border border-emerald-700 text-emerald-300'
                  : 'bg-rose-950 border border-rose-700 text-rose-300'
              }`}>
                {transferFeedback.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{transferFeedback.text}</span>
              </div>
            )}

            <form onSubmit={handleTransferSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Recipient Member Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. JW-1002"
                  value={recipientCode}
                  onChange={(e) => setRecipientCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono uppercase focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Transfer Amount (₹)</label>
                <input
                  type="number"
                  min="100"
                  step="50"
                  required
                  placeholder="Min ₹100"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-amber-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Available: ₹{member.walletBalance.toLocaleString()}
                </span>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Security 2FA / OTP Verification</label>
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP (or '123456')"
                  value={transferOtp}
                  onChange={(e) => setTransferOtp(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5"
              >
                <span>Authorize & Send Transfer</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Withdrawal Request Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4 text-amber-400" />
                <span>Withdraw Payout to Bank Account</span>
              </h3>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="text-slate-400 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
            </div>

            {withdrawFeedback && (
              <div className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                withdrawFeedback.success
                  ? 'bg-emerald-950 border border-emerald-700 text-emerald-300'
                  : 'bg-rose-950 border border-rose-700 text-rose-300'
              }`}>
                {withdrawFeedback.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{withdrawFeedback.text}</span>
              </div>
            )}

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
              <span className="text-slate-400 text-[10px] block">DESTINATION BANK ACCOUNT</span>
              <div className="font-semibold text-white">{member.bankAccount.bankName}</div>
              <div className="font-mono text-slate-300">A/C: {member.bankAccount.accountNumber} · IFSC: {member.bankAccount.ifsc}</div>
            </div>

            <form onSubmit={handleWithdrawalSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Withdrawal Amount (₹)</label>
                <input
                  type="number"
                  min={config.minWithdrawalAmount}
                  step="100"
                  required
                  placeholder={`Min ₹${config.minWithdrawalAmount}`}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-amber-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Available for NEFT/IMPS: ₹{member.walletBalance.toLocaleString()}
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5"
              >
                <span>Request Payout Settlement</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
