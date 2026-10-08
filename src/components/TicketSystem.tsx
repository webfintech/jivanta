import React, { useState } from 'react';
import { 
  LifeBuoy, 
  Plus, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Search,
  User,
  ShieldCheck
} from 'lucide-react';
import { SupportTicket, Member } from '../types/mlm';

interface TicketSystemProps {
  tickets: SupportTicket[];
  currentMember: Member;
  isAdmin: boolean;
  onAddTicket: (ticket: Partial<SupportTicket>, initialMessage: string) => void;
  onAddReply: (ticketId: string, message: string, senderType: 'member' | 'support') => void;
  onUpdateTicketStatus: (ticketId: string, status: SupportTicket['status']) => void;
}

export const TicketSystem: React.FC<TicketSystemProps> = ({
  tickets,
  currentMember,
  isAdmin,
  onAddTicket,
  onAddReply,
  onUpdateTicketStatus
}) => {
  const [selectedTicketId, setSelectedTicketId] = useState<string>(tickets[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showNewModal, setShowNewModal] = useState(false);

  // New ticket state
  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState<SupportTicket['category']>('Payout & Commission');
  const [newPriority, setNewPriority] = useState<SupportTicket['priority']>('medium');
  const [newMessage, setNewMessage] = useState('');

  // Reply message state
  const [replyText, setReplyText] = useState('');

  // Filtered tickets
  const relevantTickets = isAdmin
    ? tickets
    : tickets.filter((t) => t.memberId === currentMember.id);

  const filteredTickets = relevantTickets.filter((t) => {
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesSearch = 
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.memberName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const activeTicket = tickets.find((t) => t.id === selectedTicketId) || filteredTickets[0];

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject || !newMessage) return;

    onAddTicket(
      {
        memberId: currentMember.id,
        memberName: currentMember.fullName,
        subject: newSubject,
        category: newCategory,
        priority: newPriority,
        status: 'open'
      },
      newMessage
    );

    setNewSubject('');
    setNewMessage('');
    setShowNewModal(false);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTicket) return;

    onAddReply(
      activeTicket.id,
      replyText,
      isAdmin ? 'support' : 'member'
    );
    setReplyText('');
  };

  return (
    <div className="w-full bg-slate-950 text-slate-100 min-h-screen p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <LifeBuoy className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Dedicated Support & Help Desk</h2>
            <p className="text-xs text-slate-400">Priority resolutions for payouts, KYC verification, and binary genealogy</p>
          </div>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Ticket</span>
        </button>
      </div>

      {/* Two Column Ticket Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
        
        {/* Left Column: Tickets Queue List */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 flex flex-col">
          
          {/* Search & Status Filter */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search ticket number, subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto text-xs pb-1">
              {['all', 'open', 'answered', 'closed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                    statusFilter === status
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Ticket Items */}
          <div className="space-y-2 overflow-y-auto flex-1 pr-1">
            {filteredTickets.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No support tickets found.
              </div>
            ) : (
              filteredTickets.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicketId(t.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    (activeTicket && activeTicket.id === t.id)
                      ? 'bg-slate-950 border-amber-500/60 ring-1 ring-amber-500/30'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-mono text-amber-400 font-bold">{t.ticketNumber}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono uppercase font-bold ${
                      t.status === 'open' 
                        ? 'bg-amber-950 text-amber-400 border border-amber-800' 
                        : t.status === 'answered'
                          ? 'bg-blue-950 text-blue-400 border border-blue-800'
                          : 'bg-slate-800 text-slate-400'
                    }`}>
                      {t.status}
                    </span>
                  </div>

                  <div className="font-bold text-xs text-white truncate">{t.subject}</div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                    <span>{t.category}</span>
                    <span>{t.createdAt.split(' ')[0]}</span>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>

        {/* Right Column: Active Ticket Thread */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          
          {activeTicket ? (
            <div className="flex flex-col h-full space-y-5">
              
              {/* Ticket Details Bar */}
              <div className="pb-4 border-b border-slate-800 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-amber-400 font-bold text-xs">{activeTicket.ticketNumber}</span>
                    <span className="text-[10px] text-slate-400">· {activeTicket.category}</span>
                    <span className="text-[10px] text-slate-400">· Priority: {activeTicket.priority.toUpperCase()}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">{activeTicket.subject}</h3>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Raised by: <span className="text-slate-200 font-semibold">{activeTicket.memberName}</span> ({activeTicket.memberId})
                  </div>
                </div>

                {/* Status action toggle */}
                <div className="flex items-center gap-1.5">
                  {activeTicket.status !== 'closed' ? (
                    <button
                      onClick={() => onUpdateTicketStatus(activeTicket.id, 'closed')}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                    >
                      Mark Resolved
                    </button>
                  ) : (
                    <button
                      onClick={() => onUpdateTicketStatus(activeTicket.id, 'open')}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold"
                    >
                      Reopen
                    </button>
                  )}
                </div>
              </div>

              {/* Thread Messages */}
              <div className="flex-1 overflow-y-auto space-y-3.5 pr-2 max-h-[380px]">
                {activeTicket.replies.map((rep) => {
                  const isStaff = rep.sender === 'support';
                  return (
                    <div
                      key={rep.id}
                      className={`p-4 rounded-2xl text-xs space-y-1.5 ${
                        isStaff
                          ? 'bg-blue-950/40 border border-blue-800/40 ml-4'
                          : 'bg-slate-950 border border-slate-800 mr-4'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`font-bold flex items-center gap-1.5 ${isStaff ? 'text-blue-300' : 'text-amber-400'}`}>
                          {isStaff ? <ShieldCheck className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                          <span>{rep.senderName}</span>
                          {isStaff && <span className="text-[9px] px-1 py-0.2 rounded bg-blue-900/60 text-blue-200 font-mono">STAFF</span>}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">{rep.timestamp}</span>
                      </div>
                      <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">{rep.message}</p>
                    </div>
                  );
                })}
              </div>

              {/* Reply Input Box */}
              <form onSubmit={handleSendReply} className="pt-3 border-t border-slate-800 flex gap-2">
                <input
                  type="text"
                  placeholder={isAdmin ? "Type official support answer..." : "Type reply to compliance team..."}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Reply</span>
                </button>
              </form>

            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500 text-xs">
              Select a ticket to view conversation details.
            </div>
          )}

        </div>

      </div>

      {/* New Ticket Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Create Support Ticket</h3>
              <button
                onClick={() => setShowNewModal(false)}
                className="text-slate-400 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Weekly Binary Matching payout verification"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  >
                    <option value="Payout & Commission">Payout & Commission</option>
                    <option value="Binary Tree & Placement">Binary Tree & Placement</option>
                    <option value="KYC Verification">KYC Verification</option>
                    <option value="E-Wallet Transfer">E-Wallet Transfer</option>
                    <option value="Product Delivery">Product Delivery</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Message Description</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your issue with transaction IDs, downline member codes, or document references..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all"
              >
                Submit Ticket
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
