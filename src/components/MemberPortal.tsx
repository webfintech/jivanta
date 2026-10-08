import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  Copy, 
  Check, 
  CheckCircle2, 
  AlertTriangle, 
  Award, 
  CreditCard, 
  Upload, 
  QrCode, 
  Smartphone, 
  KeyRound, 
  TrendingUp, 
  Clock, 
  ExternalLink
} from 'lucide-react';
import { Member } from '../types/mlm';
import { getPackageById, getRankProgress } from '../utils/binaryEngine';

interface MemberPortalProps {
  member: Member;
  onUpdateMemberKyc: (aadhaar: string, pan: string) => void;
  onToggle2Fa: () => void;
  onNavigateToTree: () => void;
  onNavigateToWallet: () => void;
}

export const MemberPortal: React.FC<MemberPortalProps> = ({
  member,
  onUpdateMemberKyc,
  onToggle2Fa,
  onNavigateToTree,
  onNavigateToWallet
}) => {
  const [copiedLink, setCopiedLink] = useState<'left' | 'right' | null>(null);
  const [aadhaarInput, setAadhaarInput] = useState(member.kycAadhaar || '');
  const [panInput, setPanInput] = useState(member.kycPan || '');
  const [kycSuccessMsg, setKycSuccessMsg] = useState(false);
  const [totpSimCode, setTotpSimCode] = useState('784920');

  const pkg = getPackageById(member.packageId);
  const rankProgress = getRankProgress(member.rankNumber, member.leftTotalPv + member.rightTotalPv);
  const isQual = member.directLeftCount >= 1 && member.directRightCount >= 1;

  const leftRefLink = `https://portal.jivantawellness.com/register?sponsor=${member.id}&leg=left`;
  const rightRefLink = `https://portal.jivantawellness.com/register?sponsor=${member.id}&leg=right`;

  const copyToClipboard = (text: string, leg: 'left' | 'right') => {
    navigator.clipboard.writeText(text);
    setCopiedLink(leg);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  const handleKycSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateMemberKyc(aadhaarInput, panInput);
    setKycSuccessMsg(true);
    setTimeout(() => setKycSuccessMsg(false), 3000);
  };

  return (
    <div className="w-full bg-slate-950 text-slate-100 min-h-screen p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* 1. Header Profile Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-black text-2xl text-slate-950 shadow-xl shadow-amber-500/20">
              {member.fullName.charAt(0)}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-white">{member.fullName}</h1>
                <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold">
                  {member.id}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-xs font-medium">
                  @{member.username}
                </span>
              </div>

              <div className="text-xs text-slate-400 flex items-center gap-3 flex-wrap">
                <span>Joined: {member.joinDate}</span>
                <span>·</span>
                <span>Sponsor: {member.sponsorId ? `${member.sponsorId} (@${member.sponsorUsername})` : 'Top Direct'}</span>
                <span>·</span>
                <span className="text-emerald-400 font-semibold">{pkg.name} ({pkg.pv} PV · {(pkg.binaryRate * 100)}% Binary)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToWallet}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
            >
              <span>E-Wallet: ₹{member.walletBalance.toLocaleString()}</span>
            </button>

            <button
              onClick={onNavigateToTree}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-all flex items-center gap-1.5"
            >
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
              <span>Tree View</span>
            </button>
          </div>

        </div>
      </div>

      {/* 2. Key Binary Qualification & Carry Forward Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card A: Mandatory Qualification Rule */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase">
            <span>Official Binary Qualification</span>
            <ShieldCheck className="w-4 h-4 text-amber-400" />
          </div>

          <div className="flex items-center gap-2">
            {isQual ? (
              <div className="px-3 py-1 rounded-lg bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>QUALIFIED (1L & 1R Active)</span>
              </div>
            ) : (
              <div className="px-3 py-1 rounded-lg bg-amber-950/80 border border-amber-700/60 text-amber-300 text-xs font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>UNQUALIFIED (Requires 1L & 1R)</span>
              </div>
            )}
          </div>

          <div className="text-xs text-slate-300 space-y-1">
            <div className="flex justify-between">
              <span>Direct Left Sponsors:</span>
              <span className="font-mono font-bold text-amber-400">{member.directLeftCount} / 1 req.</span>
            </div>
            <div className="flex justify-between">
              <span>Direct Right Sponsors:</span>
              <span className="font-mono font-bold text-emerald-400">{member.directRightCount} / 1 req.</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            * Mandatory Directs: 1 Left & 1 Right sponsor required to unlock weekly binary matching payouts.
          </p>
        </div>

        {/* Card B: Left vs Right Leg Volumes */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase">
            <span>Dual Leg Volume Tracking</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">LEFT LEG</span>
              <span className="font-mono font-bold text-amber-400 text-base">{member.leftTotalPv.toLocaleString()} PV</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Carry: {member.leftCarryForwardPv} PV</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">RIGHT LEG</span>
              <span className="font-mono font-bold text-emerald-400 text-base">{member.rightTotalPv.toLocaleString()} PV</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Carry: {member.rightCarryForwardPv} PV</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-300 flex justify-between font-mono pt-1">
            <span>Lifetime Carry Forward:</span>
            <span className="text-emerald-400 font-bold">100% Guaranteed</span>
          </div>
        </div>

        {/* Card C: Rank Progression */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase">
            <span>Rank & Rewards Matrix</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 block">CURRENT RANK</span>
              <span className="text-base font-bold text-amber-300">{member.rank}</span>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              Tier #{member.rankNumber} / 13
            </span>
          </div>

          {rankProgress.nextRank && (
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-300">
                <span>Next: {rankProgress.nextRank.name}</span>
                <span className="font-mono text-amber-400">{rankProgress.progressPercentage}%</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div 
                  style={{ width: `${rankProgress.progressPercentage}%` }} 
                  className="bg-gradient-to-r from-amber-500 to-amber-400 h-full"
                />
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Reward: {rankProgress.nextRank.cashFundReward} ({rankProgress.nextRank.tourExtraBenefits})
              </div>
            </div>
          )}
        </div>

      </div>

      {/* 3. Referral Link Sharing */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Distributor Placement Referral Links
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Share your direct link to place new members directly into your left or right binary leg.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Left Leg link */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-amber-400">LEFT LEG PLACEMENT LINK</span>
              <span className="text-[10px] text-slate-400 font-mono">Direct sponsor credit</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={leftRefLink}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 select-all focus:outline-none"
              />
              <button
                onClick={() => copyToClipboard(leftRefLink, 'left')}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 shrink-0 transition-colors"
              >
                {copiedLink === 'left' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink === 'left' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Right Leg link */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-400">RIGHT LEG PLACEMENT LINK</span>
              <span className="text-[10px] text-slate-400 font-mono">Direct sponsor credit</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={rightRefLink}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 select-all focus:outline-none"
              />
              <button
                onClick={() => copyToClipboard(rightRefLink, 'right')}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1 shrink-0 transition-colors"
              >
                {copiedLink === 'right' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink === 'right' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 4. KYC Verification & Multi-Factor Security Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* KYC Verification Form */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">KYC Verification Documents</h3>
              <p className="text-xs text-slate-400">Aadhaar Card & PAN Card required as per plan regulations</p>
            </div>
            <span className={`text-xs uppercase font-mono px-2 py-0.5 rounded font-bold border ${
              member.kycStatus === 'verified'
                ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                : 'bg-amber-950 text-amber-400 border-amber-800'
            }`}>
              {member.kycStatus}
            </span>
          </div>

          {kycSuccessMsg && (
            <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>KYC documents submitted for compliance review!</span>
            </div>
          )}

          <form onSubmit={handleKycSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Aadhaar Card Number</label>
              <input
                type="text"
                required
                value={aadhaarInput}
                onChange={(e) => setAadhaarInput(e.target.value)}
                placeholder="XXXX-XXXX-XXXX"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Permanent Account Number (PAN Card)</label>
              <input
                type="text"
                required
                value={panInput}
                onChange={(e) => setPanInput(e.target.value.toUpperCase())}
                placeholder="ABCDE1234F"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono uppercase focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-dashed border-slate-800 flex items-center justify-center gap-2 text-slate-400 cursor-pointer hover:border-slate-600 transition-colors">
              <Upload className="w-4 h-4 text-amber-400" />
              <span>Upload Scanned Front/Back Images (PDF, JPG, PNG)</span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>Update KYC Documents</span>
            </button>
          </form>
        </div>

        {/* Multi-Factor Authentication & Bank Details */}
        <div className="space-y-6">
          
          {/* Multi-factor Authentication */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Multi-Factor Security (2FA)</h3>
              </div>
              <button
                onClick={onToggle2Fa}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-colors ${
                  member.twoFactorEnabled
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {member.twoFactorEnabled ? '2FA ENABLED' : '2FA DISABLED'}
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Protects e-wallet fund transfers and withdrawal requests using RFC 6238 time-based one-time passwords (TOTP).
            </p>

            {member.twoFactorEnabled && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px]">CURRENT TOTP CODE</span>
                  <span className="text-lg font-black text-emerald-400">{totpSimCode}</span>
                </div>
                <button
                  onClick={() => setTotpSimCode(Math.floor(100000 + Math.random() * 900000).toString())}
                  className="text-xs text-amber-400 hover:underline"
                >
                  Regenerate
                </button>
              </div>
            )}
          </div>

          {/* Bank Account for Weekly Payouts */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-300">
              <span>Registered Bank Account</span>
              <CreditCard className="w-4 h-4 text-blue-400" />
            </div>

            <div className="text-xs space-y-1.5 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Bank Name:</span>
                <span className="font-semibold text-white">{member.bankAccount.bankName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Account Number:</span>
                <span className="font-mono text-white">{member.bankAccount.accountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">IFSC Code:</span>
                <span className="font-mono text-white">{member.bankAccount.ifsc}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Account Holder:</span>
                <span className="font-semibold text-white">{member.bankAccount.holderName}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
