import React, { useState } from 'react';
import { 
  GitFork, 
  Search, 
  UserPlus, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  ChevronRight, 
  Layers,
  ArrowDown
} from 'lucide-react';
import { Member, BinaryPosition } from '../types/mlm';
import { getPackageById } from '../utils/binaryEngine';

interface BinaryTreeViewProps {
  members: Member[];
  rootMemberId: string;
  onSelectRootMember: (memberId: string) => void;
  onAddMemberAtSlot: (parentId: string, position: BinaryPosition) => void;
}

export const BinaryTreeView: React.FC<BinaryTreeViewProps> = ({
  members,
  rootMemberId,
  onSelectRootMember,
  onAddMemberAtSlot
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNodeDetails, setSelectedNodeDetails] = useState<Member | null>(null);

  // Map members by ID and parent
  const memberMap: Record<string, Member> = {};
  members.forEach((m) => {
    memberMap[m.id] = m;
  });

  const rootMember = memberMap[rootMemberId] || members[0];

  // Helper to find child of a parent in specific leg position
  const getChild = (parentId: string, position: BinaryPosition): Member | undefined => {
    return members.find((m) => m.parentId === parentId && m.position === position);
  };

  // Search filter
  const searchResults = searchQuery
    ? members.filter(
        (m) =>
          m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.max(0.6, Math.min(1.4, Number((prev + delta).toFixed(1)))));
  };

  // Node Component for Visual Tree
  const renderTreeNode = (member: Member | undefined, parentId: string, position: BinaryPosition, level: number) => {
    if (!member) {
      // Empty placement slot
      return (
        <div className="flex flex-col items-center">
          <div className="w-px h-6 bg-slate-800" />
          <button
            onClick={() => onAddMemberAtSlot(parentId, position)}
            className="w-36 h-28 rounded-xl border-2 border-dashed border-slate-700 hover:border-amber-500 bg-slate-900/40 hover:bg-amber-500/10 flex flex-col items-center justify-center gap-1.5 transition-all text-slate-400 hover:text-amber-300 p-2 group"
          >
            <div className="w-7 h-7 rounded-full bg-slate-800 group-hover:bg-amber-500/20 flex items-center justify-center text-slate-400 group-hover:text-amber-400">
              <UserPlus className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              + Empty {position}
            </span>
            <span className="text-[9px] text-slate-500 font-mono">Place Member</span>
          </button>
        </div>
      );
    }

    const pkg = getPackageById(member.packageId);
    const isQual = member.directLeftCount >= 1 && member.directRightCount >= 1;
    const isRoot = member.id === rootMember.id;

    // Recursive children
    const leftChild = getChild(member.id, 'left');
    const rightChild = getChild(member.id, 'right');

    return (
      <div className="flex flex-col items-center">
        {!isRoot && <div className="w-px h-6 bg-slate-700" />}

        {/* Member Node Box */}
        <div 
          onClick={() => setSelectedNodeDetails(member)}
          className={`w-44 rounded-xl border p-3 cursor-pointer transition-all hover:scale-105 shadow-lg relative ${
            isRoot
              ? 'bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-900 border-amber-500 shadow-amber-500/10 ring-2 ring-amber-500/30'
              : 'bg-slate-900 border-slate-700/80 hover:border-slate-500'
          }`}
        >
          {/* Position Tag */}
          {member.position && (
            <span className={`absolute -top-2.5 right-3 px-1.5 py-0.2 text-[9px] font-mono font-bold uppercase rounded ${
              member.position === 'left' ? 'bg-amber-500 text-slate-950' : 'bg-emerald-500 text-slate-950'
            }`}>
              {member.position}
            </span>
          )}

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-[11px] text-amber-400 font-mono shrink-0">
              {member.rankNumber}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-white truncate">{member.fullName}</div>
              <div className="text-[10px] font-mono text-slate-400 truncate">{member.id}</div>
            </div>
          </div>

          {/* Slabs & Qualification */}
          <div className="mt-2.5 pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-1 text-[10px]">
            <div>
              <span className="text-slate-500 block">Left Vol</span>
              <span className="font-mono text-amber-400 font-bold">{member.leftTotalPv.toLocaleString()}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block">Right Vol</span>
              <span className="font-mono text-emerald-400 font-bold">{member.rightTotalPv.toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between text-[10px] pt-1.5 border-t border-slate-800/80">
            <span className="text-slate-400 font-mono">{pkg.pv} PV ({(pkg.binaryRate * 100)}%)</span>
            {isQual ? (
              <span className="text-emerald-400 flex items-center gap-0.5" title="Qualified: 1 Left & 1 Right direct sponsor active">
                <CheckCircle2 className="w-3 h-3" />
                <span className="text-[9px]">Qual</span>
              </span>
            ) : (
              <span className="text-amber-400 flex items-center gap-0.5" title="Unqualified: Needs 1L & 1R direct sponsor">
                <AlertTriangle className="w-3 h-3" />
                <span className="text-[9px]">Pending</span>
              </span>
            )}
          </div>
        </div>

        {/* Tree Branching connectors (Only display up to level 4 to keep DOM crisp) */}
        {level < 3 && (
          <div className="flex flex-col items-center w-full">
            {/* Vertical connector down */}
            <div className="w-px h-6 bg-slate-700" />
            
            {/* Horizontal branch bar */}
            <div className="w-1/2 border-t-2 border-slate-700 relative">
              <div className="absolute -top-1 left-0 w-2 h-2 rounded-full bg-slate-600" />
              <div className="absolute -top-1 right-0 w-2 h-2 rounded-full bg-slate-600" />
            </div>

            {/* Left and Right children containers */}
            <div className="flex justify-between w-full gap-4 pt-1">
              {renderTreeNode(leftChild, member.id, 'left', level + 1)}
              {renderTreeNode(rightChild, member.id, 'right', level + 1)}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full bg-slate-950 text-slate-100 min-h-screen p-4 lg:p-6 space-y-6">
      
      {/* Top Controls Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        
        {/* Left: Current Focus Root */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <GitFork className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase font-semibold">Tree Focus Node:</div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>{rootMember.fullName}</span>
              <span className="font-mono text-amber-400 text-xs">({rootMember.id})</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {rootMember.rank}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Search Node */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search member to set as tree root..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />

          {/* Search Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-20 max-h-48 overflow-y-auto divide-y divide-slate-800">
              {searchResults.map((sm) => (
                <button
                  key={sm.id}
                  onClick={() => {
                    onSelectRootMember(sm.id);
                    setSearchQuery('');
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-white">{sm.fullName}</span>
                    <span className="text-slate-400 font-mono ml-2">({sm.id})</span>
                  </div>
                  <span className="text-amber-400 text-[10px]">{sm.rank}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Zoom & Reset */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleZoom(-0.1)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-slate-400 px-1">{Math.round(zoomLevel * 100)}%</span>
          <button
            onClick={() => handleZoom(0.1)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setZoomLevel(1);
              onSelectRootMember('JW-1001');
            }}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Reset to Top Root"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Leg Balance Meter Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div>
          <div className="text-xs font-semibold text-slate-400 uppercase">Left Team Power Volume</div>
          <div className="text-2xl font-black font-mono text-amber-400 mt-0.5">
            {rootMember.leftTotalPv.toLocaleString()} PV
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Carry: {rootMember.leftCarryForwardPv.toLocaleString()} PV · Directs: {rootMember.directLeftCount}
          </div>
        </div>

        <div className="space-y-1.5 text-center">
          <div className="text-xs font-bold text-slate-300">Matching Volume Potential</div>
          <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800 flex">
            <div 
              style={{ width: `${(rootMember.leftTotalPv / (rootMember.leftTotalPv + rootMember.rightTotalPv || 1)) * 100}%` }}
              className="bg-amber-500 h-full"
            />
            <div 
              style={{ width: `${(rootMember.rightTotalPv / (rootMember.leftTotalPv + rootMember.rightTotalPv || 1)) * 100}%` }}
              className="bg-emerald-500 h-full"
            />
          </div>
          <div className="text-[10px] font-mono text-slate-400">
            Matched: {Math.min(rootMember.leftTotalPv, rootMember.rightTotalPv).toLocaleString()} PV min
          </div>
        </div>

        <div className="md:text-right">
          <div className="text-xs font-semibold text-slate-400 uppercase">Right Team Power Volume</div>
          <div className="text-2xl font-black font-mono text-emerald-400 mt-0.5">
            {rootMember.rightTotalPv.toLocaleString()} PV
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Carry: {rootMember.rightCarryForwardPv.toLocaleString()} PV · Directs: {rootMember.directRightCount}
          </div>
        </div>
      </div>

      {/* Main Canvas with Interactive Tree */}
      <div className="relative rounded-3xl border border-slate-800 bg-slate-950/80 p-8 overflow-x-auto min-h-[520px] flex justify-center items-start">
        <div 
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
          className="transition-transform duration-200"
        >
          {renderTreeNode(rootMember, '', 'left', 0)}
        </div>
      </div>

      {/* Inspected Node Drawer / Modal */}
      {selectedNodeDetails && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">{selectedNodeDetails.fullName}</h3>
                <span className="text-xs font-mono text-amber-400">{selectedNodeDetails.id}</span>
              </div>
              <button
                onClick={() => setSelectedNodeDetails(null)}
                className="text-slate-400 hover:text-white text-xs font-semibold px-2 py-1 bg-slate-800 rounded"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Rank</span>
                <span className="font-bold text-amber-400">{selectedNodeDetails.rank}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Package Slab</span>
                <span className="font-bold text-emerald-400">Pack #{selectedNodeDetails.packageId} ({(getPackageById(selectedNodeDetails.packageId).binaryRate * 100)}%)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Left Leg Volume</span>
                <span className="font-mono text-white">{selectedNodeDetails.leftTotalPv.toLocaleString()} PV</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Right Leg Volume</span>
                <span className="font-mono text-white">{selectedNodeDetails.rightTotalPv.toLocaleString()} PV</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Sponsor ID:</span>
                <span className="font-mono text-white">{selectedNodeDetails.sponsorId || 'Top Placement'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Direct Left Sponsors:</span>
                <span className="font-mono text-white">{selectedNodeDetails.directLeftCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Direct Right Sponsors:</span>
                <span className="font-mono text-white">{selectedNodeDetails.directRightCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Qualification Status:</span>
                <span className={`font-bold ${
                  selectedNodeDetails.directLeftCount >= 1 && selectedNodeDetails.directRightCount >= 1
                    ? 'text-emerald-400'
                    : 'text-amber-400'
                }`}>
                  {selectedNodeDetails.directLeftCount >= 1 && selectedNodeDetails.directRightCount >= 1 ? 'Qualified (1L & 1R)' : 'Unqualified (Need 1L & 1R)'}
                </span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => {
                  onSelectRootMember(selectedNodeDetails.id);
                  setSelectedNodeDetails(null);
                }}
                className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <GitFork className="w-3.5 h-3.5" />
                <span>Set as Tree Root View</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
