'use client';

import React from 'react';
import { Celebrity } from '@/types/celebrity';
import { formatHeight } from '@/lib/heightUtils';
import { Plus, Check, ArrowUpRight } from 'lucide-react';

interface CelebrityTableProps {
  celebrities: Celebrity[];
  unit: 'imperial' | 'metric';
  onSelect: (celeb: Celebrity) => void;
  onToggleCompare: (celeb: Celebrity) => void;
  isComparing: (id: string) => boolean;
}

export function CelebrityTable({
  celebrities,
  unit,
  onSelect,
  onToggleCompare,
  isComparing
}: CelebrityTableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-[#232730] bg-[#111317]">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-[#232730] bg-[#16181f] text-[11px] font-mono uppercase tracking-wider text-neutral-400">
            <th className="py-3 px-4 font-semibold">Celebrity</th>
            <th className="py-3 px-3 font-semibold">Category</th>
            <th className="py-3 px-3 font-semibold">Real Height</th>
            <th className="py-3 px-3 font-semibold">Claimed</th>
            <th className="py-3 px-3 font-semibold">Difference</th>
            <th className="py-3 px-4 font-semibold hidden md:table-cell">Shoes & Lifts</th>
            <th className="py-3 px-4 font-semibold hidden lg:table-cell">Evidence & Notes</th>
            <th className="py-3 px-4 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1d2027]">
          {celebrities.map((celeb) => {
            const realFormatted = formatHeight(celeb.realHeight.cm, unit);
            const claimedFormatted = formatHeight(celeb.claimedHeight.cm, unit);
            const diffInches = celeb.exaggerationDiffInches;
            const comparing = isComparing(celeb.id);

            let diffBadge = 'text-neutral-400 font-mono';
            if (diffInches > 1.5) diffBadge = 'text-red-400 font-mono font-semibold';
            else if (diffInches > 0.4) diffBadge = 'text-amber-400 font-mono';
            else if (diffInches < -0.4) diffBadge = 'text-blue-400 font-mono';
            else diffBadge = 'text-emerald-400 font-mono';

            return (
              <tr 
                key={celeb.id} 
                className="hover:bg-[#181b22] transition-colors group cursor-pointer"
                onClick={() => onSelect(celeb)}
              >
                {/* Figure: Portrait + Name */}
                <td className="py-2.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-md overflow-hidden bg-black shrink-0 border border-[#2a2e39]">
                      <img
                        src={celeb.image}
                        alt={celeb.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-top"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLElement).setAttribute('src', 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 24 24" fill="%2322262f"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/></svg>');
                        }}
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-white group-hover:text-amber-400 transition-colors">
                        {celeb.name}
                      </div>
                      <div className="text-[10px] text-neutral-400 truncate max-w-[160px] sm:max-w-[220px]">
                        {celeb.knownFor}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Category & Industry */}
                <td className="py-2.5 px-3">
                  <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-[#181a20] text-neutral-300 border border-[#272b35]">
                    {celeb.industry === 'bollywood' ? 'Indian' : 'World'} • {celeb.category}
                  </span>
                </td>

                {/* Barefoot Real */}
                <td className="py-2.5 px-3 font-mono tabular-nums font-bold text-white whitespace-nowrap">
                  {realFormatted}
                  <span className="block text-[10px] font-mono text-neutral-400 font-normal">
                    {celeb.realHeight.cm} cm
                  </span>
                </td>

                {/* Billed Claim */}
                <td className="py-2.5 px-3 font-mono tabular-nums text-neutral-400 line-through decoration-neutral-600 whitespace-nowrap">
                  {claimedFormatted}
                  <span className="block text-[10px] font-mono text-neutral-400 font-normal no-underline">
                    {celeb.claimedHeight.cm} cm
                  </span>
                </td>

                {/* Discrepancy */}
                <td className="py-2.5 px-3 whitespace-nowrap">
                  <span className={diffBadge}>
                    {diffInches > 0 ? `+${diffInches}"` : `${diffInches}"`}
                  </span>
                  <span className="block text-[10px] text-neutral-400 capitalize">
                    {celeb.exaggerationLevel.replace('_', ' ')}
                  </span>
                </td>

                {/* Footwear / Lifts */}
                <td className="py-2.5 px-4 hidden md:table-cell text-neutral-400 max-w-[200px] truncate" title={celeb.shoeLifts}>
                  {celeb.shoeLifts}
                </td>

                {/* Proof Notes */}
                <td className="py-2.5 px-4 hidden lg:table-cell text-neutral-400 max-w-[260px] truncate" title={celeb.proofNotes}>
                  {celeb.proofNotes}
                </td>

                {/* Action Buttons */}
                <td className="py-2.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onSelect(celeb)}
                      className="p-1.5 rounded bg-[#1c1f27] hover:bg-[#272b36] text-neutral-300 hover:text-white border border-[#2b303d] transition-colors cursor-pointer"
                      title="Inspect Dossier"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onToggleCompare(celeb)}
                      className={`px-2 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer flex items-center gap-1 ${
                        comparing
                          ? 'bg-amber-500 text-black font-semibold'
                          : 'bg-[#181a20] hover:bg-[#222631] text-neutral-400 hover:text-white border border-[#262934]'
                      }`}
                      title={comparing ? 'Remove from compare' : 'Add to compare'}
                    >
                      {comparing ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                      <span className="hidden sm:inline">{comparing ? 'Added' : 'Compare'}</span>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

