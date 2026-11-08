'use client';

import React from 'react';
import { Ruler, Scale, BarChart3, Search } from 'lucide-react';

interface NavbarProps {
  unit: 'imperial' | 'metric';
  onToggleUnit: () => void;
  activeTab: 'explore' | 'compare' | 'leaderboard';
  setActiveTab: (tab: 'explore' | 'compare' | 'leaderboard') => void;
  compareCount: number;
  onOpenCompare: () => void;
  totalCount?: number;
}

export function Navbar({
  unit,
  onToggleUnit,
  activeTab,
  setActiveTab,
  compareCount,
  onOpenCompare,
  totalCount = 1007
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0d0e11]/90 backdrop-blur-md border-b border-[#232730] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand identity: Editorial, typographic, authentic */}
        <div 
          onClick={() => setActiveTab('explore')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-8 h-8 rounded-lg bg-[#1c1f26] border border-[#2e3340] flex items-center justify-center text-amber-400 group-hover:border-amber-500/50 transition-colors">
            <Ruler className="w-4 h-4 stroke-[2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-white group-hover:text-amber-400 transition-colors">
                Real Heights
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#181a20] text-neutral-400 border border-[#2b303c]">
                {totalCount} Stars
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 hidden sm:block">
              Real Height vs Claimed Height
            </p>
          </div>
        </div>

        {/* Primary View Navigation */}
        <nav className="flex items-center gap-1 bg-[#14161b] p-1 rounded-xl border border-[#232730]">
          <button
            onClick={() => setActiveTab('explore')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'explore'
                ? 'bg-[#232732] text-white font-semibold shadow-sm border border-[#343a4a]'
                : 'text-neutral-400 hover:text-white hover:bg-[#1a1d24]'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Database</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('compare');
              onOpenCompare();
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 cursor-pointer relative ${
              activeTab === 'compare'
                ? 'bg-[#232732] text-white font-semibold shadow-sm border border-[#343a4a]'
                : 'text-neutral-400 hover:text-white hover:bg-[#1a1d24]'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Compare</span>
            {compareCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 text-[10px] font-mono font-bold rounded bg-amber-500 text-black">
                {compareCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'leaderboard'
                ? 'bg-[#232732] text-white font-semibold shadow-sm border border-[#343a4a]'
                : 'text-neutral-400 hover:text-white hover:bg-[#1a1d24]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Rankings</span>
          </button>
        </nav>

        {/* Utility controls: Unit Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleUnit}
            title={`Switch to ${unit === 'imperial' ? 'Metric (cm)' : 'Imperial (ft/in)'}`}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#14161b] border border-[#232730] hover:border-[#383e4e] text-xs font-mono transition-colors cursor-pointer"
          >
            <span className={unit === 'imperial' ? 'text-amber-400 font-bold' : 'text-neutral-500'}>ft/in</span>
            <span className="text-neutral-600">/</span>
            <span className={unit === 'metric' ? 'text-amber-400 font-bold' : 'text-neutral-500'}>cm</span>
          </button>
        </div>

      </div>
    </header>
  );
}
