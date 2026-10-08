import { PackagePlan, RankReward, Member, WalletTransaction, SupportTicket, SystemAlert, CronTaskStatus, GlobalProjectConfig } from '../types/mlm';

export const PACKAGES: PackagePlan[] = [
  {
    id: 1,
    name: 'Starter Wellness (1 Product)',
    productsCount: 1,
    pv: 12,
    binaryRate: 0.10, // 10% Binary
    mrp: 2150,
    dp: 1700,
    distributionMargin: 1200,
    features: ['1 Vitality Product Bottle', '12 Business Volume (PV)', '10% Binary Matching Income', '9% Direct Sponsor Commission', 'Lifetime Volume Carry Forward']
  },
  {
    id: 2,
    name: 'Executive Wellness (3 Products)',
    productsCount: 3,
    pv: 36,
    binaryRate: 0.12, // 12% Binary
    mrp: 6450,
    dp: 5100,
    distributionMargin: 3600,
    features: ['3 Vitality Wellness Pack', '36 Business Volume (PV)', '12% Binary Matching Income', '9% Direct Sponsor Commission', '10% Direct Sponsor Binary Match']
  },
  {
    id: 3,
    name: 'Royal Elite Wellness (7 Products)',
    productsCount: 7,
    pv: 84,
    binaryRate: 0.14, // 14% Binary
    mrp: 15050,
    dp: 11900,
    distributionMargin: 8400,
    features: ['7 Complete Health Formulation Pack', '84 Business Volume (PV)', '14% Maximum Binary Income', 'Fast Track Rank Eligibility', 'All Tour & Reward Allocations']
  }
];

export const RANKS_MATRIX: RankReward[] = [
  { rankNumber: 1, name: 'Rising Star', requiredPv: 168, isCumulative: false, cashFundReward: 'Gift Box', tourExtraBenefits: '—' },
  { rankNumber: 2, name: 'Senior Star', requiredPv: 504, isCumulative: false, cashFundReward: '1 Product Free', tourExtraBenefits: 'TDP (Team Development Program)' },
  { rankNumber: 3, name: 'Blue Star', requiredPv: 1680, isCumulative: false, cashFundReward: '2 Products Free', tourExtraBenefits: 'Out-of-State Tour (2N/3D) + Brain Storming' },
  { rankNumber: 4, name: 'Diamond', requiredPv: 5964, isCumulative: false, cashFundReward: '₹5,100 Cash', tourExtraBenefits: 'Out-of-State Tour (2 Persons: Leader + Family)' },
  { rankNumber: 5, name: 'Blue Diamond', requiredPv: 17724, isCumulative: false, cashFundReward: '₹45,000 Bike Fund', tourExtraBenefits: '—' },
  { rankNumber: 6, name: 'Gold Diamond', requiredPv: 50820, isCumulative: false, cashFundReward: '₹1,25,000 Bike Fund', tourExtraBenefits: 'Goa Tour' },
  { rankNumber: 7, name: 'Ruby Diamond', requiredPv: 131964, isCumulative: false, cashFundReward: '₹4,15,000 Car Fund', tourExtraBenefits: '+1% Royalty (1% Extra Binary)' },
  { rankNumber: 8, name: 'Royal Diamond', requiredPv: 257964, isCumulative: false, cashFundReward: '₹9,00,000 Car Fund', tourExtraBenefits: 'Thailand Tour' },
  { rankNumber: 9, name: 'Ambassador', requiredPv: 515928, isCumulative: false, cashFundReward: '₹21,00,000 Car Fund', tourExtraBenefits: 'Singapore Trip (+2% Binary Add)' },
  { rankNumber: 10, name: 'President', requiredPv: 1031940, isCumulative: false, cashFundReward: '₹50,00,000 Car Fund', tourExtraBenefits: 'Malaysia Trip' },
  { rankNumber: 11, name: 'Crown President', requiredPv: 1799952, isCumulative: false, cashFundReward: '₹1,00,00,000 (1 Cr) Car Fund', tourExtraBenefits: '+3% Binary Add' },
  { rankNumber: 12, name: 'Royal President', requiredPv: 3239964, isCumulative: false, cashFundReward: '₹2,50,00,000 (2.5 Cr) Flat Fund', tourExtraBenefits: '—' },
  { rankNumber: 13, name: 'Universal', requiredPv: 5399940, isCumulative: false, cashFundReward: '₹4,00,00,000 (4 Cr) Villa Fund', tourExtraBenefits: 'World Tour' }
];

export const INITIAL_CONFIG: GlobalProjectConfig = {
  companyName: 'JIVANTA WELLNESS',
  currencySymbol: '₹',
  mrpPrice: 2150,
  dpPrice: 1700,
  distributionMargin: 1200,
  pvRateInRupees: 100, // 1 PV = ₹100 calculation factor for binary
  tdsPercentage: 2.0, // As per PDF: TDS 2%
  adminChargePercentage: 5.0, // As per PDF: Admin Charge 5%
  directSponsorCommissionPercentage: 9.0, // Direct Sponsor Sales Commission: 9%
  selfRepurchasePercentage: 9.0, // Self Re-purchase Bonus: 9%
  sponsorBinaryBonusPercentage: 10.0, // Direct Sponsor Bonus: 10% (On Binary Payout only)
  weeklyClosingDay: 'Sunday',
  minWithdrawalAmount: 1000,
  maintenanceMode: false,
  autoApproveKyc: false
};

export const INITIAL_MEMBERS: Member[] = [
  {
    id: 'JW-1001',
    username: 'rajesh_sharma',
    fullName: 'Rajesh Sharma',
    email: 'rajesh.jivanta@gmail.com',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    sponsorId: null,
    sponsorUsername: null,
    parentId: null,
    position: null,
    packageId: 3, // 84 PV, 14% binary
    rank: 'Royal Diamond',
    rankNumber: 8,
    walletBalance: 485200,
    leftTotalPv: 312000,
    rightTotalPv: 289400,
    leftCarryForwardPv: 22600,
    rightCarryForwardPv: 0,
    directLeftCount: 4,
    directRightCount: 5,
    isBinaryQualified: true,
    kycStatus: 'verified',
    kycAadhaar: '5421-9874-3210',
    kycPan: 'ABCPS1234F',
    bankAccount: {
      accountNumber: '918273645012',
      ifsc: 'HDFC0001234',
      bankName: 'HDFC Bank',
      holderName: 'Rajesh Sharma'
    },
    twoFactorEnabled: true,
    joinDate: '2025-01-15',
    status: 'active'
  },
  {
    id: 'JW-1002',
    username: 'anita_deshmukh',
    fullName: 'Anita Deshmukh',
    email: 'anita.d@gmail.com',
    phone: '+91 98234 11223',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    sponsorId: 'JW-1001',
    sponsorUsername: 'rajesh_sharma',
    parentId: 'JW-1001',
    position: 'left',
    packageId: 3,
    rank: 'Ruby Diamond',
    rankNumber: 7,
    walletBalance: 198400,
    leftTotalPv: 154000,
    rightTotalPv: 148200,
    leftCarryForwardPv: 5800,
    rightCarryForwardPv: 0,
    directLeftCount: 3,
    directRightCount: 2,
    isBinaryQualified: true,
    kycStatus: 'verified',
    kycAadhaar: '7721-4321-9988',
    kycPan: 'BDEPA9876C',
    bankAccount: {
      accountNumber: '445566778899',
      ifsc: 'ICIC0004321',
      bankName: 'ICICI Bank',
      holderName: 'Anita Deshmukh'
    },
    twoFactorEnabled: true,
    joinDate: '2025-02-01',
    status: 'active'
  },
  {
    id: 'JW-1003',
    username: 'vikram_patel',
    fullName: 'Vikram Patel',
    email: 'vikram.patel@gmail.com',
    phone: '+91 97123 99881',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    sponsorId: 'JW-1001',
    sponsorUsername: 'rajesh_sharma',
    parentId: 'JW-1001',
    position: 'right',
    packageId: 3,
    rank: 'Gold Diamond',
    rankNumber: 6,
    walletBalance: 124600,
    leftTotalPv: 72000,
    rightTotalPv: 68400,
    leftCarryForwardPv: 3600,
    rightCarryForwardPv: 0,
    directLeftCount: 2,
    directRightCount: 3,
    isBinaryQualified: true,
    kycStatus: 'verified',
    kycAadhaar: '3210-9874-5544',
    kycPan: 'CKLPP5432D',
    bankAccount: {
      accountNumber: '112233445566',
      ifsc: 'SBIN0007890',
      bankName: 'State Bank of India',
      holderName: 'Vikram Patel'
    },
    twoFactorEnabled: true,
    joinDate: '2025-02-10',
    status: 'active'
  },
  {
    id: 'JW-1004',
    username: 'priya_nair',
    fullName: 'Priya Nair',
    email: 'priya.nair@gmail.com',
    phone: '+91 94471 22334',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    sponsorId: 'JW-1002',
    sponsorUsername: 'anita_deshmukh',
    parentId: 'JW-1002',
    position: 'left',
    packageId: 2, // 36 PV, 12% binary
    rank: 'Blue Diamond',
    rankNumber: 5,
    walletBalance: 64200,
    leftTotalPv: 24500,
    rightTotalPv: 21800,
    leftCarryForwardPv: 2700,
    rightCarryForwardPv: 0,
    directLeftCount: 2,
    directRightCount: 2,
    isBinaryQualified: true,
    kycStatus: 'verified',
    kycAadhaar: '8877-6655-4433',
    kycPan: 'DEPNA3344E',
    bankAccount: {
      accountNumber: '998877665544',
      ifsc: 'KKBK0001928',
      bankName: 'Kotak Mahindra Bank',
      holderName: 'Priya Nair'
    },
    twoFactorEnabled: false,
    joinDate: '2025-03-05',
    status: 'active'
  },
  {
    id: 'JW-1005',
    username: 'manoj_verma',
    fullName: 'Manoj Verma',
    email: 'manoj.verma@gmail.com',
    phone: '+91 99112 44556',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    sponsorId: 'JW-1002',
    sponsorUsername: 'anita_deshmukh',
    parentId: 'JW-1002',
    position: 'right',
    packageId: 2,
    rank: 'Diamond',
    rankNumber: 4,
    walletBalance: 32800,
    leftTotalPv: 9800,
    rightTotalPv: 8400,
    leftCarryForwardPv: 1400,
    rightCarryForwardPv: 0,
    directLeftCount: 1,
    directRightCount: 1,
    isBinaryQualified: true,
    kycStatus: 'verified',
    kycAadhaar: '1234-5678-9012',
    kycPan: 'FGHJK5678L',
    bankAccount: {
      accountNumber: '334455667788',
      ifsc: 'BARB0POWAI',
      bankName: 'Bank of Baroda',
      holderName: 'Manoj Verma'
    },
    twoFactorEnabled: false,
    joinDate: '2025-03-20',
    status: 'active'
  },
  {
    id: 'JW-1006',
    username: 'suresh_reddy',
    fullName: 'Suresh Reddy',
    email: 'suresh.reddy@gmail.com',
    phone: '+91 98480 33221',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    sponsorId: 'JW-1003',
    sponsorUsername: 'vikram_patel',
    parentId: 'JW-1003',
    position: 'left',
    packageId: 3,
    rank: 'Blue Star',
    rankNumber: 3,
    walletBalance: 21500,
    leftTotalPv: 3400,
    rightTotalPv: 2800,
    leftCarryForwardPv: 600,
    rightCarryForwardPv: 0,
    directLeftCount: 1,
    directRightCount: 1,
    isBinaryQualified: true,
    kycStatus: 'verified',
    kycAadhaar: '9900-1122-3344',
    kycPan: 'REDDY1234M',
    bankAccount: {
      accountNumber: '556677889900',
      ifsc: 'UTIB0000456',
      bankName: 'Axis Bank',
      holderName: 'Suresh Reddy'
    },
    twoFactorEnabled: true,
    joinDate: '2025-04-12',
    status: 'active'
  },
  {
    id: 'JW-1007',
    username: 'kavita_singh',
    fullName: 'Kavita Singh',
    email: 'kavita.singh@gmail.com',
    phone: '+91 98390 88776',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    sponsorId: 'JW-1003',
    sponsorUsername: 'vikram_patel',
    parentId: 'JW-1003',
    position: 'right',
    packageId: 1, // 12 PV, 10% binary
    rank: 'Senior Star',
    rankNumber: 2,
    walletBalance: 9800,
    leftTotalPv: 950,
    rightTotalPv: 720,
    leftCarryForwardPv: 230,
    rightCarryForwardPv: 0,
    directLeftCount: 1,
    directRightCount: 1,
    isBinaryQualified: true,
    kycStatus: 'pending',
    kycAadhaar: '4567-8901-2345',
    kycPan: 'KAVIT5678N',
    bankAccount: {
      accountNumber: '778899001122',
      ifsc: 'PUNB0123456',
      bankName: 'Punjab National Bank',
      holderName: 'Kavita Singh'
    },
    twoFactorEnabled: false,
    joinDate: '2025-05-01',
    status: 'active'
  },
  {
    id: 'JW-1008',
    username: 'deepak_kumar',
    fullName: 'Deepak Kumar',
    email: 'deepak.k@gmail.com',
    phone: '+91 97554 12345',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
    sponsorId: 'JW-1004',
    sponsorUsername: 'priya_nair',
    parentId: 'JW-1004',
    position: 'left',
    packageId: 1,
    rank: 'Rising Star',
    rankNumber: 1,
    walletBalance: 4200,
    leftTotalPv: 240,
    rightTotalPv: 180,
    leftCarryForwardPv: 60,
    rightCarryForwardPv: 0,
    directLeftCount: 1,
    directRightCount: 1,
    isBinaryQualified: true,
    kycStatus: 'verified',
    kycAadhaar: '6543-2109-8765',
    kycPan: 'DEEPA4321P',
    bankAccount: {
      accountNumber: '889900112233',
      ifsc: 'SBIN0001122',
      bankName: 'State Bank of India',
      holderName: 'Deepak Kumar'
    },
    twoFactorEnabled: false,
    joinDate: '2025-06-15',
    status: 'active'
  },
  {
    id: 'JW-1009',
    username: 'swati_bose',
    fullName: 'Swati Bose',
    email: 'swati.bose@gmail.com',
    phone: '+91 98301 54321',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    sponsorId: 'JW-1004',
    sponsorUsername: 'priya_nair',
    parentId: 'JW-1004',
    position: 'right',
    packageId: 2,
    rank: 'Rising Star',
    rankNumber: 1,
    walletBalance: 3100,
    leftTotalPv: 120,
    rightTotalPv: 84,
    leftCarryForwardPv: 36,
    rightCarryForwardPv: 0,
    directLeftCount: 1,
    directRightCount: 0,
    isBinaryQualified: false, // Needs 1 right direct to qualify!
    kycStatus: 'verified',
    kycAadhaar: '3214-5678-9988',
    kycPan: 'BOSEW9988Q',
    bankAccount: {
      accountNumber: '990011223344',
      ifsc: 'HDFC0004567',
      bankName: 'HDFC Bank',
      holderName: 'Swati Bose'
    },
    twoFactorEnabled: false,
    joinDate: '2025-07-02',
    status: 'active'
  }
];

export const INITIAL_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'TXN-88491',
    memberId: 'JW-1001',
    memberName: 'Rajesh Sharma',
    type: 'binary_income',
    amount: 32000,
    tdsDeduction: 640,
    adminCharge: 1600,
    netAmount: 29760,
    description: 'Weekly Binary Matching Commission (Cycle #38 - 14% Slabs)',
    referenceId: 'BIN-2025-38-001',
    date: '2025-09-28 23:59:00',
    status: 'completed'
  },
  {
    id: 'TXN-88492',
    memberId: 'JW-1001',
    memberName: 'Rajesh Sharma',
    type: 'sponsor_bonus',
    amount: 4500,
    tdsDeduction: 90,
    adminCharge: 225,
    netAmount: 4185,
    description: '10% Direct Sponsor Binary Match Bonus from Anita Deshmukh',
    referenceId: 'SPN-2025-38-004',
    date: '2025-09-28 23:59:30',
    status: 'completed'
  },
  {
    id: 'TXN-88493',
    memberId: 'JW-1002',
    memberName: 'Anita Deshmukh',
    type: 'binary_income',
    amount: 18500,
    tdsDeduction: 370,
    adminCharge: 925,
    netAmount: 17205,
    description: 'Weekly Binary Matching Commission (Cycle #38 - 14% Slabs)',
    referenceId: 'BIN-2025-38-002',
    date: '2025-09-28 23:59:00',
    status: 'completed'
  },
  {
    id: 'TXN-88494',
    memberId: 'JW-1002',
    memberName: 'Anita Deshmukh',
    type: 'direct_sponsor_commission',
    amount: 1071, // 9% on 7 products DP
    tdsDeduction: 21.42,
    adminCharge: 53.55,
    netAmount: 996.03,
    description: '9% Direct Sponsor Sales Commission on new member onboarding',
    referenceId: 'DSC-2025-38-011',
    date: '2025-09-27 14:20:15',
    status: 'completed'
  },
  {
    id: 'TXN-88495',
    memberId: 'JW-1003',
    memberName: 'Vikram Patel',
    type: 'withdrawal',
    amount: 25000,
    tdsDeduction: 0,
    adminCharge: 0,
    netAmount: 25000,
    description: 'NEFT Payout Withdrawal to SBI A/C ending 5566',
    referenceId: 'WTH-2025-09-108',
    date: '2025-09-26 11:15:00',
    status: 'completed'
  },
  {
    id: 'TXN-88496',
    memberId: 'JW-1004',
    memberName: 'Priya Nair',
    type: 'transfer_out',
    amount: 5000,
    tdsDeduction: 0,
    adminCharge: 0,
    netAmount: 5000,
    description: 'P2P E-Wallet Fund Transfer to member Deepak Kumar (JW-1008)',
    referenceId: 'TRF-2025-09-543',
    date: '2025-09-25 18:30:00',
    status: 'completed'
  }
];

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'TCK-201',
    ticketNumber: 'JW-TCK-9901',
    memberId: 'JW-1007',
    memberName: 'Kavita Singh',
    subject: 'Aadhaar Card KYC verification pending since 48 hours',
    category: 'KYC Verification',
    priority: 'high',
    status: 'open',
    createdAt: '2025-09-29 09:30:00',
    updatedAt: '2025-09-29 09:30:00',
    replies: [
      {
        id: 'REP-1',
        sender: 'member',
        senderName: 'Kavita Singh',
        message: 'Hello Support, I have uploaded clear scanned copies of my Aadhaar Card and PAN Card. Please approve so my upcoming weekly binary payout does not get held.',
        timestamp: '2025-09-29 09:30:00'
      }
    ]
  },
  {
    id: 'TCK-202',
    ticketNumber: 'JW-TCK-9902',
    memberId: 'JW-1009',
    memberName: 'Swati Bose',
    subject: 'Binary qualification query - 1 Left and 1 Right direct sponsor rule',
    category: 'Binary Tree & Placement',
    priority: 'medium',
    status: 'answered',
    createdAt: '2025-09-28 16:40:00',
    updatedAt: '2025-09-28 17:15:00',
    replies: [
      {
        id: 'REP-2',
        sender: 'member',
        senderName: 'Swati Bose',
        message: 'I have 1 direct sponsor on the Left leg with 84 PV. Do I need 1 direct sponsor on the Right leg before my binary matching commission generates?',
        timestamp: '2025-09-28 16:40:00'
      },
      {
        id: 'REP-3',
        sender: 'support',
        senderName: 'Jivanta Compliance Officer',
        message: 'Yes, Swati. As per the Terms & Regulations of Jivanta Wellness, Mandatory Directs: 1 Left & 1 Right Direct Sponsor are required to activate Binary Matching Income. Your volume will carry forward until qualified.',
        timestamp: '2025-09-28 17:15:00'
      }
    ]
  },
  {
    id: 'TCK-203',
    ticketNumber: 'JW-TCK-9903',
    memberId: 'JW-1005',
    memberName: 'Manoj Verma',
    subject: 'TDS certificate & form 16A download request for Q2',
    category: 'Payout & Commission',
    priority: 'low',
    status: 'closed',
    createdAt: '2025-09-20 11:00:00',
    updatedAt: '2025-09-21 14:10:00',
    replies: [
      {
        id: 'REP-4',
        sender: 'member',
        senderName: 'Manoj Verma',
        message: 'Please send my 2% TDS deduction breakdown for Income Tax filing.',
        timestamp: '2025-09-20 11:00:00'
      },
      {
        id: 'REP-5',
        sender: 'support',
        senderName: 'Accounts Desk',
        message: 'The TDS summary has been uploaded directly to your E-Wallet ledger. You can export it in CSV format at any time.',
        timestamp: '2025-09-21 14:10:00'
      }
    ]
  }
];

export const INITIAL_ALERTS: SystemAlert[] = [
  {
    id: 'ALT-1',
    type: 'success',
    title: 'Weekly Binary Closing Completed',
    message: 'Cycle #38 executed successfully. Distributed ₹3,84,200 across 48 qualified nodes with 2% TDS & 5% Admin deductions applied.',
    timestamp: '2025-09-28 23:59:59',
    read: false
  },
  {
    id: 'ALT-2',
    type: 'warning',
    title: 'KYC Verification Pending Queue',
    message: '3 member Aadhaar & PAN verification requests are awaiting compliance review in Admin Console.',
    timestamp: '2025-09-29 08:15:00',
    read: false
  },
  {
    id: 'ALT-3',
    type: 'info',
    title: 'Lifetime Volume Carry Forward Active',
    message: '1,42,800 PV unmatched leg volume carried forward without expiration for eligible members.',
    timestamp: '2025-09-28 23:59:30',
    read: true
  },
  {
    id: 'ALT-4',
    type: 'alert',
    title: 'High Volume Matching Detected',
    message: 'Node JW-1001 (Rajesh Sharma) achieved 22,600 PV binary match in single closing window.',
    timestamp: '2025-09-28 22:40:00',
    read: true
  }
];

export const INITIAL_CRON_STATUSES: CronTaskStatus[] = [
  {
    id: 'CRON-1',
    name: 'Weekly Binary Commission Matching Engine',
    frequency: 'Every Sunday 23:59:00 IST',
    lastRun: '2025-09-28 23:59:02',
    nextRun: '2025-10-05 23:59:00',
    status: 'idle',
    executionTimeMs: 412,
    recordsProcessed: 1240
  },
  {
    id: 'CRON-2',
    name: 'Recursive Hierarchy Volume & Carry-Forward Rollup',
    frequency: 'Real-time & Hourly Batch',
    lastRun: '2025-09-29 07:00:00',
    nextRun: '2025-09-29 08:00:00',
    status: 'idle',
    executionTimeMs: 84,
    recordsProcessed: 1240
  },
  {
    id: 'CRON-3',
    name: 'Rank Promotion & Tour Reward Evaluation',
    frequency: 'Daily 00:05:00 IST',
    lastRun: '2025-09-29 00:05:01',
    nextRun: '2025-09-30 00:05:00',
    status: 'idle',
    executionTimeMs: 120,
    recordsProcessed: 48
  },
  {
    id: 'CRON-4',
    name: 'E-Wallet Ledger & Payout Bank Reconciliation',
    frequency: 'Every 6 Hours',
    lastRun: '2025-09-29 06:00:00',
    nextRun: '2025-09-29 12:00:00',
    status: 'idle',
    executionTimeMs: 65,
    recordsProcessed: 310
  }
];

// Multilingual translations for the 10 supported languages highlighted in page 1 of the brochure:
// English, Hindi, Bengali, Marathi, Telugu, Tamil, Gujarati, Urdu, Kannada, Odia
export const TRANSLATIONS: Record<string, {
  name: string;
  native: string;
  heroHeadline: string;
  heroSubheadline: string;
  opportunityTitle: string;
  opportunityDesc: string;
  mrpLabel: string;
  dpPriceLabel: string;
  distributionLabel: string;
  weeklyPayoutLabel: string;
  yesLabel: string;
  packagesTitle: string;
  packagesDesc: string;
  binaryIncome: string;
  bonusesTitle: string;
  directSponsor: string;
  selfRepurchase: string;
  directSponsorBonus: string;
  royaltyIncome: string;
  termsTitle: string;
  kycDocRequirement: string;
  mandatoryDirects: string;
  payoutDeductions: string;
  closingSchedule: string;
  volumeCarryForward: string;
  joinNow: string;
  viewTree: string;
}> = {
  en: {
    name: 'English',
    native: 'English (Default)',
    heroHeadline: 'Official Business Opportunity & Commission Plan',
    heroSubheadline: 'Empowering health, wellness, and financial freedom through high-margin Ayurvedic formulations and transparent binary matching rewards.',
    opportunityTitle: 'JIVANTA WELLNESS OPPORTUNITY',
    opportunityDesc: 'A revolutionary compensation model designed for long-term residual growth and massive reward recognition.',
    mrpLabel: 'MRP',
    dpPriceLabel: 'DP PRICE',
    distributionLabel: 'DISTRIBUTION',
    weeklyPayoutLabel: 'WEEKLY PAYOUT',
    yesLabel: 'Yes',
    packagesTitle: 'Package & Binary Slabs',
    packagesDesc: 'Choose your entry volume to unlock up to 14% matching binary commission.',
    binaryIncome: 'Binary Income',
    bonusesTitle: 'Direct & Team Bonuses',
    directSponsor: 'Direct Sponsor Sales Commission: 9%',
    selfRepurchase: 'Self Re-purchase Bonus: 9%',
    directSponsorBonus: 'Direct Sponsor Bonus: 10% (On Binary Payout only)',
    royaltyIncome: 'Royalty Income: 1% to 3%',
    termsTitle: 'Terms & Regulations',
    kycDocRequirement: 'KYC Documents: Aadhaar Card & PAN Card Required',
    mandatoryDirects: 'Mandatory Directs: 1 Left & 1 Right Direct Sponsor Required',
    payoutDeductions: 'Payout Deductions: TDS 2% + Admin Charge 5%',
    closingSchedule: 'Closing Schedule: Weekly Closing System',
    volumeCarryForward: 'Volume Carry Forward: Lifetime Carry Forward',
    joinNow: 'Register & Activate Account',
    viewTree: 'Explore Binary Tree'
  },
  hi: {
    name: 'Hindi',
    native: 'हिन्दी (Hindi)',
    heroHeadline: 'आधिकारिक व्यवसाय अवसर एवं कमीशन योजना',
    heroSubheadline: 'उच्च-मार्जिन आयुर्वेदिक फॉर्मूलेशन और पारदर्शी बाइनरी मैचिंग रिवार्ड्स के माध्यम से स्वास्थ्य, कल्याण और वित्तीय स्वतंत्रता।',
    opportunityTitle: 'जीवंता वेलनेस अवसर',
    opportunityDesc: 'दीर्घकालिक निरंतर आय और विशाल रिवार्ड्स के लिए डिज़ाइन किया गया क्रांतिकारी बिज़नेस प्लान।',
    mrpLabel: 'एमआरपी (MRP)',
    dpPriceLabel: 'डीपी मूल्य (DP Price)',
    distributionLabel: 'वितरण मार्जिन (Distribution)',
    weeklyPayoutLabel: 'साप्ताहिक भुगतान (Weekly Payout)',
    yesLabel: 'हाँ (Yes)',
    packagesTitle: 'पैकेज एवं बाइनरी स्लैब',
    packagesDesc: '14% तक मैचिंग बाइनरी आय प्राप्त करने के लिए अपना पैकेज चुनें।',
    binaryIncome: 'बाइनरी इनकम',
    bonusesTitle: 'डायरेक्ट एवं टीम बोनस',
    directSponsor: 'डायरेक्ट स्पॉन्सर सेल्स कमीशन: 9%',
    selfRepurchase: 'सेल्फ री-परचेस बोनस: 9%',
    directSponsorBonus: 'डायरेक्ट स्पॉन्सर बोनस: 10% (केवल बाइनरी पेआउट पर)',
    royaltyIncome: 'रॉयल्टी इनकम: 1% से 3%',
    termsTitle: 'नियम एवं शर्तें',
    kycDocRequirement: 'केवाईसी दस्तावेज़: आधार कार्ड और पैन कार्ड अनिवार्य',
    mandatoryDirects: 'अनिवार्य डायरेक्ट्स: 1 लेफ्ट और 1 राइट डायरेक्ट स्पॉन्सर अनिवार्य',
    payoutDeductions: 'पेआउट कटौती: टीडीएस 2% + एडमिन चार्ज 5%',
    closingSchedule: 'क्लोजिंग शेड्यूल: साप्ताहिक क्लोजिंग सिस्टम',
    volumeCarryForward: 'वॉल्यूम कैरी फॉरवर्ड: लाइफटाइम कैरी फॉरवर्ड',
    joinNow: 'अभी रजिस्टर करें',
    viewTree: 'बाइनरी ट्री देखें'
  },
  bn: {
    name: 'Bengali',
    native: 'বাংলা (Bengali)',
    heroHeadline: 'অফিসিয়াল ব্যবসায়িক সুযোগ ও কমিশন পরিকল্পনা',
    heroSubheadline: 'উচ্চ মার্জিন আয়ুর্বেদিক ফর্মুলেশন ও স্বচ্ছ বাইনারি ম্যাচিং রিওয়ার্ডের মাধ্যমে স্বাস্থ্য ও আর্থিক স্বাধীনতা।',
    opportunityTitle: 'জীবন্ত ওয়েলনেস সুযোগ',
    opportunityDesc: 'দীর্ঘমেয়াদী আর্থিক স্বচ্ছলতা ও বিলাসবহুল পুরস্কারের সেরা সুযোগ।',
    mrpLabel: 'এমআরপি (MRP)',
    dpPriceLabel: 'ডিপি মূল্য (DP)',
    distributionLabel: 'বিতরণ (Distribution)',
    weeklyPayoutLabel: 'সাপ্তাহিক পেআউট',
    yesLabel: 'হ্যাঁ (Yes)',
    packagesTitle: 'প্যাকেজ ও বাইনারি স্ল্যাব',
    packagesDesc: 'সর্বোচ্চ ১৪% বাইনারি কমিশন অর্জনের সুযোগ।',
    binaryIncome: 'বাইনারি ইনকাম',
    bonusesTitle: 'ডিরেক্ট ও টিম বোনাস',
    directSponsor: 'ডিরেক্ট স্পনসর সেলস কমিশন: ৯%',
    selfRepurchase: 'সেলফ রি-পারচেস বোনাস: ৯%',
    directSponsorBonus: 'ডিরেক্ট স্পনসর বোনাস: ১০% (কেবল বাইনারি পেআউটে)',
    royaltyIncome: 'রয়্যালটি ইনকাম: ১% থেকে ৩%',
    termsTitle: 'নিয়ম ও শর্তাবলী',
    kycDocRequirement: 'কেওয়াইসি নথিপত্র: আধার কার্ড ও প্যান কার্ড বাধ্যতামূলক',
    mandatoryDirects: 'বাধ্যতামূলক ডিরেক্ট: ১ লেফট এবং ১ রাইট স্পনসর আবশ্যক',
    payoutDeductions: 'পেআউট কর্তন: টিডিএস ২% + অ্যাডমিন চার্জ ৫%',
    closingSchedule: 'ক্লোজিং সময়সূচি: সাপ্তাহিক ক্লোজিং সিস্টেম',
    volumeCarryForward: 'ভলিউম ক্যারি ফরোয়ার্ড: আজীবন ক্যারি ফরোয়ার্ড',
    joinNow: 'নিবন্ধন করুন',
    viewTree: 'বাইনারি ট্রি দেখুন'
  },
  mr: {
    name: 'Marathi',
    native: 'मराठी (Marathi)',
    heroHeadline: 'अधिकृत व्यवसाय संधी आणि कमिशन प्लॅन',
    heroSubheadline: 'उत्कृष्ट आयुर्वेदिक उत्पादने आणि पारदर्शक बायनरी मॅचिंग उत्पन्नासह आर्थिक प्रगती.',
    opportunityTitle: 'जिवंता वेलनेस व्यवसाय संधी',
    opportunityDesc: 'दीर्घकालीन उत्पन्नासाठी आणि कार/बाईक/फ्लॅट फंडांसाठी खास डिझाइन केलेला प्लॅन.',
    mrpLabel: 'एमआरपी',
    dpPriceLabel: 'डीपी किंमत',
    distributionLabel: 'वितरण',
    weeklyPayoutLabel: 'साप्ताहिक पेआउट',
    yesLabel: 'होय',
    packagesTitle: 'पॅकेज आणि बायनरी स्लॅब',
    packagesDesc: '14% पर्यंत बायनरी मॅचिंग इन्कम मिळवण्यासाठी पॅकेज निवडा.',
    binaryIncome: 'बायनरी इन्कम',
    bonusesTitle: 'डायरेक्ट आणि टीम बोनस',
    directSponsor: 'डायरेक्ट स्पॉन्सर विक्री कमिशन: 9%',
    selfRepurchase: 'सेल्फ री-परचेस बोनस: 9%',
    directSponsorBonus: 'डायरेक्ट स्पॉन्सर बोनस: 10% (फक्त बायनरी पेआउटवर)',
    royaltyIncome: 'रॉयल्टी इन्कम: 1% ते 3%',
    termsTitle: 'नियम व अटी',
    kycDocRequirement: 'केवायसी कागदपत्रे: आधार कार्ड आणि पॅन कार्ड आवश्यक',
    mandatoryDirects: 'अनिवार्य डायरेक्ट्स: 1 डावा आणि 1 उजवा डायरेक्ट आवश्यक',
    payoutDeductions: 'पेआउट वजावट: टीडीएस 2% + ॲडमिन फी 5%',
    closingSchedule: 'क्लोजिंग: साप्ताहिक क्लोजिंग सिस्टीम',
    volumeCarryForward: 'व्हॉल्यूम कॅरी फॉरवर्ड: लाइफटाईम कॅरी फॉरवर्ड',
    joinNow: 'नोंदणी करा',
    viewTree: 'बायनरी ट्री पहा'
  },
  te: {
    name: 'Telugu',
    native: 'తెలుగు (Telugu)',
    heroHeadline: 'అధికారిక వ్యాపార అవకాశం & కమిషన్ ప్లాన్',
    heroSubheadline: 'ఆరోగ్యం, శ్రేయస్సు మరియు ఆర్థిక స్వేచ్ఛ కోసం ఉత్తమ బైనరీ మ్యాచింగ్ వ్యాపార అవకాశం.',
    opportunityTitle: 'జీవంతా వెల్నెస్ అవకాశం',
    opportunityDesc: 'సుదీర్ఘమైన ఆర్థిక ప్రయోజనాలు మరియు అవార్డుల కోసం ప్రత్యేక ప్రణాళిక.',
    mrpLabel: 'MRP',
    dpPriceLabel: 'DP ధర',
    distributionLabel: 'పంపిణీ (డిస్ట్రిబ్యూషన్)',
    weeklyPayoutLabel: 'వారపు చెల్లింపు (వీక్లీ పేఅవుట్)',
    yesLabel: 'అవును',
    packagesTitle: 'ప్యాకేజీ & బైనరీ స్లాబ్‌లు',
    packagesDesc: '14% బైనరీ ఆదాయం కోసం సరైన ప్యాకేజీని ఎంచుకోండి.',
    binaryIncome: 'బైనరీ ఆదాయం',
    bonusesTitle: 'డైరెక్ట్ & టీమ్ బోనస్‌లు',
    directSponsor: 'డైరెక్ట్ స్పాన్సర్ సేల్స్ కమిషన్: 9%',
    selfRepurchase: 'సెల్ఫ్ రీ-పర్చేస్ బోనస్: 9%',
    directSponsorBonus: 'డైరెక్ట్ స్పాన్సర్ బోనస్: 10%',
    royaltyIncome: 'రాయల్టీ ఆదాయం: 1% నుండి 3%',
    termsTitle: 'నిబంధనలు మరియు షరతులు',
    kycDocRequirement: 'KYC డాక్యుమెంట్లు: ఆధార్ & పాన్ కార్డ్ తప్పనిసరి',
    mandatoryDirects: 'తప్పనిసరి డైరెక్ట్స్: 1 లెఫ్ట్ & 1 రైట్ స్పాన్సర్ అవసరం',
    payoutDeductions: 'తగ్గింపులు: TDS 2% + అడ్మిన్ ఛార్జ్ 5%',
    closingSchedule: 'ముగింపు షెడ్యూల్: వీక్లీ క్లోజింగ్ సిస్టమ్',
    volumeCarryForward: 'వాల్యూమ్ క్యారీ ఫార్వర్డ్: లైఫ్‌టైమ్ క్యారీ ఫార్వర్డ్',
    joinNow: 'నమోదు చేసుకోండి',
    viewTree: 'బైనరీ ట్రీని చూడండి'
  },
  ta: {
    name: 'Tamil',
    native: 'தமிழ் (Tamil)',
    heroHeadline: 'அதிகாரப்பூர்வ வணிக வாய்ப்பு & கமிஷன் திட்டம்',
    heroSubheadline: 'ஆரோக்கியம் மற்றும் நிதி சுதந்திரத்திற்கான சிறந்த பைனரி மேட்சிங் வாய்ப்பு.',
    opportunityTitle: 'ஜீவந்தா வெல்னஸ் வாய்ப்பு',
    opportunityDesc: 'நிரந்தர வருமானம் மற்றும் பரிசுகளுக்கான அதிகாரப்பூர்வ திட்டம்.',
    mrpLabel: 'MRP',
    dpPriceLabel: 'DP விலை',
    distributionLabel: 'விநியோகம்',
    weeklyPayoutLabel: 'வாராந்திர கொடுப்பனவு',
    yesLabel: 'ஆம்',
    packagesTitle: 'தொகுப்பு & பைனரி அடுக்குகள்',
    packagesDesc: '14% வரை பைனரி வருமானம் பெற தொகுப்பை தேர்ந்தெடுக்கவும்.',
    binaryIncome: 'பைனரி வருமானம்',
    bonusesTitle: 'நேரடி & குழு போனஸ்கள்',
    directSponsor: 'நேரடி ஸ்பான்சர் விற்பனை கமிஷன்: 9%',
    selfRepurchase: 'சுய மறு கொள்முதல் போனஸ்: 9%',
    directSponsorBonus: 'நேரடி ஸ்பான்சர் போனஸ்: 10%',
    royaltyIncome: 'ராயல்டி வருமானம்: 1% முதல் 3%',
    termsTitle: 'விதிமுறைகள் & ஒழுங்குமுறைகள்',
    kycDocRequirement: 'KYC ஆவணங்கள்: ஆதார் அட்டை & பான் அட்டை கட்டாயம்',
    mandatoryDirects: 'கட்டாய நேரடிகள்: 1 இடது & 1 வலது நேரடி தேவை',
    payoutDeductions: 'கழிவுகள்: TDS 2% + நிர்வாகக் கட்டணம் 5%',
    closingSchedule: 'மூடல் அட்டவணை: வாராந்திர மூடல் அமைப்பு',
    volumeCarryForward: 'தொகுதி முன்னோக்கி: வாழ்நாள் முன்னோக்கி',
    joinNow: 'பதிவு செய்யுங்கள்',
    viewTree: 'பைனரி மரத்தைக் காண்க'
  },
  gu: {
    name: 'Gujarati',
    native: 'ગુજરાતી (Gujarati)',
    heroHeadline: 'સત્તાવાર વ્યાપાર તક અને કમિશન યોજના',
    heroSubheadline: 'ઉચ્ચ માર્જિન આયુર્વેદિક ઉત્પાદનો અને પારદર્શક બાઈનરી મેચિંગ રિવોર્ડ્સ સાથે આર્થિક સમૃદ્ધિ.',
    opportunityTitle: 'જીવંતા વેલનેસ તક',
    opportunityDesc: 'લાંબા ગાળાની સ્થિર આવક અને વિશાળ પુરસ્કારો માટે ઉત્તમ બિઝનેસ તક.',
    mrpLabel: 'MRP',
    dpPriceLabel: 'DP કિંમત',
    distributionLabel: 'વિતરણ',
    weeklyPayoutLabel: 'સાપ્તાહિક પેઆઉટ',
    yesLabel: 'હા',
    packagesTitle: 'પેકેજ અને બાઈનરી સ્લેબ',
    packagesDesc: '14% સુધીની બાઈનરી આવક મેળવવા માટે પેકેજ પસંદ કરો.',
    binaryIncome: 'બાઈનરી આવક',
    bonusesTitle: 'ડાયરેક્ટ અને ટીમ બોનસ',
    directSponsor: 'ડાયરેક્ટ સ્પોન્સર વેચાણ કમિશન: 9%',
    selfRepurchase: 'સેલ્ફ રી-પરચેસ બોનસ: 9%',
    directSponsorBonus: 'ડાયરેક્ટ સ્પોન્સર બોનસ: 10%',
    royaltyIncome: 'રોયલ્ટી આવક: 1% થી 3%',
    termsTitle: 'નિયમો અને શરતો',
    kycDocRequirement: 'KYC દસ્તાવેજો: આધાર કાર્ડ અને પાન કાર્ડ ફરજિયાત',
    mandatoryDirects: 'ફરજિયાત ડાયરેક્ટ્સ: 1 લેફ્ટ અને 1 રાઈટ ડાયરેક્ટ જરૂરી',
    payoutDeductions: 'કપાત: TDS 2% + એડમિન ચાર્જ 5%',
    closingSchedule: 'ક્લોઝિંગ: સાપ્તાહિક ક્લોઝિંગ સિસ્ટમ',
    volumeCarryForward: 'વોલ્યુમ કેરી ફોરવર્ડ: આજીવન કેરી ફોરવર્ડ',
    joinNow: 'નોંધણી કરો',
    viewTree: 'બાઈનરી ટ્રી જુઓ'
  },
  ur: {
    name: 'Urdu',
    native: 'اُردُو (Urdu)',
    heroHeadline: 'سرکاری کاروباری موقع اور کمیشن پلان',
    heroSubheadline: 'آیورویدک صحت اور شفاف بائنری میچنگ مراعات کے ذریعے مالی خودمختاری۔',
    opportunityTitle: 'جیوانتا ویلنس موقع',
    opportunityDesc: 'طویل مدتی آمدنی اور بڑے انعامات کے لیے انقلابی بزنس ماڈل۔',
    mrpLabel: 'ایم آر پی',
    dpPriceLabel: 'ڈی پی قیمت',
    distributionLabel: 'تقسیم',
    weeklyPayoutLabel: 'ہفتہ وار ادائیگی',
    yesLabel: 'ہاں',
    packagesTitle: 'پیکجز اور بائنری سلیب',
    packagesDesc: '14 فیصد تک بائنری آمدنی حاصل کرنے کے لیے پیکیج منتخب کریں۔',
    binaryIncome: 'بائنری انکم',
    bonusesTitle: 'براہ راست اور ٹیم بونس',
    directSponsor: 'ڈائریکٹ اسپانسر سیلز کمیشن: 9%',
    selfRepurchase: 'سیلف ری پرچیز بونس: 9%',
    directSponsorBonus: 'ڈائریکٹ اسپانسر بونس: 10%',
    royaltyIncome: 'رائلٹی انکم: 1% سے 3%',
    termsTitle: 'شرائط و ضوابط',
    kycDocRequirement: 'کے وائی سی دستاویزات: آدھار کارڈ اور پین کارڈ لازمی',
    mandatoryDirects: 'لازمی ڈائریکٹس: 1 لیفٹ اور 1 رائٹ ڈائریکٹ اسپانسر ضروری',
    payoutDeductions: 'کٹوتیاں: ٹی ڈی ایس 2% + ایڈمن چارج 5%',
    closingSchedule: 'کلوزنگ شیڈول: ہفتہ وار کلوزنگ سسٹم',
    volumeCarryForward: 'والیوم کیری فارورڈ: لائف ٹائم کیری فارورڈ',
    joinNow: 'رجسٹر کریں',
    viewTree: 'بائنری درخت دیکھیں'
  },
  kn: {
    name: 'Kannada',
    native: 'ಕನ್ನಡ (Kannada)',
    heroHeadline: 'ಅಧಿಕೃತ ವ್ಯಾಪಾರ ಅವಕಾಶ ಮತ್ತು ಕಮಿಷನ್ ಯೋಜನೆ',
    heroSubheadline: 'ಆಯುರ್ವೇದ ಆರೋಗ್ಯ ಉತ್ಪನ್ನಗಳು ಮತ್ತು ಪಾರದರ್ಶಕ ಬೈನರಿ ಮ್ಯಾಚಿಂಗ್ ಆದಾಯದೊಂದಿಗೆ ಆರ್ಥಿಕ ಬೆಳವಣಿಗೆ.',
    opportunityTitle: 'ಜೀವಂತ ವೆಲ್ನೆಸ್ ಅವಕಾಶ',
    opportunityDesc: 'ಶಾಶ್ವತ ಆದಾಯ ಮತ್ತು ಐಷಾರಾಮಿ ಬಹುಮಾನಗಳಿಗಾಗಿ ವಿಶಿಷ್ಟ ಯೋಜನೆ.',
    mrpLabel: 'ಎಂಆರ್‌ಪಿ (MRP)',
    dpPriceLabel: 'ಡಿಪಿ ಬೆಲೆ (DP)',
    distributionLabel: 'ವಿತರಣೆ',
    weeklyPayoutLabel: 'ವಾರದ ಪಾವತಿ',
    yesLabel: 'ಹೌದು',
    packagesTitle: 'ಪ್ಯಾಕೇಜ್ ಮತ್ತು ಬೈನರಿ ಸ್ಲ್ಯಾಬ್‌ಗಳು',
    packagesDesc: '14% ವರೆಗೆ ಬೈನರಿ ಆದಾಯ ಗಳಿಸಲು ಸೂಕ್ತ ಪ್ಯಾಕೇಜ್ ಆಯ್ಕೆಮಾಡಿ.',
    binaryIncome: 'ಬೈನರಿ ಆದಾಯ',
    bonusesTitle: 'ಡೈರೆಕ್ಟ್ & ಟೀಮ್ ಬೋನಸ್‌ಗಳು',
    directSponsor: 'ಡೈರೆಕ್ಟ್ ಸ್ಪಾನ್ಸರ್ ಮಾರಾಟ ಕಮಿಷನ್: 9%',
    selfRepurchase: 'ಸೆಲ್ಫ್ ಮರು-ಖರೀದಿ ಬೋನಸ್: 9%',
    directSponsorBonus: 'ಡೈರೆಕ್ಟ್ ಸ್ಪಾನ್ಸರ್ ಬೋನಸ್: 10%',
    royaltyIncome: 'ರಾಯಧನ ಆದಾಯ: 1% ರಿಂದ 3%',
    termsTitle: 'ನಿಯಮಗಳು ಮತ್ತು ನಿಬಂಧನೆಗಳು',
    kycDocRequirement: 'ಕೆವೈಸಿ ದಾಖಲೆಗಳು: ಆಧಾರ್ ಕಾರ್ಡ್ & ಪ್ಯಾನ್ ಕಾರ್ಡ್ ಕಡ್ಡಾಯ',
    mandatoryDirects: 'ಕಡ್ಡಾಯ ಡೈರೆಕ್ಟ್ಸ್: 1 ಎಡ & 1 ಬಲ ಡೈರೆಕ್ಟ್ ಅಗತ್ಯ',
    payoutDeductions: 'ಕಡಿತಗಳು: ಟಿಡಿಎಸ್ 2% + ನಿರ್ವಾಹಕ ಶುಲ್ಕ 5%',
    closingSchedule: 'ಕ್ಲೋಸಿಂಗ್ ವೇಳಾಪಟ್ಟಿ: ಸಾಪ್ತಾಹಿಕ ಕ್ಲೋಸಿಂಗ್ ಸಿಸ್ಟಮ್',
    volumeCarryForward: 'ವಾಲ್ಯೂಮ್ ಕ್ಯಾರಿ ಫಾರ್ವರ್ಡ್: ಲೈಫ್‌ಟೈಮ್ ಕ್ಯಾರಿ ಫಾರ್ವರ್ಡ್',
    joinNow: 'ನೋಂದಾಯಿಸಿ',
    viewTree: 'ಬೈನರಿ ಟ್ರೀ ವೀಕ್ಷಿಸಿ'
  },
  od: {
    name: 'Odia',
    native: 'ଓଡ଼ିଆ (Odia)',
    heroHeadline: 'ଅଫିସିଆଲ୍ ବ୍ୟବସାୟ ସୁଯୋଗ ଏବଂ କମିଶନ ଯୋଜନା',
    heroSubheadline: 'ସ୍ୱାସ୍ଥ୍ୟ, କଲ୍ୟାଣ ଏବଂ ଆର୍ଥିକ ସ୍ୱାଧୀନତା ପାଇଁ ଉତ୍ତମ ବାଇନାରୀ ମ୍ୟାଚିଂ ଯୋଜନା।',
    opportunityTitle: 'ଜୀବନ୍ତ ୱେଲନେସ୍ ସୁଯୋଗ',
    opportunityDesc: 'ଦୀର୍ଘକାଳୀନ ଆୟ ଏବଂ ପୁରସ୍କାର ପାଇଁ ଅଦ୍ୱିତୀୟ ସୁଯୋଗ।',
    mrpLabel: 'MRP',
    dpPriceLabel: 'DP ମୂଲ୍ୟ',
    distributionLabel: 'ବଣ୍ଟନ (Distribution)',
    weeklyPayoutLabel: 'ସାପ୍ତାହିକ ପେଆଉଟ୍',
    yesLabel: 'ହଁ',
    packagesTitle: 'ପ୍ୟାକେଜ୍ ଏବଂ ବାଇନାରୀ ସ୍ଲାବ୍',
    packagesDesc: '14% ପର୍ଯ୍ୟନ୍ତ ବାଇନାରୀ ଆୟ ପାଇଁ ପ୍ୟାକେଜ୍ ଚୟନ କରନ୍ତୁ।',
    binaryIncome: 'ବାଇନାରୀ ଆୟ',
    bonusesTitle: 'ଡାଇରେକ୍ଟ ଏବଂ ଟିମ୍ ବୋନସ୍',
    directSponsor: 'ଡାଇରେକ୍ଟ ସ୍ପନ୍ସର ବିକ୍ରୟ କମିଶନ: 9%',
    selfRepurchase: 'ସ୍ୱୟଂ ପୁନଃକ୍ରୟ ବୋନସ୍: 9%',
    directSponsorBonus: 'ଡାଇରେକ୍ଟ ସ୍ପନ୍ସର ବୋନସ୍: 10%',
    royaltyIncome: 'ରୟାଲଟି ଆୟ: 1% ରୁ 3%',
    termsTitle: 'ନିୟମାବଳୀ ଏବଂ ସର୍ତ୍ତାବଳୀ',
    kycDocRequirement: 'KYC ଦସ୍ତାବିଜ୍: ଆଧାର କାର୍ଡ ଓ ପାନ୍ କାର୍ଡ ବାଧ୍ୟତାମୂଳକ',
    mandatoryDirects: 'ବାଧ୍ୟତାମୂଳକ ଡାଇରେକ୍ଟ୍ସ: 1 ବାମ ଏବଂ 1 ଡାହାଣ ସ୍ପନ୍ସର ଆବଶ୍ୟକ',
    payoutDeductions: 'କାଟ: TDS 2% + ଆଡମିନ୍ ଚାର୍ଜ 5%',
    closingSchedule: 'କ୍ଲୋଜିଂ କାର୍ଯ୍ୟସୂଚୀ: ସାପ୍ତାହିକ କ୍ଲୋଜିଂ ସିଷ୍ଟମ୍',
    volumeCarryForward: 'ଭଲ୍ୟୁମ୍ କ୍ୟାରି ଫରୱାର୍ଡ: ଆଜୀବନ କ୍ୟାରି ଫରୱାର୍ଡ',
    joinNow: 'ପଞ୍ଜୀକରଣ କରନ୍ତୁ',
    viewTree: 'ବାଇନାରୀ ଟ୍ରି ଦେଖନ୍ତୁ'
  }
};
