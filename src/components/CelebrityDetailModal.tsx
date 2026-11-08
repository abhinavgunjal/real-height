'use client';

import React from 'react';
import Link from 'next/link';
import { Celebrity } from '@/types/celebrity';
import { formatHeight } from '@/lib/heightUtils';
import { X, ExternalLink, Plus, Check, ArrowRight } from 'lucide-react';

interface CelebrityDetailModalProps {
  celebrity: Celebrity | null;
  onClose: () => void;
  unit: 'imperial' | 'metric';
  onToggleCompare: (celeb: Celebrity) => void;
  isComparing: boolean;
}

export function CelebrityDetailModal({
  celebrity,
  onClose,
  unit,
  onToggleCompare,
  isComparing
}: CelebrityDetailModalProps) {
  if (!celebrity) return null;

  const realFormatted = formatHeight(celebrity.realHeight.cm, unit);
  const claimedFormatted = formatHeight(celebrity.claimedHeight.cm, unit);
  const peakFormatted = celebrity.peakHeight ? formatHeight(celebrity.peakHeight.cm, unit) : null;
  const diffInches = celebrity.exaggerationDiffInches;

  let diffLabel = 'Accurate Listing';
  let diffColor = 'text-emerald-400 bg-emerald-950/40 border-emerald-800/60';
  if (diffInches > 1.5) {
    diffLabel = `+${diffInches}" Overstated`;
    diffColor = 'text-red-400 bg-red-950/40 border-red-800/60';
  } else if (diffInches > 0.4) {
    diffLabel = `+${diffInches}" Minor Discrepancy`;
    diffColor = 'text-amber-400 bg-amber-950/40 border-amber-800/60';
  } else if (diffInches < -0.4) {
    diffLabel = `${diffInches}" Taller Than Claimed`;
    diffColor = 'text-blue-400 bg-blue-950/40 border-blue-800/60';
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-[#121418] border border-[#262a34] rounded-2xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-lg bg-[#181a20]/90 hover:bg-[#252833] text-neutral-400 hover:text-white transition-colors border border-[#2b303d] cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header: Photo and Biographic Metadata */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-6 bg-[#16181f] border-b border-[#232731]">
          <div className="w-24 h-28 sm:w-28 sm:h-32 rounded-xl overflow-hidden bg-black shrink-0 border border-[#2c313d]">
            <img
              src={celebrity.image}
              alt={celebrity.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top"
              onError={(e) => {
                (e.target as HTMLElement).setAttribute('src', 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 24 24" fill="%2322262f"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/></svg>');
              }}
            />
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#1f232c] text-neutral-300 border border-[#2e3340]">
                {celebrity.industry === 'bollywood' ? 'Indian Cinema' : 'International'} • {celebrity.category}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${diffColor}`}>
                {diffLabel}
              </span>
            </div>

            <h2 className="text-2xl font-bold text-white tracking-tight">
              {celebrity.name}
            </h2>

            <p className="text-xs text-neutral-400 leading-normal">
              {celebrity.knownFor} • Born {celebrity.birthYear} ({celebrity.nationality})
            </p>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto text-xs">
          
          {/* Direct Stature Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* Real Barefoot */}
            <div className="p-4 rounded-xl bg-[#0c0d10] border border-[#232732]">
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
                Real Height (Barefoot)
              </span>
              <div className="text-2xl font-bold font-mono text-white mt-1">
                {realFormatted}
              </div>
              <div className="text-[11px] font-mono text-neutral-400 mt-0.5">
                {celebrity.realHeight.cm} cm
              </div>
              <div className="text-[10px] text-neutral-400 mt-2 truncate" title={celebrity.realHeight.source}>
                {celebrity.realHeight.source}
              </div>
            </div>

            {/* Billed Claim */}
            <div className="p-4 rounded-xl bg-[#0c0d10] border border-[#232732]">
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
                Claimed Height
              </span>
              <div className="text-2xl font-mono text-neutral-400 line-through decoration-neutral-600 mt-1">
                {claimedFormatted}
              </div>
              <div className="text-[11px] font-mono text-neutral-400 mt-0.5">
                {celebrity.claimedHeight.cm} cm
              </div>
              <div className="text-[10px] text-neutral-400 mt-2 truncate" title={celebrity.claimedHeight.source}>
                {celebrity.claimedHeight.source}
              </div>
            </div>

            {/* Gap Analysis */}
            <div className="p-4 rounded-xl bg-[#0c0d10] border border-[#232732] col-span-2 sm:col-span-1">
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
                Difference
              </span>
              <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
                {diffInches > 0 ? `+${diffInches}"` : `${diffInches}"`}
              </div>
              <div className="text-[11px] font-mono text-neutral-400 mt-0.5">
                {celebrity.exaggerationDiffCm > 0 ? `+${celebrity.exaggerationDiffCm} cm` : `${celebrity.exaggerationDiffCm} cm`}
              </div>
              <div className="text-[10px] text-neutral-400 mt-2">
                {peakFormatted ? `Peak Height: ${peakFormatted}` : 'Consistent measurement'}
              </div>
            </div>
          </div>

          {/* Footwear & Shoe Lift Analysis */}
          <div className="p-4 rounded-xl bg-[#15171d] border border-[#232731] space-y-1.5">
            <h4 className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-semibold">
              Shoes & Lifts
            </h4>
            <p className="text-neutral-300 leading-relaxed text-xs">
              {celebrity.shoeLifts}
            </p>
          </div>

          {/* Photographic Evidence & Co-Star Calibrations */}
          <div className="p-4 rounded-xl bg-[#15171d] border border-[#232731] space-y-1.5">
            <h4 className="text-[11px] font-mono uppercase tracking-wider text-neutral-300 font-semibold">
              Evidence & Comparisons
            </h4>
            <p className="text-neutral-300 leading-relaxed text-xs">
              {celebrity.proofNotes}
            </p>
          </div>

          {/* Famous Quote */}
          {celebrity.quote && (
            <div className="p-3.5 rounded-xl bg-[#101216] border-l-2 border-amber-500/70 text-xs italic text-neutral-300 leading-relaxed">
              {celebrity.quote}
            </div>
          )}

          {/* External links and permanent SSR profile */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#232731]">
            <div className="flex items-center gap-2">
              {celebrity.imdbUrl && (
                <a
                  href={celebrity.imdbUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-lg bg-[#181a20] hover:bg-[#22252e] text-neutral-300 hover:text-white border border-[#282d38] text-xs font-mono flex items-center gap-1.5 transition-colors"
                >
                  <span>IMDb Profile</span>
                  <ExternalLink className="w-3 h-3 text-neutral-400" />
                </a>
              )}
              {celebrity.celebHeightsUrl && (
                <a
                  href={celebrity.celebHeightsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-lg bg-[#181a20] hover:bg-[#22252e] text-neutral-300 hover:text-white border border-[#282d38] text-xs font-mono flex items-center gap-1.5 transition-colors"
                >
                  <span>CelebHeights Page</span>
                  <ExternalLink className="w-3 h-3 text-neutral-400" />
                </a>
              )}
            </div>

            <Link
              href={`/celebrity/${celebrity.id}`}
              className="px-3 py-1.5 rounded-lg bg-[#1e222b] hover:bg-[#272c38] text-neutral-200 hover:text-white border border-[#303644] text-xs font-medium flex items-center gap-1 transition-colors"
            >
              <span>Dedicated Dossier Page</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
            </Link>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#14161c] border-t border-[#232731] flex items-center justify-between">
          <span className="text-[11px] font-mono text-neutral-400">
            Archive ID: {celebrity.id}
          </span>
          <button
            onClick={() => onToggleCompare(celebrity)}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
              isComparing
                ? 'bg-amber-500 text-black font-semibold'
                : 'bg-[#20232c] hover:bg-[#2a2f3a] text-white border border-[#313644]'
            }`}
          >
            {isComparing ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>In Compare Lineup</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Compare</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
