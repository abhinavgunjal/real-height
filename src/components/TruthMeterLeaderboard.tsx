'use client';

import React from 'react';
import { Celebrity } from '@/types/celebrity';
import { formatHeight } from '@/lib/heightUtils';
import { AlertCircle, CheckCircle, TrendingDown, TrendingUp } from 'lucide-react';

interface TruthMeterLeaderboardProps {
  allCelebrities: Celebrity[];
  unit: 'imperial' | 'metric';
  onSelectCelebrity: (celeb: Celebrity) => void;
  onCompareCelebrity: (celeb: Celebrity) => void;
}

export function TruthMeterLeaderboard({
  allCelebrities,
  unit,
  onSelectCelebrity,
  onCompareCelebrity
}: TruthMeterLeaderboardProps) {
  const [selectedIndustry, setSelectedIndustry] = React.useState<'bollywood' | 'all' | 'hollywood'>('bollywood');

  const filtered = React.useMemo(() => {
    if (selectedIndustry === 'all') return allCelebrities;
    return allCelebrities.filter(c => c.industry === selectedIndustry);
  }, [allCelebrities, selectedIndustry]);

  // 1. Biggest Inflators (highest claimed - real)
  const biggestInflators = [...filtered]
    .sort((a, b) => b.exaggerationDiffCm - a.exaggerationDiffCm)
    .slice(0, 8);

  // 2. 100% Honest Stars (diff === 0 or <= 0.4)
  const honestStars = [...filtered]
    .filter(c => c.exaggerationDiffInches <= 0.4)
    .slice(0, 8);

  // 3. Sub-5'8" Stature Figures (< 172cm)
  const shortKings = [...filtered]
    .filter(c => c.realHeight.cm <= 172)
    .sort((a, b) => a.realHeight.cm - b.realHeight.cm)
    .slice(0, 8);

  // 4. Tall Stature Figures (>= 185cm)
  const titans = [...filtered]
    .filter(c => c.realHeight.cm >= 185)
    .sort((a, b) => b.realHeight.cm - a.realHeight.cm)
    .slice(0, 8);

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="bg-[#12141a] border border-[#232731] rounded-2xl p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30 mb-2">
            Height Rankings
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Claimed Height vs Real Height
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1.5 leading-relaxed">
            A breakdown of which celebrities claim their real height, who exaggerates the most, and who wears lifts.
          </p>
        </div>

        {/* Industry Pill Selector */}
        <div className="flex items-center gap-1.5 bg-[#0e1014] p-1 rounded-xl border border-[#20232c] self-start md:self-auto">
          <button
            onClick={() => setSelectedIndustry('bollywood')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedIndustry === 'bollywood'
                ? 'bg-amber-500 text-black shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Bollywood
          </button>
          <button
            onClick={() => setSelectedIndustry('hollywood')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedIndustry === 'hollywood'
                ? 'bg-amber-500 text-black shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Hollywood & World
          </button>
          <button
            onClick={() => setSelectedIndustry('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedIndustry === 'all'
                ? 'bg-[#222631] text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            All Figures
          </button>
        </div>
      </div>

      {/* 2x2 Grid of Leaderboards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Wall of Inflation (Biggest Exaggerations) */}
        <div className="bg-[#12141a] border border-[#232731] rounded-2xl p-5">
          <div className="flex items-center justify-between pb-3.5 border-b border-[#20232c]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-950/70 border border-red-800/60 text-red-400 flex items-center justify-center">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Largest Agency Discrepancies</h3>
                <p className="text-[11px] text-neutral-400">Widest gaps between claimed and barefoot heights</p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-red-400 bg-red-950/50 px-2 py-0.5 rounded border border-red-800/40">
              PR Padding
            </span>
          </div>

          <div className="divide-y divide-[#1b1e26] mt-1">
            {biggestInflators.map((celeb, rank) => (
              <div
                key={celeb.id}
                onClick={() => onSelectCelebrity(celeb)}
                className="py-2.5 px-2 flex items-center justify-between gap-3 hover:bg-[#171a22] rounded-lg cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-neutral-400 w-5">
                    {String(rank + 1).padStart(2, '0')}
                  </span>
                  <div className="w-8 h-8 rounded-md overflow-hidden bg-black shrink-0 border border-[#272b36]">
                    <img
                      src={celeb.image}
                      alt={celeb.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        (e.target as HTMLElement).setAttribute('src', 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 24 24" fill="%2322262f"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/></svg>');
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white group-hover:text-amber-400 transition-colors">
                      {celeb.name}
                    </h4>
                    <p className="text-[10px] font-mono text-neutral-400">
                      Real: <span className="text-neutral-200 font-bold">{formatHeight(celeb.realHeight.cm, unit)}</span>
                      {' • '}
                      <span className="line-through text-neutral-400">Claims {formatHeight(celeb.claimedHeight.cm, unit)}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-mono font-bold text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-800/40 tabular-nums">
                    +{celeb.exaggerationDiffInches}" gap
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hall of Truth (Honest Celebrities) */}
        <div className="bg-[#12141a] border border-[#232731] rounded-2xl p-5">
          <div className="flex items-center justify-between pb-3.5 border-b border-[#20232c]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-950/70 border border-emerald-800/60 text-emerald-400 flex items-center justify-center">
                <CheckCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Honest Heights</h3>
                <p className="text-[11px] text-neutral-400">Stars whose claimed height matches their real barefoot height</p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/40">
              Verified Accurate
            </span>
          </div>

          <div className="divide-y divide-[#1b1e26] mt-1">
            {honestStars.map((celeb, rank) => (
              <div
                key={celeb.id}
                onClick={() => onSelectCelebrity(celeb)}
                className="py-2.5 px-2 flex items-center justify-between gap-3 hover:bg-[#171a22] rounded-lg cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-neutral-400 w-5">
                    {String(rank + 1).padStart(2, '0')}
                  </span>
                  <div className="w-8 h-8 rounded-md overflow-hidden bg-black shrink-0 border border-[#272b36]">
                    <img
                      src={celeb.image}
                      alt={celeb.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        (e.target as HTMLElement).setAttribute('src', 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 24 24" fill="%2322262f"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/></svg>');
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white group-hover:text-emerald-400 transition-colors">
                      {celeb.name}
                    </h4>
                    <p className="text-[10px] font-mono text-neutral-400">
                      Barefoot: <span className="text-neutral-200 font-bold">{formatHeight(celeb.realHeight.cm, unit)}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-mono font-medium text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                    Exact Match
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Short Stature Figures */}
        <div className="bg-[#12141a] border border-[#232731] rounded-2xl p-5">
          <div className="flex items-center justify-between pb-3.5 border-b border-[#20232c]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#181b22] border border-[#2b303d] text-amber-400 flex items-center justify-center">
                <TrendingDown className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Under 5'8" Stars</h3>
                <p className="text-[11px] text-neutral-400">Popular leading stars under 5'8" (172 cm)</p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-neutral-300 bg-[#191c24] px-2 py-0.5 rounded border border-[#2a2e3a]">
              ≤ 5'7.5"
            </span>
          </div>

          <div className="divide-y divide-[#1b1e26] mt-1">
            {shortKings.map((celeb, rank) => (
              <div
                key={celeb.id}
                onClick={() => onSelectCelebrity(celeb)}
                className="py-2.5 px-2 flex items-center justify-between gap-3 hover:bg-[#171a22] rounded-lg cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-neutral-400 w-5">
                    {String(rank + 1).padStart(2, '0')}
                  </span>
                  <div className="w-8 h-8 rounded-md overflow-hidden bg-black shrink-0 border border-[#272b36]">
                    <img
                      src={celeb.image}
                      alt={celeb.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        (e.target as HTMLElement).setAttribute('src', 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 24 24" fill="%2322262f"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/></svg>');
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white group-hover:text-amber-400 transition-colors">
                      {celeb.name}
                    </h4>
                    <p className="text-[10px] text-neutral-400 truncate max-w-[160px]">
                      {celeb.knownFor.split(',')[0]}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-white tabular-nums">
                    {formatHeight(celeb.realHeight.cm, unit)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tall Stature Figures */}
        <div className="bg-[#12141a] border border-[#232731] rounded-2xl p-5">
          <div className="flex items-center justify-between pb-3.5 border-b border-[#20232c]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#181b22] border border-[#2b303d] text-blue-400 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Tall Stars (6'1"+)</h3>
                <p className="text-[11px] text-neutral-400">Stars standing 6'1" (185 cm) and above</p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-neutral-300 bg-[#191c24] px-2 py-0.5 rounded border border-[#2a2e3a]">
              ≥ 185 cm
            </span>
          </div>

          <div className="divide-y divide-[#1b1e26] mt-1">
            {titans.map((celeb, rank) => (
              <div
                key={celeb.id}
                onClick={() => onSelectCelebrity(celeb)}
                className="py-2.5 px-2 flex items-center justify-between gap-3 hover:bg-[#171a22] rounded-lg cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-neutral-400 w-5">
                    {String(rank + 1).padStart(2, '0')}
                  </span>
                  <div className="w-8 h-8 rounded-md overflow-hidden bg-black shrink-0 border border-[#272b36]">
                    <img
                      src={celeb.image}
                      alt={celeb.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        (e.target as HTMLElement).setAttribute('src', 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 24 24" fill="%2322262f"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/></svg>');
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {celeb.name}
                    </h4>
                    <p className="text-[10px] text-neutral-400 truncate max-w-[160px]">
                      {celeb.knownFor.split(',')[0]}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-white tabular-nums">
                    {formatHeight(celeb.realHeight.cm, unit)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
