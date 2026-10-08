import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  Calculator, 
  Sparkles, 
  Award, 
  Clock, 
  ShieldCheck, 
  Zap, 
  Gift, 
  Plane, 
  Car, 
  Home, 
  TrendingUp, 
  Check, 
  UserPlus, 
  FileText
} from 'lucide-react';
import { TRANSLATIONS, PACKAGES, RANKS_MATRIX } from '../data/mockMlmData';
import { Member } from '../types/mlm';

interface LandingPageProps {
  onRegisterMember: (newMemberData: Partial<Member>) => void;
  onNavigateToTree: () => void;
  onNavigateToPortal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onRegisterMember,
  onNavigateToTree,
  onNavigateToPortal
}) => {
  const [selectedLang, setSelectedLang] = useState<string>('en');
  const t = TRANSLATIONS[selectedLang] || TRANSLATIONS['en'];

  // Binary calculator states
  const [calcLeftPv, setCalcLeftPv] = useState<number>(1200);
  const [calcRightPv, setCalcRightPv] = useState<number>(840);
  const [calcPackageId, setCalcPackageId] = useState<number>(3); // 14% binary

  // Registration modal/form states
  const [regFullName, setRegFullName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regSponsorId, setRegSponsorId] = useState('JW-1001');
  const [regPosition, setRegPosition] = useState<'left' | 'right'>('left');
  const [regPackageId, setRegPackageId] = useState<number>(1);
  const [regAadhaar, setRegAadhaar] = useState('');
  const [regPan, setRegPan] = useState('');
  const [regSuccessMessage, setRegSuccessMessage] = useState('');

  // Calculation logic
  const selectedPkg = PACKAGES.find((p) => p.id === calcPackageId) || PACKAGES[0];
  const matchedPv = Math.min(calcLeftPv, calcRightPv);
  const grossBinary = matchedPv * selectedPkg.binaryRate * 100; // 1 PV = ₹100
  const tdsDeduction = grossBinary * 0.02; // 2% TDS
  const adminCharge = grossBinary * 0.05;  // 5% Admin Charge
  const netEarnings = grossBinary - tdsDeduction - adminCharge;
  const carryForwardLeft = Math.max(0, calcLeftPv - matchedPv);
  const carryForwardRight = Math.max(0, calcRightPv - matchedPv);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName || !regUsername || !regEmail) return;

    onRegisterMember({
      fullName: regFullName,
      username: regUsername.toLowerCase().replace(/\s+/g, '_'),
      email: regEmail,
      phone: regPhone || '+91 98000 00000',
      sponsorId: regSponsorId,
      position: regPosition,
      packageId: regPackageId,
      kycAadhaar: regAadhaar || 'XXXX-XXXX-XXXX',
      kycPan: regPan ? regPan.toUpperCase() : 'XXXXX0000X'
    });

    setRegSuccessMessage(`Member ${regFullName} successfully onboarded under ${regSponsorId} (${regPosition.toUpperCase()} leg)!`);
    setRegFullName('');
    setRegUsername('');
    setRegEmail('');
    setRegPhone('');
    setRegAadhaar('');
    setRegPan('');
  };

  return (
    <div className="w-full bg-slate-950 text-slate-100 pb-20">
      
      {/* 1. Language Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400 font-medium">
            <span className="text-amber-400">🌐 Supported Languages:</span>
            <span>Select official brochure translation:</span>
          </div>
          <div className="flex items-center flex-wrap gap-1.5 justify-center">
            {Object.entries(TRANSLATIONS).map(([code, item]) => (
              <button
                key={code}
                onClick={() => setSelectedLang(code)}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${
                  selectedLang === code
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                {item.native}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Hero Section with Generated Showcase Banner */}
      <section className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 pt-10 pb-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.opportunityTitle}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                {t.heroHeadline}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                {t.heroSubheadline}
              </p>

              {/* Top brochure badges: MRP, DP, Distribution, Weekly Payout */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-center">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{t.mrpLabel}</div>
                  <div className="text-xl font-bold font-mono text-white mt-0.5">₹2,150</div>
                </div>

                <div className="bg-slate-900/90 border border-amber-500/30 rounded-xl p-3 text-center">
                  <div className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">{t.dpPriceLabel}</div>
                  <div className="text-xl font-bold font-mono text-amber-300 mt-0.5">₹1,700</div>
                </div>

                <div className="bg-slate-900/90 border border-emerald-500/30 rounded-xl p-3 text-center">
                  <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">{t.distributionLabel}</div>
                  <div className="text-xl font-bold font-mono text-emerald-300 mt-0.5">₹1,200</div>
                </div>

                <div className="bg-slate-900/90 border border-blue-500/30 rounded-xl p-3 text-center">
                  <div className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider">{t.weeklyPayoutLabel}</div>
                  <div className="text-xl font-bold font-mono text-blue-300 mt-0.5">{t.yesLabel}</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-3">
                <a
                  href="#register-section"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{t.joinNow}</span>
                </a>

                <button
                  onClick={onNavigateToTree}
                  className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm flex items-center gap-2 transition-all"
                >
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                  <span>{t.viewTree}</span>
                </button>
              </div>

            </div>

            {/* Generated Hero Image Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 group">
                <img
                  src="/src/assets/images/jivanta_wellness_hero_1791468197474.jpg"
                  alt="Jivanta Wellness Natural Formulations"
                  className="w-full h-[320px] sm:h-[380px] object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">Premium Ayurveda Formulations</div>
                      <div className="text-sm font-semibold text-white">₹1,200 High Distribution on ₹1,700 DP</div>
                    </div>
                    <div className="text-xs font-mono px-2 py-1 bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
                      100% Lifetime Carry
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Package & Binary Slab Matrix + Direct Bonuses */}
      <section className="py-14 max-w-7xl mx-auto px-4 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {t.packagesTitle}
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            {t.packagesDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`rounded-2xl p-6 border transition-all relative flex flex-col justify-between ${
                pkg.id === 3
                  ? 'bg-gradient-to-b from-amber-950/30 via-slate-900 to-slate-900 border-amber-500/50 shadow-xl shadow-amber-500/10'
                  : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              {pkg.id === 3 && (
                <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-amber-500 text-slate-950 font-extrabold text-[11px] tracking-wider uppercase">
                  Best Value 14%
                </div>
              )}

              <div>
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  {pkg.productsCount} {pkg.productsCount === 1 ? 'Product' : 'Products'} Pack
                </div>
                <h3 className="text-xl font-bold text-white mt-1">{pkg.name}</h3>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-black font-mono text-white">₹{pkg.dp.toLocaleString()}</span>
                  <span className="text-xs text-slate-400 line-through font-mono">₹{pkg.mrp.toLocaleString()} MRP</span>
                </div>

                <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 grid grid-cols-2 gap-2 text-center">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-medium">Business Volume</div>
                    <div className="text-lg font-bold font-mono text-amber-400">{pkg.pv} PV</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-medium">Binary Matching</div>
                    <div className="text-lg font-bold font-mono text-emerald-400">{(pkg.binaryRate * 100)}%</div>
                  </div>
                </div>

                <ul className="mt-5 space-y-2.5 text-xs text-slate-300">
                  {pkg.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800">
                <a
                  href="#register-section"
                  onClick={() => setRegPackageId(pkg.id)}
                  className={`w-full py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors ${
                    pkg.id === 3
                      ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold'
                      : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  <span>Select {pkg.pv} PV Plan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Terms, Regulations & Bonuses Section (Strictly matching PDF Page 1) */}
      <section className="py-12 bg-slate-900/60 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Column 1: Terms & Regulations */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 text-amber-400 text-sm font-bold uppercase tracking-wider mb-4">
                <ShieldCheck className="w-4 h-4" />
                <span>{t.termsTitle}</span>
              </div>
              <ul className="space-y-3.5 text-xs text-slate-300">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">KYC Documents:</span> Aadhaar Card & PAN Card Required
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">Mandatory Directs:</span> 1 Left & 1 Right Direct Sponsor Required
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">Payout Deductions:</span> TDS 2% + Admin Charge 5%
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">Closing Schedule:</span> Weekly Closing System
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">Volume Carry Forward:</span> Lifetime Carry Forward
                  </div>
                </li>
              </ul>
            </div>

            {/* Column 2: Direct & Team Bonuses */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold uppercase tracking-wider mb-4">
                <Zap className="w-4 h-4" />
                <span>{t.bonusesTitle}</span>
              </div>
              <ul className="space-y-3.5 text-xs text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-white">Direct Sponsor Sales Commission:</span> 9%
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-white">Self Re-purchase Bonus:</span> 9%
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-white">Direct Sponsor Bonus:</span> 10% (On Binary Payout only)
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-white">Royalty Income:</span> 1% to 3%
                  </div>
                </li>
              </ul>
            </div>

            {/* Column 3: Key Business Highlights */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 text-blue-400 text-sm font-bold uppercase tracking-wider mb-4">
                <Award className="w-4 h-4" />
                <span>Key Business Highlights</span>
              </div>
              <ul className="space-y-3.5 text-xs text-slate-300">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>High Distribution Margin (₹1,200 on ₹1,700 DP)</div>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>Lucrative Binary Matching Options up to 14%</div>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>Massive Fund Rewards (Car, Bike, House & Villa Funds)</div>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>National & International Tour Benefits</div>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Interactive Binary Income & Deduction Calculator */}
      <section className="py-14 max-w-7xl mx-auto px-4 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-amber-500/30 rounded-3xl p-6 lg:p-10 shadow-2xl">
          <div className="max-w-2xl mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-amber-500/10 text-amber-400 text-xs font-semibold uppercase tracking-wider">
              <Calculator className="w-3.5 h-3.5" />
              <span>Real-Time Commission Simulator</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
              Jivanta Binary Matching & Net Payout Calculator
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Simulate weekly binary volume matching, TDS 2% & Admin 5% deductions, and lifetime volume carry-forward.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Controls */}
            <div className="lg:col-span-7 space-y-6">
              
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">
                  Select Package (Determines Binary Slab):
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {PACKAGES.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setCalcPackageId(p.id)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        calcPackageId === p.id
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xs">{p.productsCount} Product ({p.pv} PV)</div>
                      <div className="text-lg font-mono font-bold mt-0.5">{(p.binaryRate * 100)}%</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Left PV input */}
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-300 mb-1.5">
                  <span>Left Leg Volume (PV):</span>
                  <span className="font-mono text-amber-400 font-bold">{calcLeftPv.toLocaleString()} PV</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="12"
                  value={calcLeftPv}
                  onChange={(e) => setCalcLeftPv(Number(e.target.value))}
                  className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
              </div>

              {/* Right PV input */}
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-300 mb-1.5">
                  <span>Right Leg Volume (PV):</span>
                  <span className="font-mono text-emerald-400 font-bold">{calcRightPv.toLocaleString()} PV</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="12"
                  value={calcRightPv}
                  onChange={(e) => setCalcRightPv(Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
              </div>

            </div>

            {/* Receipt Summary Card */}
            <div className="lg:col-span-5 bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-4">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between pb-2 border-b border-slate-800">
                <span>Weekly Payout Statement</span>
                <span className="font-mono text-amber-400">1 PV = ₹100</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Matched Binary Volume:</span>
                  <span className="font-mono font-bold text-white">{matchedPv.toLocaleString()} PV</span>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span>Binary Slab Income ({(selectedPkg.binaryRate * 100)}%):</span>
                  <span className="font-mono font-bold text-white">₹{grossBinary.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>

                <div className="flex justify-between text-rose-400 pt-1 border-t border-slate-900">
                  <span>TDS Deduction (2%):</span>
                  <span className="font-mono">- ₹{tdsDeduction.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>

                <div className="flex justify-between text-rose-400">
                  <span>Admin Charge (5%):</span>
                  <span className="font-mono">- ₹{adminCharge.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>

                <div className="flex justify-between items-baseline pt-3 border-t border-slate-800">
                  <span className="text-sm font-bold text-white">Net Payout to E-Wallet:</span>
                  <span className="text-2xl font-black font-mono text-emerald-400">
                    ₹{netEarnings.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Carry forward status */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                <div className="font-semibold text-slate-300">Lifetime Carry-Forward Status:</div>
                <div className="flex justify-between">
                  <span>Left Unmatched Carry:</span>
                  <span className="font-mono text-amber-300 font-bold">{carryForwardLeft} PV</span>
                </div>
                <div className="flex justify-between">
                  <span>Right Unmatched Carry:</span>
                  <span className="font-mono text-emerald-300 font-bold">{carryForwardRight} PV</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Complete Ranks, Awards & Rewards Matrix (All 13 Ranks from PDF) */}
      <section className="py-14 max-w-7xl mx-auto px-4 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-amber-500/10 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            <span>Official Recognition Matrix</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            Ranks, Awards & Rewards Matrix (All 13 Tiers)
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            From Rising Star gift boxes to Universal Villa Fund (₹4 Crore) and World Tour.
          </p>
        </div>

        {/* Dense Responsive Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/90">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">Rank Name</th>
                <th className="py-3 px-4">Required PV</th>
                <th className="py-3 px-4">Cash / Fund Reward</th>
                <th className="py-3 px-4">Tour & Extra Benefits</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-medium">
              {RANKS_MATRIX.map((rank) => (
                <tr 
                  key={rank.rankNumber}
                  className={`hover:bg-slate-800/50 transition-colors ${
                    rank.rankNumber >= 11 ? 'bg-amber-950/15' : ''
                  }`}
                >
                  <td className="py-3 px-4 text-center font-mono text-slate-400">
                    {rank.rankNumber}
                  </td>
                  <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                    {rank.rankNumber >= 11 ? (
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    ) : rank.rankNumber >= 7 ? (
                      <Car className="w-3.5 h-3.5 text-blue-400" />
                    ) : (
                      <Award className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                    <span>{rank.name}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-amber-300">
                    {rank.rankNumber === 1 ? `${rank.requiredPv.toLocaleString()} PV` : `Next ${rank.requiredPv.toLocaleString()} PV`}
                  </td>
                  <td className="py-3 px-4 font-semibold text-emerald-300">
                    {rank.cashFundReward}
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {rank.tourExtraBenefits !== '—' ? (
                      <span className="inline-flex items-center gap-1.5 text-sky-300 font-medium">
                        <Plane className="w-3 h-3 text-sky-400 shrink-0" />
                        <span>{rank.tourExtraBenefits}</span>
                      </span>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 7. Member Onboarding & Registration Form (index.php Onboarding simulator) */}
      <section id="register-section" className="py-14 max-w-4xl mx-auto px-4 lg:px-8">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl">
          <div className="text-center max-w-md mx-auto mb-8">
            <h2 className="text-2xl font-extrabold text-white">Join Jivanta Wellness</h2>
            <p className="text-xs text-slate-400 mt-1">
              Register as an independent distributor and start earning weekly binary matching commissions.
            </p>
          </div>

          {regSuccessMessage && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{regSuccessMessage}</span>
            </div>
          )}

          <form onSubmit={handleRegisterSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Desired Username *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ramesh_wellness"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="ramesh@example.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Mobile Phone (WhatsApp)</label>
                <input
                  type="text"
                  placeholder="+91 98765 00000"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Sponsor Member ID *</label>
                <input
                  type="text"
                  required
                  value={regSponsorId}
                  onChange={(e) => setRegSponsorId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Placement Leg *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRegPosition('left')}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${
                      regPosition === 'left'
                        ? 'bg-amber-500 text-slate-950 border-amber-500'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    LEFT LEG
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegPosition('right')}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${
                      regPosition === 'right'
                        ? 'bg-emerald-500 text-slate-950 border-emerald-500'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    RIGHT LEG
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Aadhaar Card Number</label>
                <input
                  type="text"
                  placeholder="12-digit Aadhaar"
                  value={regAadhaar}
                  onChange={(e) => setRegAadhaar(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">PAN Card Number</label>
                <input
                  type="text"
                  placeholder="10-digit PAN"
                  value={regPan}
                  onChange={(e) => setRegPan(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs uppercase text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Package selector */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Activation Package</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {PACKAGES.map((pkg) => (
                  <button
                    type="button"
                    key={pkg.id}
                    onClick={() => setRegPackageId(pkg.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      regPackageId === pkg.id
                        ? 'bg-amber-500/15 border-amber-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold">{pkg.name}</div>
                    <div className="text-sm font-mono font-bold text-amber-400 mt-1">₹{pkg.dp.toLocaleString()}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{pkg.pv} PV · {(pkg.binaryRate * 100)}% Binary</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Complete Registration & Activate</span>
              </button>
            </div>
          </form>
        </div>
      </section>

    </div>
  );
};
