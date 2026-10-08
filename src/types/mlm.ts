export type BinaryPosition = 'left' | 'right';

export type UserRole = 'admin' | 'member';

export type KycStatus = 'verified' | 'pending' | 'rejected' | 'not_submitted';

export interface PackagePlan {
  id: number;
  name: string;
  productsCount: number;
  pv: number;
  binaryRate: number; // e.g. 0.10 for 10%
  mrp: number; // ₹2,150 * count
  dp: number;  // ₹1,700 * count
  distributionMargin: number; // ₹1,200 * count
  features: string[];
}

export interface RankReward {
  rankNumber: number;
  name: string;
  requiredPv: number;
  isCumulative: boolean;
  cashFundReward: string;
  tourExtraBenefits: string;
}

export interface Member {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  avatar?: string;
  sponsorId: string | null;
  sponsorUsername: string | null;
  parentId: string | null;
  position: BinaryPosition | null; // left or right under parent
  packageId: number;
  rank: string;
  rankNumber: number;
  walletBalance: number;
  leftTotalPv: number;
  rightTotalPv: number;
  leftCarryForwardPv: number;
  rightCarryForwardPv: number;
  directLeftCount: number;
  directRightCount: number;
  isBinaryQualified: boolean; // Needs >=1 Left Direct & >=1 Right Direct
  kycStatus: KycStatus;
  kycAadhaar: string;
  kycPan: string;
  bankAccount: {
    accountNumber: string;
    ifsc: string;
    bankName: string;
    holderName: string;
  };
  twoFactorEnabled: boolean;
  joinDate: string;
  status: 'active' | 'inactive' | 'blocked';
}

export interface WalletTransaction {
  id: string;
  memberId: string;
  memberName: string;
  type: 'binary_income' | 'direct_sponsor_commission' | 'sponsor_bonus' | 'repurchase_bonus' | 'transfer_in' | 'transfer_out' | 'withdrawal' | 'payout_credit';
  amount: number;
  tdsDeduction: number; // 2%
  adminCharge: number; // 5%
  netAmount: number;
  description: string;
  referenceId: string;
  date: string;
  status: 'completed' | 'pending' | 'rejected';
}

export interface SupportTicketReply {
  id: string;
  sender: 'member' | 'support';
  senderName: string;
  message: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  memberId: string;
  memberName: string;
  subject: string;
  category: 'Payout & Commission' | 'Binary Tree & Placement' | 'KYC Verification' | 'E-Wallet Transfer' | 'Product Delivery';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'answered' | 'closed';
  createdAt: string;
  updatedAt: string;
  replies: SupportTicketReply[];
}

export interface SystemAlert {
  id: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface CronTaskStatus {
  id: string;
  name: string;
  frequency: string;
  lastRun: string;
  nextRun: string;
  status: 'success' | 'running' | 'idle' | 'failed';
  executionTimeMs: number;
  recordsProcessed: number;
}

export interface GlobalProjectConfig {
  companyName: string;
  currencySymbol: string;
  mrpPrice: number;
  dpPrice: number;
  distributionMargin: number;
  pvRateInRupees: number;
  tdsPercentage: number;
  adminChargePercentage: number;
  directSponsorCommissionPercentage: number; // 9%
  selfRepurchasePercentage: number; // 9%
  sponsorBinaryBonusPercentage: number; // 10%
  weeklyClosingDay: 'Sunday' | 'Monday' | 'Friday';
  minWithdrawalAmount: number;
  maintenanceMode: boolean;
  autoApproveKyc: boolean;
}

export interface BinaryClosingResult {
  payoutBatchId: string;
  closingDate: string;
  totalQualifiedMembers: number;
  totalBinaryVolumeMatched: number;
  totalGrossCommission: number;
  totalTdsDeducted: number;
  totalAdminChargeDeducted: number;
  totalNetPayout: number;
  memberPayouts: Array<{
    memberId: string;
    username: string;
    matchedPv: number;
    binaryIncome: number;
    sponsorBonus: number;
    grossTotal: number;
    tds: number;
    adminCharge: number;
    netPayout: number;
    leftCarryForward: number;
    rightCarryForward: number;
  }>;
}
