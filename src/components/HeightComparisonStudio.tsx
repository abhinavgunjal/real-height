'use client';

import React, { useState } from 'react';
import { Celebrity } from '@/types/celebrity';
import { formatHeight, cmToFeetInches } from '@/lib/heightUtils';
import { Trash2, Scale, ArrowRightLeft, Sparkles } from 'lucide-react';

interface HeightComparisonStudioProps {
  selectedCelebrities: Celebrity[];
  allCelebrities: Celebrity[];
  onRemoveCelebrity: (id: string) => void;
  onAddCelebrity: (celeb: Celebrity) => void;
  unit: 'imperial' | 'metric';
  onSelectForDetails: (celeb: Celebrity) => void;
}

interface BollywoodPreset {
  id: string;
  name: string;
  category: 'iconic' | 'action' | 'stature' | 'cinema';
  ids: string[];
  description: string;
}

const BOLLYWOOD_PRESETS: BollywoodPreset[] = [
  {
    id: 'three-khans',
    name: 'The Three Khans',
    category: 'iconic',
    ids: ['shah-rukh-khan', 'salman-khan', 'aamir-khan'],
    description: 'SRK (5\'7"), Salman (5\'6.5"), Aamir (5\'5")'
  },
  {
    id: 'bachchan-legacy',
    name: 'Bachchan Legacy',
    category: 'iconic',
    ids: ['amitabh-bachchan', 'abhishek-bachchan', 'shah-rukh-khan'],
    description: 'Big B (6\'2"), Abhishek (6\'1.5"), SRK (5\'7")'
  },
  {
    id: 'padmaavat-trio',
    name: 'Padmaavat Trio',
    category: 'iconic',
    ids: ['deepika-padukone', 'ranveer-singh', 'shahid-kapoor'],
    description: 'Deepika (5\'8.5"), Ranveer (5\'9.25"), Shahid (5\'7.5")'
  },
  {
    id: 'khans-kapoors',
    name: 'Khans & Kapoors',
    category: 'iconic',
    ids: ['saif-ali-khan', 'kareena-kapoor', 'ranbir-kapoor', 'alia-bhatt'],
    description: 'Saif (5\'7"), Kareena (5\'4"), Ranbir (5\'11"), Alia (5\'1.5")'
  },
  {
    id: 'golden-era',
    name: 'Golden Era Legends',
    category: 'iconic',
    ids: ['amitabh-bachchan', 'dharmendra', 'vinod-khanna', 'amrish-puri-mogambo'],
    description: 'Big B (6\'2"), Dharmendra (5\'8.5"), Vinod Khanna (6\'1"), Amrish Puri (6\'1")'
  },
  {
    id: 'pan-india-titans',
    name: 'Pan-India Titans',
    category: 'iconic',
    ids: ['prabhas', 'yash', 'allu-arjun', 'ram-charan'],
    description: 'Prabhas (6\'1"), Yash (5\'11"), Allu Arjun (5\'7.5"), Ram Charan (5\'7.5")'
  },
  {
    id: 'dhoom-rivals',
    name: 'Dhoom Franchise Rivals',
    category: 'action',
    ids: ['john-abraham', 'hrithik-roshan', 'aamir-khan', 'abhishek-bachchan'],
    description: 'John (5\'11.75"), Hrithik (5\'10.5"), Aamir (5\'5"), Abhishek (6\'1.5")'
  },
  {
    id: 'action-powerhouses',
    name: 'Action Powerhouses',
    category: 'action',
    ids: ['hrithik-roshan', 'tiger-shroff', 'akshay-kumar', 'john-abraham'],
    description: 'Hrithik (5\'10.5"), Tiger (5\'8.75"), Akshay (5\'10"), John (5\'11.75")'
  },
  {
    id: '90s-leading-men',
    name: 'The 90s Leading Men',
    category: 'action',
    ids: ['shah-rukh-khan', 'salman-khan', 'akshay-kumar', 'ajay-devgn'],
    description: 'SRK (5\'7"), Salman (5\'6.5"), Akshay (5\'10"), Ajay (5\'9")'
  },
  {
    id: 'modern-leading-men',
    name: 'Modern Leading Men',
    category: 'action',
    ids: ['ranbir-kapoor', 'ranveer-singh', 'kartik-aaryan', 'sidharth-malhotra', 'varun-dhawan'],
    description: 'Ranbir (5\'11"), Ranveer (5\'9.25"), Kartik (5\'10"), Sidharth (5\'11"), Varun (5\'7.25")'
  },
  {
    id: 'bollywood-giants',
    name: 'Bollywood 6ft+ Stars',
    category: 'stature',
    ids: ['kabir-bedi', 'rana-daggubati', 'sonu-sood', 'vicky-kaushal'],
    description: 'Kabir (6\'3"), Rana (6\'2.5"), Sonu (6\'2"), Vicky (6\'1")'
  },
  {
    id: 'tallest-giants',
    name: 'Tallest Bollywood Actors',
    category: 'stature',
    ids: ['arunoday-singh', 'nikitin-dheer', 'kabir-bedi', 'boman-irani'],
    description: 'Arunoday (6\'4"), Nikitin (6\'4"), Kabir (6\'3"), Boman (6\'2")'
  },
  {
    id: 'extreme-contrasts',
    name: 'Tallest vs Shortest',
    category: 'stature',
    ids: ['kabir-bedi', 'john-abraham', 'shah-rukh-khan', 'aamir-khan', 'rajpal-yadav'],
    description: 'Kabir (6\'3"), John (5\'11.75"), SRK (5\'7"), Aamir (5\'5"), Rajpal (5\'2")'
  },
  {
    id: 'deol-animal',
    name: 'Deol Family & Animal',
    category: 'cinema',
    ids: ['dharmendra', 'sunny-deol', 'bobby-deol', 'ranbir-kapoor'],
    description: 'Dharmendra (5\'8.5"), Sunny (5\'8.5"), Bobby (5\'11.75"), Ranbir (5\'11")'
  },
  {
    id: 'leading-actresses',
    name: 'Leading Actresses',
    category: 'cinema',
    ids: ['deepika-padukone', 'kriti-sanon', 'katrina-kaif', 'anushka-sharma', 'alia-bhatt'],
    description: 'Deepika (5\'8.5"), Kriti (5\'9.25"), Katrina (5\'8"), Anushka (5\'8"), Alia (5\'1.5")'
  },
  {
    id: 'comedy-legends',
    name: 'Cinema & Comedy Icons',
    category: 'cinema',
    ids: ['aamir-khan', 'salman-khan', 'paresh-rawal', 'govinda'],
    description: 'Aamir (5\'5"), Salman (5\'6.5"), Paresh (5\'8"), Govinda (5\'7.5")'
  },
  {
    id: 'method-masters',
    name: 'Method Acting Masters',
    category: 'cinema',
    ids: ['irrfan-khan', 'nawazuddin-siddiqui', 'manoj-bajpayee', 'pankaj-tripathi'],
    description: 'Irrfan (5\'11"), Nawazuddin (5\'6"), Manoj (5\'9"), Pankaj (5\'10")'
  },
  {
    id: 'ssr-contemporaries',
    name: 'Sushant & Contemporaries',
    category: 'cinema',
    ids: ['sushant-singh-rajput', 'rajkummar-rao', 'ayushmann-khurrana', 'vicky-kaushal'],
    description: 'SSR (5\'10.25"), Rajkummar (5\'7.5"), Ayushmann (5\'9"), Vicky (6\'1")'
  }
];

export function HeightComparisonStudio({
  selectedCelebrities,
  allCelebrities,
  onRemoveCelebrity,
  onAddCelebrity,
  unit,
  onSelectForDetails
}: HeightComparisonStudioProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'iconic' | 'action' | 'stature' | 'cinema'>('all');

  // Quick preset loader
  const loadPreset = (ids: string[]) => {
    selectedCelebrities.forEach(c => onRemoveCelebrity(c.id));
    ids.forEach(id => {
      const match = allCelebrities.find(c => c.id === id);
      if (match) onAddCelebrity(match);
    });
  };

  const filteredPresets = activeCategory === 'all'
    ? BOLLYWOOD_PRESETS
    : BOLLYWOOD_PRESETS.filter(p => p.category === activeCategory);

  // Check if current stage matches a preset exactly
  const isPresetActive = (ids: string[]) => {
    if (selectedCelebrities.length !== ids.length) return false;
    const currentIds = new Set(selectedCelebrities.map(c => c.id));
    return ids.every(id => currentIds.has(id));
  };

  // Scale calibration: 130 cm (bottom baseline) to 225 cm (top)
  const minCm = 130;
  const maxCm = 225;
  const rangeCm = maxCm - minCm;

  const getHeightPercent = (cm: number) => {
    const clamped = Math.max(minCm, Math.min(maxCm, cm));
    return ((clamped - minCm) / rangeCm) * 100;
  };

  // Ruler markers every 10 cm
  const rulerTicks = [140, 150, 160, 170, 180, 190, 200, 210, 220];

  return (
    <div className="space-y-6">
      
      {/* Compare Header & Quick Bollywood Presets */}
      <div className="bg-[#12141a] border border-[#232731] rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1f222b] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30">
                Bollywood Comparisons
              </span>
              <span className="text-xs font-mono text-neutral-400">
                18 Curated Lineups
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1 tracking-tight">
              Side-by-Side Height Compare
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Accurately scaled proportionally to verified barefoot measurements. Pick any curated Bollywood lineup below or add custom stars from the database.
            </p>
          </div>

          {/* Category Tabs for Presets */}
          <div className="flex items-center gap-1 bg-[#0d0e12] p-1 rounded-xl border border-[#1f222a] self-start sm:self-auto">
            {[
              { id: 'all', label: 'All (18)' },
              { id: 'iconic', label: 'Iconic (6)' },
              { id: 'action', label: 'Action & Eras (4)' },
              { id: 'stature', label: 'Extremes (3)' },
              { id: 'cinema', label: 'Cinema & Drama (5)' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-amber-500 text-black font-semibold shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 18 Bollywood Presets Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 pt-1">
          {filteredPresets.map((preset) => {
            const active = isPresetActive(preset.ids);
            return (
              <button
                key={preset.id}
                onClick={() => loadPreset(preset.ids)}
                className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between group ${
                  active
                    ? 'bg-amber-500/15 border-amber-500/60 shadow-sm'
                    : 'bg-[#161820] hover:bg-[#1f232c] border-[#252934] hover:border-[#383e4e]'
                }`}
                title={preset.description}
              >
                <div>
                  <div className={`text-xs font-semibold leading-tight line-clamp-1 transition-colors ${
                    active ? 'text-amber-300 font-bold' : 'text-neutral-200 group-hover:text-white'
                  }`}>
                    {preset.name}
                  </div>
                  <div className="text-[10px] text-neutral-400 truncate mt-0.5">
                    {preset.ids.length} stars
                  </div>
                </div>

                <div className="text-[9px] font-mono text-neutral-400 line-clamp-1 mt-1.5 pt-1.5 border-t border-[#20232c]">
                  {preset.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scaled Comparison Stage */}
      <div className="relative bg-[#0c0d10] border border-[#20232c] rounded-2xl p-6 sm:p-8 overflow-hidden">
        
        {/* Architectural Gridlines & Laser Ruler */}
        <div className="absolute inset-x-0 bottom-16 top-12 pointer-events-none">
          {rulerTicks.map((cm) => {
            const bottomPercent = getHeightPercent(cm);
            return (
              <div
                key={cm}
                className="absolute inset-x-0 flex items-center border-b border-[#1b1e26]"
                style={{ bottom: `${bottomPercent}%` }}
              >
                {/* Left Ruler Label */}
                <div className="w-16 pl-4 text-[10px] font-mono text-neutral-400 select-none">
                  {unit === 'metric' ? `${cm} cm` : cmToFeetInches(cm).text}
                </div>
                {/* Horizontal guide dashed line */}
                <div className="flex-1 border-b border-dashed border-[#181a22]" />
                {/* Right Ruler Label */}
                <div className="w-16 pr-4 text-right text-[10px] font-mono text-neutral-400 select-none">
                  {unit === 'imperial' ? `${cm} cm` : cmToFeetInches(cm).text}
                </div>
              </div>
            );
          })}
        </div>

        {/* Scaled Figures Container */}
        <div className="relative h-[480px] sm:h-[560px] flex items-end justify-around px-4 sm:px-12 pt-10 pb-16">
          
          {selectedCelebrities.length === 0 ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400">
              <Scale className="w-10 h-10 text-neutral-600 mb-2" />
              <p className="text-sm font-semibold text-neutral-300">Stage is currently empty</p>
              <p className="text-xs text-neutral-400 mt-1 max-w-sm">
                Click any of the 18 Bollywood lineups above or click "+ Compare" on any actor card in the database to start comparing.
              </p>
            </div>
          ) : (
            selectedCelebrities.map((celeb) => {
              const heightPct = getHeightPercent(celeb.realHeight.cm);
              const hasExaggeration = celeb.claimedHeight.cm > celeb.realHeight.cm + 1.2;

              return (
                <div
                  key={celeb.id}
                  className="relative flex flex-col items-center group select-none transition-all duration-300"
                  style={{ width: `${Math.max(14, 85 / selectedCelebrities.length)}%` }}
                >
                  {/* Floating Action & Height Pill */}
                  <div className="mb-2 text-center z-20 flex flex-col items-center">
                    
                    {/* Remove button */}
                    <button
                      onClick={() => onRemoveCelebrity(celeb.id)}
                      className="opacity-70 hover:opacity-100 p-1 rounded bg-[#1c1f26] hover:bg-red-950 hover:text-red-300 text-neutral-400 transition-colors mb-1 cursor-pointer"
                      title="Remove from compare stage"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>

                    {/* Real Height Pill */}
                    <div className="px-2 py-0.5 rounded text-[11px] font-mono font-bold tabular-nums bg-[#16181f] border border-[#2b303d] text-amber-400 whitespace-nowrap flex items-center gap-1">
                      <span>{formatHeight(celeb.realHeight.cm, unit)}</span>
                      <span className="text-[9px] font-mono text-neutral-400">real</span>
                    </div>

                    {/* Claimed badge indicator */}
                    {hasExaggeration && (
                      <div className="text-[10px] font-mono text-neutral-400 line-through mt-0.5">
                        Claims {formatHeight(celeb.claimedHeight.cm, unit)}
                      </div>
                    )}

                    <button
                      onClick={() => onSelectForDetails(celeb)}
                      className="text-xs font-semibold text-white hover:text-amber-400 mt-1 truncate max-w-[120px] transition-colors cursor-pointer"
                    >
                      {celeb.name}
                    </button>
                  </div>

                  {/* Scaled Silhouette & Real Photo Column */}
                  <div
                    className="relative w-full max-w-[115px] rounded-t-xl overflow-hidden bg-[#14161c] border-t-2 border-x border-[#272b36] shadow-xl flex flex-col justify-between group-hover:border-amber-500/60 transition-all duration-300"
                    style={{ height: `${heightPct * 4.2}px` }}
                  >
                    {/* Head photo section */}
                    <div className="relative aspect-square w-full overflow-hidden bg-black">
                      <img
                        src={celeb.image}
                        alt={celeb.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                          (e.target as HTMLElement).setAttribute('src', 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 24 24" fill="%2322262f"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/></svg>');
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#14161c] via-transparent to-transparent" />
                    </div>

                    {/* Scaled column base details */}
                    <div className="p-1.5 text-center bg-gradient-to-t from-black to-[#14161c]/80 flex flex-col justify-end flex-1">
                      <span className="text-[10px] text-neutral-400 truncate">
                        {celeb.knownFor.split(',')[0]}
                      </span>
                      {celeb.exaggerationDiffInches > 0.5 && (
                        <span className="text-[9px] font-mono text-red-400 bg-red-950/70 rounded px-1 py-0.5 mt-1 border border-red-800/40">
                          +{celeb.exaggerationDiffInches}" padding
                        </span>
                      )}
                    </div>

                    {/* Top alignment laser bar */}
                    <div className="absolute top-0 inset-x-0 h-0.5 bg-amber-400" />
                  </div>

                  <div className="mt-2 text-center">
                    <span className="text-[10px] font-mono text-neutral-400 uppercase">
                      {celeb.category}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Floor Line */}
        <div className="absolute bottom-16 inset-x-0 h-0.5 bg-[#2a2e3a]" />
        <div className="absolute bottom-8 inset-x-0 text-center text-[11px] font-mono text-neutral-400">
          Ground Level (0 cm Barefoot Baseline)
        </div>

      </div>

      {/* Delta Height Analysis Matrix */}
      {selectedCelebrities.length >= 2 && (
        <div className="bg-[#12141a] border border-[#232731] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <ArrowRightLeft className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Height Differences
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {selectedCelebrities.map((celebA, i) => {
              return selectedCelebrities.slice(i + 1).map((celebB) => {
                const diffCm = Math.abs(celebA.realHeight.cm - celebB.realHeight.cm);
                const diffIn = Math.round((diffCm / 2.54) * 10) / 10;
                const taller = celebA.realHeight.cm >= celebB.realHeight.cm ? celebA : celebB;
                const shorter = celebA.realHeight.cm < celebB.realHeight.cm ? celebA : celebB;
                const isIdentical = diffCm < 0.5;

                return (
                  <div
                    key={`${celebA.id}-${celebB.id}`}
                    className="p-3 rounded-xl bg-[#0f1116] border border-[#20232c] flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="text-xs font-semibold text-white">
                        {taller.name} vs {shorter.name}
                      </div>
                      <div className="text-[11px] text-neutral-400 mt-0.5">
                        {isIdentical ? (
                          <span className="text-emerald-400 font-mono">Identical barefoot height</span>
                        ) : (
                          <span>
                            <strong className="text-neutral-200">{taller.name}</strong> is{' '}
                            <span className="text-amber-400 font-mono font-bold">
                              {unit === 'imperial' ? `${diffIn} in` : `${Math.round(diffCm * 10) / 10} cm`}
                            </span>{' '}
                            taller
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right font-mono text-xs text-neutral-400 tabular-nums">
                      Δ {unit === 'imperial' ? `${diffIn}"` : `${Math.round(diffCm)}cm`}
                    </div>
                  </div>
                );
              });
            })}
          </div>
        </div>
      )}

    </div>
  );
}
