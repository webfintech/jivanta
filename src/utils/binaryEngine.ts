import { Member, GlobalProjectConfig, BinaryClosingResult, WalletTransaction } from '../types/mlm';
import { PACKAGES, RANKS_MATRIX } from '../data/mockMlmData';

export function getPackageById(packageId: number) {
  return PACKAGES.find((p) => p.id === packageId) || PACKAGES[0];
}

export function exportToCsv(filename: string, rows: Record<string, any>[]) {
  if (!rows || !rows.length) return;
  const headers = Object.keys(rows[0]);
  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      headers
        .map((field) => {
          let val = row[field];
          if (val === null || val === undefined) val = '';
          const str = String(val).replace(/"/g, '""');
          return `"${str}"`;
        })
        .join(',')
    )
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Build node children map for quick tree hierarchy traversal
export function buildBinaryTreeHierarchy(members: Member[]) {
  const map: Record<string, { member: Member; left?: Member; right?: Member }> = {};
  
  members.forEach((m) => {
    map[m.id] = { member: m };
  });

  members.forEach((m) => {
    if (m.parentId && map[m.parentId]) {
      if (m.position === 'left') {
        map[m.parentId].left = m;
      } else if (m.position === 'right') {
        map[m.parentId].right = m;
      }
    }
  });

  return map;
}

// Recursive subtree PV calculation
export function calculateRecursiveSubtreeVolume(
  memberId: string,
  treeMap: Record<string, { member: Member; left?: Member; right?: Member }>
): { leftVolume: number; rightVolume: number; totalVolume: number; depth: number } {
  const node = treeMap[memberId];
  if (!node) return { leftVolume: 0, rightVolume: 0, totalVolume: 0, depth: 0 };

  const ownPv = getPackageById(node.member.packageId).pv;

  let leftVol = 0;
  let leftDepth = 0;
  if (node.left) {
    const leftRes = calculateRecursiveSubtreeVolume(node.left.id, treeMap);
    leftVol = getPackageById(node.left.packageId).pv + leftRes.totalVolume;
    leftDepth = 1 + leftRes.depth;
  }

  let rightVol = 0;
  let rightDepth = 0;
  if (node.right) {
    const rightRes = calculateRecursiveSubtreeVolume(node.right.id, treeMap);
    rightVol = getPackageById(node.right.packageId).pv + rightRes.totalVolume;
    rightDepth = 1 + rightRes.depth;
  }

  return {
    leftVolume: leftVol,
    rightVolume: rightVol,
    totalVolume: leftVol + rightVol,
    depth: Math.max(leftDepth, rightDepth)
  };
}

// Automated Commission Closing Engine
export function runWeeklyBinaryClosing(
  members: Member[],
  config: GlobalProjectConfig
): {
  updatedMembers: Member[];
  newTransactions: WalletTransaction[];
  resultSummary: BinaryClosingResult;
} {
  const batchId = `BATCH-${Date.now().toString().slice(-6)}`;
  const closingDate = new Date().toISOString().replace('T', ' ').slice(0, 19);

  let totalMatched = 0;
  let totalGross = 0;
  let totalTds = 0;
  let totalAdmin = 0;
  let totalNet = 0;
  let qualifiedCount = 0;

  const newTransactions: WalletTransaction[] = [];
  const payoutRecords: BinaryClosingResult['memberPayouts'] = [];

  // Pass 1: Binary matching income
  const intermediatePayouts: Record<string, { binaryIncome: number; matchedPv: number }> = {};

  const updatedMembers = members.map((member) => {
    const pkg = getPackageById(member.packageId);
    
    // Check qualification: Mandatory 1 Left Direct and 1 Right Direct sponsor
    const isQualified = member.directLeftCount >= 1 && member.directRightCount >= 1;
    
    const availableLeft = member.leftCarryForwardPv + (member.leftTotalPv > member.leftCarryForwardPv ? member.leftTotalPv - member.leftCarryForwardPv : 0);
    const availableRight = member.rightCarryForwardPv + (member.rightTotalPv > member.rightCarryForwardPv ? member.rightTotalPv - member.rightCarryForwardPv : 0);

    if (!isQualified || availableLeft <= 0 || availableRight <= 0) {
      // Not qualified or no dual volume: Lifetime carry-forward remains intact!
      return {
        ...member,
        isBinaryQualified: isQualified
      };
    }

    const matchedPv = Math.min(availableLeft, availableRight);
    const binaryRate = pkg.binaryRate; // 10%, 12%, or 14%
    const grossBinary = matchedPv * binaryRate * config.pvRateInRupees;

    const leftRemaining = availableLeft - matchedPv;
    const rightRemaining = availableRight - matchedPv;

    intermediatePayouts[member.id] = {
      binaryIncome: grossBinary,
      matchedPv
    };

    qualifiedCount++;
    totalMatched += matchedPv;

    return {
      ...member,
      leftCarryForwardPv: leftRemaining,
      rightCarryForwardPv: rightRemaining,
      isBinaryQualified: true
    };
  });

  // Pass 2: Compute Direct Sponsor Bonus (10% on direct sponsored members' binary payouts)
  // and apply TDS (2%) + Admin Charge (5%)
  const finalMembers = updatedMembers.map((member) => {
    const intermediate = intermediatePayouts[member.id];
    const binaryGross = intermediate ? intermediate.binaryIncome : 0;
    const matchedPv = intermediate ? intermediate.matchedPv : 0;

    // Calculate 10% sponsor bonus from personally sponsored downlines
    let sponsorBonusGross = 0;
    updatedMembers.forEach((downline) => {
      if (downline.sponsorId === member.id && intermediatePayouts[downline.id]) {
        sponsorBonusGross += (intermediatePayouts[downline.id].binaryIncome * (config.sponsorBinaryBonusPercentage / 100));
      }
    });

    const grossTotal = binaryGross + sponsorBonusGross;
    if (grossTotal <= 0) return member;

    // Deductions: TDS 2% + Admin 5%
    const tds = (grossTotal * config.tdsPercentage) / 100;
    const adminCharge = (grossTotal * config.adminChargePercentage) / 100;
    const netPayout = grossTotal - tds - adminCharge;

    totalGross += grossTotal;
    totalTds += tds;
    totalAdmin += adminCharge;
    totalNet += netPayout;

    // Generate Transactions
    if (binaryGross > 0) {
      const bTds = (binaryGross * config.tdsPercentage) / 100;
      const bAdmin = (binaryGross * config.adminChargePercentage) / 100;
      newTransactions.push({
        id: `TXN-BIN-${Date.now().toString().slice(-4)}-${member.id.replace('JW-', '')}`,
        memberId: member.id,
        memberName: member.fullName,
        type: 'binary_income',
        amount: binaryGross,
        tdsDeduction: bTds,
        adminCharge: bAdmin,
        netAmount: binaryGross - bTds - bAdmin,
        description: `Weekly Binary Matching: ${matchedPv} PV matched @ ${(getPackageById(member.packageId).binaryRate * 100)}% slab`,
        referenceId: `${batchId}-BIN-${member.id}`,
        date: closingDate,
        status: 'completed'
      });
    }

    if (sponsorBonusGross > 0) {
      const sTds = (sponsorBonusGross * config.tdsPercentage) / 100;
      const sAdmin = (sponsorBonusGross * config.adminChargePercentage) / 100;
      newTransactions.push({
        id: `TXN-SPN-${Date.now().toString().slice(-4)}-${member.id.replace('JW-', '')}`,
        memberId: member.id,
        memberName: member.fullName,
        type: 'sponsor_bonus',
        amount: sponsorBonusGross,
        tdsDeduction: sTds,
        adminCharge: sAdmin,
        netAmount: sponsorBonusGross - sTds - sAdmin,
        description: `10% Direct Sponsor Binary Match Bonus from downline team`,
        referenceId: `${batchId}-SPN-${member.id}`,
        date: closingDate,
        status: 'completed'
      });
    }

    payoutRecords.push({
      memberId: member.id,
      username: member.username,
      matchedPv,
      binaryIncome: binaryGross,
      sponsorBonus: sponsorBonusGross,
      grossTotal,
      tds,
      adminCharge,
      netPayout,
      leftCarryForward: member.leftCarryForwardPv,
      rightCarryForward: member.rightCarryForwardPv
    });

    return {
      ...member,
      walletBalance: member.walletBalance + netPayout
    };
  });

  return {
    updatedMembers: finalMembers,
    newTransactions,
    resultSummary: {
      payoutBatchId: batchId,
      closingDate,
      totalQualifiedMembers: qualifiedCount,
      totalBinaryVolumeMatched: totalMatched,
      totalGrossCommission: totalGross,
      totalTdsDeducted: totalTds,
      totalAdminChargeDeducted: totalAdmin,
      totalNetPayout: totalNet,
      memberPayouts: payoutRecords
    }
  };
}

// Calculate rank progression and rewards
export function getRankProgress(currentRankNumber: number, totalPvAccumulated: number) {
  const currentRank = RANKS_MATRIX.find((r) => r.rankNumber === currentRankNumber) || RANKS_MATRIX[0];
  const nextRank = RANKS_MATRIX.find((r) => r.rankNumber === currentRankNumber + 1);

  if (!nextRank) {
    return {
      currentRank,
      nextRank: null,
      progressPercentage: 100,
      pvNeeded: 0
    };
  }

  const progress = Math.min(100, Math.round((totalPvAccumulated / nextRank.requiredPv) * 100));
  const needed = Math.max(0, nextRank.requiredPv - totalPvAccumulated);

  return {
    currentRank,
    nextRank,
    progressPercentage: progress,
    pvNeeded: needed
  };
}
