'use client';

import React from 'react';
import { Celebrity } from '@/types/celebrity';
import { formatHeight } from '@/lib/heightUtils';
import { Plus, Check, ArrowUpRight } from 'lucide-react';

interface CelebrityCardProps {
  celebrity: Celebrity;
  unit: 'imperial' | 'metric';
  onSelect: (celeb: Celebrity) => void;
  onToggleCompare: (celeb: Celebrity) => void;
  isComparing: boolean;
}

export function CelebrityCard({
  celebrity,
  unit,
  onSelect,
  onToggleCompare,
  isComparing
}: CelebrityCardProps) {
  const realFormatted = formatHeight(celebrity.realHeight.cm, unit);
  const claimedFormatted = formatHeight(celebrity.claimedHeight.cm, unit);
  const diffInches = celebrity.exaggerationDiffInches;

  // Human-tailored status pill
  let statusBadge = {
    label: 'Accurate',
    className: 'bg-[#1b251f] text-[#4ade80] border-[#22442d]'
  };

  if (diffInches > 1.5) {
    statusBadge = {
      label: `+${diffInches}" Overstated`,
      className: 'bg-[#291717] text-[#f87171] border-[#4d2323]'
    };
  } else if (diffInches > 0.4) {
    statusBadge = {
      label: `+${diffInches}" Modest Gap`,
      className: 'bg-[#271d15] text-[#fbbf24] border-[#4d371d]'
    };
  } else if (diffInches < -0.4) {
    statusBadge = {
      label: `${diffInches}" Understated`,
      className: 'bg-[#18232e] text-[#60a5fa] border-[#233c52]'
    };
  }

  return (
    <article className="group bg-[#131519] hover:bg-[#171920] border border-[#22262f] hover:border-[#353b49] rounded-xl overflow-hidden transition-all duration-200 flex flex-col justify-between">
      
      {/* Top Media Section */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0a0b0d]">
        <img
          src={celebrity.image}
          alt={celebrity.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-top filter contrast-[1.03] group-hover:scale-102 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLElement).setAttribute('src', 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 24 24" fill="%2322262f"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/></svg>');
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#131519] via-transparent to-transparent opacity-90" />

        {/* Top Badges */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-black/75 text-neutral-300 border border-white/10 backdrop-blur-sm">
            {celebrity.industry === 'bollywood' ? 'Indian Cinema' : 'International'}
          </span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${statusBadge.className}`}>
            {statusBadge.label}
          </span>
        </div>

        {/* Name and context at base of photo */}
        <div className="absolute bottom-2.5 left-3 right-3">
          <h3 
            onClick={() => onSelect(celebrity)}
            className="text-base font-bold text-white hover:text-amber-400 transition-colors cursor-pointer tracking-tight"
          >
            {celebrity.name}
          </h3>
          <p className="text-[11px] text-neutral-400 truncate">
            {celebrity.knownFor}
          </p>
        </div>
      </div>

      {/* Body: Direct Height Comparison Matrix */}
      <div className="p-3.5 space-y-3 flex-1 flex flex-col justify-between">
        
        {/* Height readout row */}
        <div className="grid grid-cols-2 gap-2 bg-[#0c0d10] p-2.5 rounded-lg border border-[#1e222b]">
          <div>
            <span className="block text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
              Real (Barefoot)
            </span>
            <span className="text-lg font-bold font-mono tabular-nums text-white">
              {realFormatted}
            </span>
            <span className="block text-[10px] font-mono text-neutral-400">
              {unit === 'imperial' ? `${celebrity.realHeight.cm} cm` : ''}
            </span>
          </div>

          <div className="border-l border-[#1f232d] pl-2.5">
            <span className="block text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
              Claimed
            </span>
            <span className="text-lg font-mono tabular-nums font-semibold text-neutral-400 line-through decoration-neutral-600">
              {claimedFormatted}
            </span>
            <span className="block text-[10px] font-mono text-neutral-400">
              {unit === 'imperial' ? `${celebrity.claimedHeight.cm} cm` : ''}
            </span>
          </div>
        </div>

        {/* Footwear / Lift Brief */}
        <div className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
          <strong className="text-neutral-300 font-medium">Shoes & lifts: </strong>
          {celebrity.shoeLifts}
        </div>

        {/* Human proof snippet */}
        <div className="text-[11px] text-neutral-400 line-clamp-2 italic border-l border-[#2e3340] pl-2">
          {celebrity.proofNotes}
        </div>

        {/* Actions */}
        <div className="pt-2 flex items-center gap-2 border-t border-[#1e222b]">
          <button
            onClick={() => onSelect(celebrity)}
            className="flex-1 py-1.5 px-2.5 rounded-lg bg-[#1a1d24] hover:bg-[#222731] text-neutral-200 hover:text-white text-xs font-medium border border-[#2b303d] transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>Dossier & Proof</span>
            <ArrowUpRight className="w-3 h-3 text-neutral-400" />
          </button>

          <button
            onClick={() => onToggleCompare(celebrity)}
            className={`py-1.5 px-2.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1 cursor-pointer ${
              isComparing
                ? 'bg-amber-500 text-black font-semibold'
                : 'bg-[#181a20] hover:bg-[#20232b] text-neutral-400 hover:text-white border border-[#272b36]'
            }`}
            title={isComparing ? 'Remove from compare stage' : 'Add to compare stage'}
          >
            {isComparing ? (
              <>
                <Check className="w-3 h-3" />
                <span>Lineup</span>
              </>
            ) : (
              <>
                <Plus className="w-3 h-3" />
                <span>Compare</span>
              </>
            )}
          </button>
        </div>

      </div>

    </article>
  );
}
