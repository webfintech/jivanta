import React, { useState } from 'react';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { AdminDashboard } from './components/AdminDashboard';
import { BinaryTreeView } from './components/BinaryTreeView';
import { MemberPortal } from './components/MemberPortal';
import { WalletAndPayouts } from './components/WalletAndPayouts';
import { TicketSystem } from './components/TicketSystem';
import { PhpSqlExplorer } from './components/PhpSqlExplorer';

import { 
  Member, 
  GlobalProjectConfig, 
  WalletTransaction, 
  SupportTicket, 
  SystemAlert, 
  CronTaskStatus, 
  BinaryClosingResult, 
  BinaryPosition 
} from './types/mlm';

import { 
  INITIAL_MEMBERS, 
  INITIAL_CONFIG, 
  INITIAL_TRANSACTIONS, 
  INITIAL_TICKETS, 
  INITIAL_ALERTS, 
  INITIAL_CRON_STATUSES, 
  PACKAGES, 
  RANKS_MATRIX 
} from './data/mockMlmData';

import { 
  runWeeklyBinaryClosing, 
  exportToCsv, 
  getPackageById 
} from './utils/binaryEngine';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [activeMemberId, setActiveMemberId] = useState<string>('JW-1001');
  const [isAdmin, setIsAdmin] = useState<boolean>(true);
  const [config, setConfig] = useState<GlobalProjectConfig>(INITIAL_CONFIG);
  const [transactions, setTransactions] = useState<WalletTransaction[]>(INITIAL_TRANSACTIONS);
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);
  const [alerts, setAlerts] = useState<SystemAlert[]>(INITIAL_ALERTS);
  const [cronStatuses, setCronStatuses] = useState<CronTaskStatus[]>(INITIAL_CRON_STATUSES);
  const [lastClosingResult, setLastClosingResult] = useState<BinaryClosingResult | null>(null);
  const [twoFactorActive, setTwoFactorActive] = useState<boolean>(true);

  // Active member object
  const activeMember = members.find((m) => m.id === activeMemberId) || members[0];

  // Handler: Register New Member
  const handleRegisterMember = (newMemberData: Partial<Member>) => {
    const nextIdNum = 1000 + members.length + 1;
    const newId = `JW-${nextIdNum}`;
    const pkg = getPackageById(newMemberData.packageId || 1);
    const parentId = newMemberData.parentId || newMemberData.sponsorId || 'JW-1001';
    const position = newMemberData.position || 'left';

    const newMember: Member = {
      id: newId,
      username: newMemberData.username || `user_${nextIdNum}`,
      fullName: newMemberData.fullName || 'New Distributor',
      email: newMemberData.email || `distributor${nextIdNum}@gmail.com`,
      phone: newMemberData.phone || '+91 98000 00000',
      sponsorId: newMemberData.sponsorId || 'JW-1001',
      sponsorUsername: members.find((m) => m.id === newMemberData.sponsorId)?.username || 'rajesh_sharma',
      parentId: parentId,
      position: position,
      packageId: newMemberData.packageId || 1,
      rank: 'Rising Star',
      rankNumber: 1,
      walletBalance: 0,
      leftTotalPv: 0,
      rightTotalPv: 0,
      leftCarryForwardPv: 0,
      rightCarryForwardPv: 0,
      directLeftCount: 0,
      directRightCount: 0,
      isBinaryQualified: false,
      kycStatus: (newMemberData.kycAadhaar && newMemberData.kycPan) ? 'pending' : 'not_submitted',
      kycAadhaar: newMemberData.kycAadhaar || '',
      kycPan: newMemberData.kycPan || '',
      bankAccount: {
        accountNumber: '123456789012',
        ifsc: 'HDFC0001234',
        bankName: 'HDFC Bank',
        holderName: newMemberData.fullName || 'New Distributor'
      },
      twoFactorEnabled: false,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active'
    };

    // Update parent/sponsor volumes and direct counts
    const updatedMembers = members.map((m) => {
      let mod = { ...m };
      if (m.id === parentId) {
        if (position === 'left') {
          mod.leftTotalPv += pkg.pv;
          mod.leftCarryForwardPv += pkg.pv;
        } else {
          mod.rightTotalPv += pkg.pv;
          mod.rightCarryForwardPv += pkg.pv;
        }
      }
      if (m.id === newMemberData.sponsorId) {
        if (position === 'left') {
          mod.directLeftCount += 1;
        } else {
          mod.directRightCount += 1;
        }
        mod.isBinaryQualified = mod.directLeftCount >= 1 && mod.directRightCount >= 1;
      }
      return mod;
    });

    setMembers([...updatedMembers, newMember]);

    // Add Direct Sponsor Commission (9% as specified in official PDF)
    const directCommission = (pkg.dp * (config.directSponsorCommissionPercentage / 100));
    const tds = directCommission * (config.tdsPercentage / 100);
    const admin = directCommission * (config.adminChargePercentage / 100);
    const netCommission = directCommission - tds - admin;

    const sponsorTx: WalletTransaction = {
      id: `TXN-DIR-${Date.now().toString().slice(-5)}`,
      memberId: newMember.sponsorId || 'JW-1001',
      memberName: members.find((m) => m.id === newMember.sponsorId)?.fullName || 'Sponsor',
      type: 'direct_sponsor_commission',
      amount: directCommission,
      tdsDeduction: tds,
      adminCharge: admin,
      netAmount: netCommission,
      description: `9% Direct Sponsor Sales Commission on new member onboarding (${newMember.fullName} - ${pkg.name})`,
      referenceId: `REF-${newId}`,
      date: new Date().toISOString().replace('T', ' ').slice(0, 19),
      status: 'completed'
    };

    setTransactions((prev) => [sponsorTx, ...prev]);

    // Create System Alert
    const newAlert: SystemAlert = {
      id: `ALT-${Date.now()}`,
      type: 'success',
      title: 'New Member Onboarded',
      message: `${newMember.fullName} (${newId}) activated with ${pkg.pv} PV under ${parentId} (${position.toUpperCase()} leg). 9% direct commission credited to sponsor.`,
      timestamp: 'Just now',
      read: false
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  // Handler: Execute Weekly Binary Closing
  const handleRunWeeklyClosing = () => {
    const { updatedMembers, newTransactions, resultSummary } = runWeeklyBinaryClosing(members, config);
    setMembers(updatedMembers);
    setTransactions((prev) => [...newTransactions, ...prev]);
    setLastClosingResult(resultSummary);

    const closeAlert: SystemAlert = {
      id: `ALT-CLOSE-${Date.now()}`,
      type: 'success',
      title: `Weekly Binary Closing (${resultSummary.payoutBatchId}) Completed`,
      message: `Matched ${resultSummary.totalBinaryVolumeMatched.toLocaleString()} PV across ${resultSummary.totalQualifiedMembers} qualified nodes. Disbursed ₹${resultSummary.totalNetPayout.toLocaleString()} net into e-wallets after 2% TDS & 5% Admin deductions.`,
      timestamp: 'Just now',
      read: false
    };
    setAlerts((prev) => [closeAlert, ...prev]);

    // Update Cron status
    setCronStatuses((prev) =>
      prev.map((c) =>
        c.id === 'CRON-1'
          ? {
              ...c,
              lastRun: new Date().toISOString().replace('T', ' ').slice(0, 19),
              recordsProcessed: resultSummary.totalQualifiedMembers
            }
          : c
      )
    );
  };

  // Handler: P2P Fund Transfer
  const handleSendTransfer = (recipientCode: string, amount: number, otp: string) => {
    const recipient = members.find((m) => m.id === recipientCode || m.username === recipientCode.toLowerCase());
    if (!recipient) {
      return { success: false, message: `Member with code "${recipientCode}" not found.` };
    }
    if (recipient.id === activeMember.id) {
      return { success: false, message: 'Cannot transfer funds to your own account.' };
    }
    if (activeMember.walletBalance < amount) {
      return { success: false, message: `Insufficient balance. Available: ₹${activeMember.walletBalance.toLocaleString()}` };
    }

    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

    const updated = members.map((m) => {
      if (m.id === activeMember.id) {
        return { ...m, walletBalance: m.walletBalance - amount };
      }
      if (m.id === recipient.id) {
        return { ...m, walletBalance: m.walletBalance + amount };
      }
      return m;
    });
    setMembers(updated);

    const debitTx: WalletTransaction = {
      id: `TXN-TRF-${Date.now().toString().slice(-4)}`,
      memberId: activeMember.id,
      memberName: activeMember.fullName,
      type: 'transfer_out',
      amount: amount,
      tdsDeduction: 0,
      adminCharge: 0,
      netAmount: amount,
      description: `P2P E-Wallet Fund Transfer to ${recipient.fullName} (${recipient.id})`,
      referenceId: `P2P-${Date.now().toString().slice(-6)}`,
      date: now,
      status: 'completed'
    };

    const creditTx: WalletTransaction = {
      id: `TXN-REC-${Date.now().toString().slice(-4)}`,
      memberId: recipient.id,
      memberName: recipient.fullName,
      type: 'transfer_in',
      amount: amount,
      tdsDeduction: 0,
      adminCharge: 0,
      netAmount: amount,
      description: `P2P E-Wallet Fund Transfer from ${activeMember.fullName} (${activeMember.id})`,
      referenceId: debitTx.referenceId,
      date: now,
      status: 'completed'
    };

    setTransactions((prev) => [debitTx, creditTx, ...prev]);

    return { success: true, message: `Successfully transferred ₹${amount.toLocaleString()} to ${recipient.fullName}!` };
  };

  // Handler: Withdrawal Request
  const handleRequestWithdrawal = (amount: number) => {
    if (activeMember.walletBalance < amount) {
      return { success: false, message: 'Insufficient balance for withdrawal.' };
    }

    const updated = members.map((m) => {
      if (m.id === activeMember.id) {
        return { ...m, walletBalance: m.walletBalance - amount };
      }
      return m;
    });
    setMembers(updated);

    const withdrawTx: WalletTransaction = {
      id: `TXN-WTH-${Date.now().toString().slice(-4)}`,
      memberId: activeMember.id,
      memberName: activeMember.fullName,
      type: 'withdrawal',
      amount: amount,
      tdsDeduction: 0,
      adminCharge: 0,
      netAmount: amount,
      description: `NEFT Withdrawal payout to ${activeMember.bankAccount.bankName} (${activeMember.bankAccount.accountNumber})`,
      referenceId: `WTH-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().replace('T', ' ').slice(0, 19),
      status: 'completed'
    };

    setTransactions((prev) => [withdrawTx, ...prev]);
    return { success: true, message: `Withdrawal request of ₹${amount.toLocaleString()} submitted successfully.` };
  };

  // Handler: Update KYC
  const handleUpdateMemberKyc = (aadhaar: string, pan: string) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === activeMember.id
          ? {
              ...m,
              kycAadhaar: aadhaar,
              kycPan: pan,
              kycStatus: 'pending'
            }
          : m
      )
    );
  };

  // Handler: Support Tickets
  const handleAddTicket = (ticketData: Partial<SupportTicket>, initialMessage: string) => {
    const nextNum = 9900 + tickets.length + 1;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const newTck: SupportTicket = {
      id: `TCK-${Date.now().toString().slice(-4)}`,
      ticketNumber: `JW-TCK-${nextNum}`,
      memberId: ticketData.memberId || activeMember.id,
      memberName: ticketData.memberName || activeMember.fullName,
      subject: ticketData.subject || 'Support Request',
      category: ticketData.category || 'Payout & Commission',
      priority: ticketData.priority || 'medium',
      status: 'open',
      createdAt: now,
      updatedAt: now,
      replies: [
        {
          id: `REP-${Date.now()}`,
          sender: 'member',
          senderName: activeMember.fullName,
          message: initialMessage,
          timestamp: now
        }
      ]
    };
    setTickets([newTck, ...tickets]);
  };

  const handleAddReply = (ticketId: string, message: string, senderType: 'member' | 'support') => {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            status: senderType === 'support' ? 'answered' : 'open',
            updatedAt: now,
            replies: [
              ...t.replies,
              {
                id: `REP-${Date.now()}`,
                sender: senderType,
                senderName: senderType === 'support' ? 'Jivanta Compliance Officer' : activeMember.fullName,
                message,
                timestamp: now
              }
            ]
          };
        }
        return t;
      })
    );
  };

  const handleUpdateTicketStatus = (ticketId: string, status: SupportTicket['status']) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status } : t))
    );
  };

  // Quick export all members to CSV
  const handleExportSystemCsv = () => {
    const rows = members.map((m) => ({
      Member_ID: m.id,
      Username: m.username,
      Full_Name: m.fullName,
      Email: m.email,
      Rank: m.rank,
      Left_PV: m.leftTotalPv,
      Right_PV: m.rightTotalPv,
      Left_Carry_PV: m.leftCarryForwardPv,
      Right_Carry_PV: m.rightCarryForwardPv,
      Direct_Left: m.directLeftCount,
      Direct_Right: m.directRightCount,
      Qualified: m.directLeftCount >= 1 && m.directRightCount >= 1 ? 'YES' : 'NO',
      Wallet_Balance: m.walletBalance,
      KYC_Status: m.kycStatus
    }));
    exportToCsv('Jivanta_Full_Distributor_Report', rows);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Universal Top Bar */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        activeMember={activeMember}
        allMembers={members}
        onSelectMember={(id) => setActiveMemberId(id)}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        onExportCsv={handleExportSystemCsv}
        twoFactorActive={twoFactorActive}
        onToggle2Fa={() => setTwoFactorActive(!twoFactorActive)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {currentTab === 'landing' && (
          <LandingPage
            onRegisterMember={handleRegisterMember}
            onNavigateToTree={() => setCurrentTab('tree')}
            onNavigateToPortal={() => setCurrentTab('portal')}
          />
        )}

        {currentTab === 'admin' && (
          <AdminDashboard
            config={config}
            onUpdateConfig={setConfig}
            members={members}
            onUpdateMembers={setMembers}
            alerts={alerts}
            onDismissAlert={(id) => setAlerts((prev) => prev.filter((a) => a.id !== id))}
            cronStatuses={cronStatuses}
            onRunClosing={handleRunWeeklyClosing}
            lastClosingResult={lastClosingResult}
            transactions={transactions}
          />
        )}

        {currentTab === 'tree' && (
          <BinaryTreeView
            members={members}
            rootMemberId={activeMember.id}
            onSelectRootMember={(id) => setActiveMemberId(id)}
            onAddMemberAtSlot={(parentId, position) => {
              handleRegisterMember({
                parentId,
                sponsorId: activeMember.id,
                position,
                fullName: `Distributor Under ${parentId}`
              });
            }}
          />
        )}

        {currentTab === 'portal' && (
          <MemberPortal
            member={activeMember}
            onUpdateMemberKyc={handleUpdateMemberKyc}
            onToggle2Fa={() => setTwoFactorActive(!twoFactorActive)}
            onNavigateToTree={() => setCurrentTab('tree')}
            onNavigateToWallet={() => setCurrentTab('wallet')}
          />
        )}

        {currentTab === 'wallet' && (
          <WalletAndPayouts
            member={activeMember}
            transactions={transactions}
            config={config}
            onSendTransfer={handleSendTransfer}
            onRequestWithdrawal={handleRequestWithdrawal}
          />
        )}

        {currentTab === 'tickets' && (
          <TicketSystem
            tickets={tickets}
            currentMember={activeMember}
            isAdmin={isAdmin}
            onAddTicket={handleAddTicket}
            onAddReply={handleAddReply}
            onUpdateTicketStatus={handleUpdateTicketStatus}
          />
        )}

        {currentTab === 'php_code' && (
          <PhpSqlExplorer />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-amber-400">JIVANTA WELLNESS</span>
            <span>· Official MLM Management OS & Commission Engine</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Weekly Payouts</span>
            <span>·</span>
            <span>TDS 2% + Admin 5%</span>
            <span>·</span>
            <span>Lifetime Carry Forward</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
