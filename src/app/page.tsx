'use client';

import React, { useState, useMemo } from 'react';
import { ALL_CELEBRITIES } from '@/data/celebrities';
import { Celebrity, CelebrityCategory, CelebrityIndustry } from '@/types/celebrity';
import { Navbar } from '@/components/Navbar';
import { CelebrityCard } from '@/components/CelebrityCard';
import { CelebrityTable } from '@/components/CelebrityTable';
import { HeightComparisonStudio } from '@/components/HeightComparisonStudio';
import { CelebrityDetailModal } from '@/components/CelebrityDetailModal';
import { TruthMeterLeaderboard } from '@/components/TruthMeterLeaderboard';
import { 
  Search, 
  Filter, 
  Scale, 
  ArrowUpDown, 
  Globe2, 
  RefreshCw,
  X,
  LayoutGrid,
  List
} from 'lucide-react';

export default function Home() {
  // Navigation & View state
  const [activeTab, setActiveTab] = useState<'explore' | 'compare' | 'leaderboard'>('explore');
  const [unit, setUnit] = useState<'imperial' | 'metric'>('imperial');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<CelebrityIndustry | 'all'>('bollywood');
  const [selectedCategory, setSelectedCategory] = useState<CelebrityCategory | 'all'>('all');
  const [exaggerationFilter, setExaggerationFilter] = useState<'all' | 'inflated' | 'honest' | 'short_kings' | 'giants'>('all');
  const [sortBy, setSortBy] = useState<'real_desc' | 'real_asc' | 'exaggeration_desc' | 'name'>('exaggeration_desc');
  const [visibleCount, setVisibleCount] = useState(36);
  
  // Height Range limits (in cm)
  const [minHeightCm] = useState(140);
  const [maxHeightCm] = useState(220);

  // Reset visible count when filters change
  React.useEffect(() => {
    setVisibleCount(36);
  }, [selectedIndustry, searchQuery, selectedCategory, exaggerationFilter, sortBy]);

  // Selected for comparison in studio (default with SRK, Salman, Big B, and Deepika)
  const [selectedForCompare, setSelectedForCompare] = useState<Celebrity[]>(() => {
    return ALL_CELEBRITIES.filter(c => ['shah-rukh-khan', 'salman-khan', 'amitabh-bachchan', 'deepika-padukone'].includes(c.id));
  });

  // Selected for detail modal
  const [inspectCelebrity, setInspectCelebrity] = useState<Celebrity | null>(null);

  // Live IMDb / Wikidata search state for unlisted celebrities
  const [isLiveSearching, setIsLiveSearching] = useState(false);
  const [liveSearchResults, setLiveSearchResults] = useState<Celebrity[]>([]);

  // Toggle unit
  const handleToggleUnit = () => {
    setUnit(prev => (prev === 'imperial' ? 'metric' : 'imperial'));
  };

  // Toggle compare list
  const handleToggleCompare = (celeb: Celebrity) => {
    setSelectedForCompare(prev => {
      const exists = prev.some(c => c.id === celeb.id);
      if (exists) {
        return prev.filter(c => c.id !== celeb.id);
      }
      if (prev.length >= 6) {
        alert('You can compare up to 6 public figures at a time on stage.');
        return prev;
      }
      return [...prev, celeb];
    });
  };

  const handleRemoveFromCompare = (id: string) => {
    setSelectedForCompare(prev => prev.filter(c => c.id !== id));
  };

  const handleAddToCompare = (celeb: Celebrity) => {
    if (!selectedForCompare.some(c => c.id === celeb.id)) {
      if (selectedForCompare.length >= 6) {
        alert('You can compare up to 6 public figures at a time on stage.');
        return;
      }
      setSelectedForCompare(prev => [...prev, celeb]);
    }
  };

  // Filter & Sort computation
  const filteredCelebrities = useMemo(() => {
    let list = [...ALL_CELEBRITIES];

    // Industry filter
    if (selectedIndustry !== 'all') {
      list = list.filter(c => c.industry === selectedIndustry);
    }

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(c => 
        c.name.toLowerCase().includes(q) ||
        c.knownFor.toLowerCase().includes(q) ||
        c.nationality.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      list = list.filter(c => c.category === selectedCategory);
    }

    // Exaggeration / Persona filter
    if (exaggerationFilter === 'inflated') {
      list = list.filter(c => c.exaggerationDiffInches >= 1.0);
    } else if (exaggerationFilter === 'honest') {
      list = list.filter(c => c.exaggerationDiffInches <= 0.3);
    } else if (exaggerationFilter === 'short_kings') {
      list = list.filter(c => c.realHeight.cm <= 172);
    } else if (exaggerationFilter === 'giants') {
      list = list.filter(c => c.realHeight.cm >= 185);
    }

    // Height range
    list = list.filter(c => c.realHeight.cm >= minHeightCm && c.realHeight.cm <= maxHeightCm);

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'real_desc') return b.realHeight.cm - a.realHeight.cm;
      if (sortBy === 'real_asc') return a.realHeight.cm - b.realHeight.cm;
      if (sortBy === 'exaggeration_desc') return b.exaggerationDiffCm - a.exaggerationDiffCm;
      return a.name.localeCompare(b.name);
    });

    return list;
  }, [selectedIndustry, searchQuery, selectedCategory, exaggerationFilter, sortBy, minHeightCm, maxHeightCm]);

  // Handler for live IMDb lookup if query has no matches
  const handleLiveLookup = async () => {
    if (!searchQuery.trim()) return;
    setIsLiveSearching(true);
    setLiveSearchResults([]);
    try {
      const res = await fetch(`/api/search-celebrity?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        setLiveSearchResults(data.results);
      } else {
        alert(`No live IMDb records found for "${searchQuery}".`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLiveSearching(false);
    }
  };

  const bollywoodCount = useMemo(() => ALL_CELEBRITIES.filter(c => c.industry === 'bollywood').length, []);
  const hollywoodCount = useMemo(() => ALL_CELEBRITIES.filter(c => c.industry === 'hollywood').length, []);

  return (
    <div className="min-h-screen bg-[#0d0e11] text-neutral-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      
      {/* Top Navbar */}
      <Navbar
        unit={unit}
        onToggleUnit={handleToggleUnit}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        compareCount={selectedForCompare.length}
        onOpenCompare={() => setActiveTab('compare')}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {/* VIEW 1: DATABASE & EXPLORE */}
        {activeTab === 'explore' && (
          <div className="space-y-8">
            
            {/* Simple, Direct Header */}
            <div className="text-center max-w-3xl mx-auto space-y-3 pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16181f] border border-[#232730] text-neutral-400 text-xs font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span>Database</span>
                <span className="text-neutral-600">•</span>
                <span className="text-neutral-300 font-semibold">{ALL_CELEBRITIES.length} Stars</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                {selectedIndustry === 'bollywood'
                  ? 'Real Height of Bollywood Stars'
                  : selectedIndustry === 'hollywood'
                  ? 'Real Height of Hollywood Stars'
                  : 'Real Height of Celebrities'}
              </h1>

              <p className="text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed">
                The actual heights of actors compared to what they claim. See real barefoot heights and shoe lifts.
              </p>

              {/* Segmented Industry Switcher */}
              <div className="inline-flex items-center p-1 rounded-xl bg-[#14161c] border border-[#232730] text-xs font-medium mt-2">
                <button
                  onClick={() => setSelectedIndustry('bollywood')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                    selectedIndustry === 'bollywood'
                      ? 'bg-amber-500 text-black shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Bollywood ({bollywoodCount})
                </button>
                <button
                  onClick={() => setSelectedIndustry('hollywood')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                    selectedIndustry === 'hollywood'
                      ? 'bg-amber-500 text-black shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Hollywood & International ({hollywoodCount})
                </button>
                <button
                  onClick={() => setSelectedIndustry('all')}
                  className={`px-3 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                    selectedIndustry === 'all'
                      ? 'bg-[#232732] text-white'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  All ({ALL_CELEBRITIES.length})
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto pt-2">
                <div className="relative flex items-center">
                  <Search className="absolute left-4 w-4 h-4 text-neutral-400 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleLiveLookup();
                    }}
                    placeholder="Search by name, title, or nationality (e.g. Shah Rukh Khan, Salman, Big B, Kabir Bedi)..."
                    className="w-full pl-11 pr-28 py-3 bg-[#13151a] border border-[#252933] focus:border-amber-500 rounded-xl text-white placeholder-neutral-500 text-sm focus:outline-none transition-colors"
                  />
                  <div className="absolute right-2 flex items-center gap-1.5">
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#1f222b] transition-colors cursor-pointer"
                        title="Clear search"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={handleLiveLookup}
                      disabled={isLiveSearching}
                      className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
                    >
                      {isLiveSearching ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <>
                          <Search className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Search</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Popular Quick-Search Suggestions */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2.5 text-xs text-neutral-400">
                  <span className="text-neutral-400 font-mono text-[11px]">Core Bollywood:</span>
                  {[
                    'Sushant Singh Rajput',
                    'Shah Rukh Khan',
                    'Salman Khan',
                    'Amitabh Bachchan',
                    'Aamir Khan',
                    'Deepika Padukone',
                    'Hrithik Roshan',
                    'Ranbir Kapoor',
                    'Vicky Kaushal',
                    'Kabir Bedi'
                  ].map((star) => (
                    <button
                      key={star}
                      onClick={() => setSearchQuery(star)}
                      className="px-2 py-0.5 rounded bg-[#16181f] hover:bg-[#20232c] text-neutral-300 hover:text-white border border-[#232730] transition-colors text-[11px] cursor-pointer"
                    >
                      {star}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Filter Bar & Category Chips */}
            <div className="bg-[#121419] border border-[#20232b] rounded-2xl p-4 sm:p-5 space-y-4">
              
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                
                {/* Category Pills */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { id: 'all', label: 'All Categories' },
                    { id: 'actor', label: 'Actors' },
                    { id: 'actress', label: 'Actresses' },
                    { id: 'musician', label: 'Musicians' },
                    { id: 'athlete', label: 'Athletes' },
                    { id: 'creator', label: 'Directors & Creators' },
                    { id: 'icon', label: 'Legends & TV' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        selectedCategory === cat.id
                          ? 'bg-amber-500 text-black font-semibold'
                          : 'bg-[#181a21] hover:bg-[#20232c] text-neutral-300 hover:text-white border border-[#272b36]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Controls: View Mode & Sort Dropdown */}
                <div className="flex items-center gap-3 self-end lg:self-auto">
                  
                  {/* View Mode Switcher: Cards vs Table */}
                  <div className="flex items-center p-1 rounded-lg bg-[#181a21] border border-[#262934]">
                    <button
                      onClick={() => setViewMode('cards')}
                      className={`p-1.5 rounded transition-all cursor-pointer ${
                        viewMode === 'cards'
                          ? 'bg-[#272b37] text-white shadow-sm'
                          : 'text-neutral-400 hover:text-neutral-200'
                      }`}
                      title="Dossier Card View"
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('table')}
                      className={`p-1.5 rounded transition-all cursor-pointer ${
                        viewMode === 'table'
                          ? 'bg-[#272b37] text-white shadow-sm'
                          : 'text-neutral-400 hover:text-neutral-200'
                      }`}
                      title="Data Table View"
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Sort Dropdown */}
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-[#181a21] border border-[#262934] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer font-medium"
                    >
                      <option value="exaggeration_desc">Largest Discrepancy</option>
                      <option value="real_desc">Tallest to Shortest (Real)</option>
                      <option value="real_asc">Shortest to Tallest (Real)</option>
                      <option value="name">Alphabetical (A - Z)</option>
                    </select>
                  </div>

                </div>

              </div>

              {/* Second row of filters: Exaggeration & Stature filters */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#1d2028]">
                
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-neutral-400 font-mono flex items-center gap-1">
                    <Filter className="w-3 h-3" /> Filter:
                  </span>
                  <button
                    onClick={() => setExaggerationFilter('all')}
                    className={`px-2.5 py-1 rounded-md text-xs font-mono transition-all cursor-pointer ${
                      exaggerationFilter === 'all'
                        ? 'bg-[#252934] text-white'
                        : 'bg-[#181a21] text-neutral-400 hover:text-neutral-200 border border-[#232731]'
                    }`}
                  >
                    All Records
                  </button>
                  <button
                    onClick={() => setExaggerationFilter('inflated')}
                    className={`px-2.5 py-1 rounded-md text-xs font-mono transition-all cursor-pointer ${
                      exaggerationFilter === 'inflated'
                        ? 'bg-red-950/80 text-red-300 border border-red-800'
                        : 'bg-[#181a21] text-neutral-400 hover:text-neutral-200 border border-[#232731]'
                    }`}
                  >
                    Exaggerated (+1"+)
                  </button>
                  <button
                    onClick={() => setExaggerationFilter('honest')}
                    className={`px-2.5 py-1 rounded-md text-xs font-mono transition-all cursor-pointer ${
                      exaggerationFilter === 'honest'
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                        : 'bg-[#181a21] text-neutral-400 hover:text-neutral-200 border border-[#232731]'
                    }`}
                  >
                    Accurate (±0.3")
                  </button>
                  <button
                    onClick={() => setExaggerationFilter('short_kings')}
                    className={`px-2.5 py-1 rounded-md text-xs font-mono transition-all cursor-pointer ${
                      exaggerationFilter === 'short_kings'
                        ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                        : 'bg-[#181a21] text-neutral-400 hover:text-neutral-200 border border-[#232731]'
                    }`}
                  >
                    Under 5'8"
                  </button>
                  <button
                    onClick={() => setExaggerationFilter('giants')}
                    className={`px-2.5 py-1 rounded-md text-xs font-mono transition-all cursor-pointer ${
                      exaggerationFilter === 'giants'
                        ? 'bg-blue-950/80 text-blue-300 border border-blue-800'
                        : 'bg-[#181a21] text-neutral-400 hover:text-neutral-200 border border-[#232731]'
                    }`}
                  >
                    6'0"+ Tall
                  </button>
                </div>

                <div className="text-xs font-mono text-neutral-400">
                  Showing <span className="text-white font-bold">{filteredCelebrities.length}</span> {selectedIndustry === 'bollywood' ? 'Bollywood' : selectedIndustry === 'hollywood' ? 'Hollywood' : ''} stars
                </div>

              </div>

            </div>

            {/* Live IMDb / Wikidata Search Results Banner if present */}
            {liveSearchResults.length > 0 && (
              <div className="bg-[#171a22] border border-amber-500/40 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe2 className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-bold text-white">
                      Live External Lookups for "{searchQuery}"
                    </h3>
                  </div>
                  <button
                    onClick={() => setLiveSearchResults([])}
                    className="text-xs text-neutral-400 hover:text-white cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {liveSearchResults.map((celeb) => (
                    <CelebrityCard
                      key={celeb.id}
                      celebrity={celeb}
                      unit={unit}
                      onSelect={(c) => setInspectCelebrity(c)}
                      onToggleCompare={handleToggleCompare}
                      isComparing={selectedForCompare.some(c => c.id === celeb.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Celebrity Records: Grid or Table */}
            {filteredCelebrities.length === 0 ? (
              <div className="text-center py-16 bg-[#121419] rounded-2xl border border-[#20232b] p-8">
                <p className="text-base font-semibold text-white">No records match current parameters</p>
                <p className="text-xs text-neutral-400 mt-1 max-w-md mx-auto">
                  Try clearing your search query or execute an external lookup to scan live IMDb and Wikidata records.
                </p>
                <div className="mt-4 flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setExaggerationFilter('all');
                      setSelectedIndustry('all');
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-[#1c1f27] hover:bg-[#262a34] text-white text-xs font-medium cursor-pointer transition-colors"
                  >
                    Reset Filters
                  </button>
                  <button
                    onClick={handleLiveLookup}
                    disabled={isLiveSearching || !searchQuery.trim()}
                    className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Search External Archives</span>
                  </button>
                </div>
              </div>
            ) : viewMode === 'table' ? (
              <div className="space-y-6">
                <CelebrityTable
                  celebrities={filteredCelebrities.slice(0, visibleCount)}
                  unit={unit}
                  onSelect={(c) => setInspectCelebrity(c)}
                  onToggleCompare={handleToggleCompare}
                  isComparing={(id) => selectedForCompare.some(c => c.id === id)}
                />

                {visibleCount < filteredCelebrities.length && (
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => setVisibleCount(prev => prev + 36)}
                      className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs transition-all cursor-pointer shadow-sm"
                    >
                      Load More Rows (Showing {Math.min(visibleCount, filteredCelebrities.length)} of {filteredCelebrities.length})
                    </button>
                    <button
                      onClick={() => setVisibleCount(filteredCelebrities.length)}
                      className="px-4 py-2.5 rounded-xl bg-[#16181f] hover:bg-[#20232c] text-neutral-400 hover:text-white border border-[#232730] text-xs font-mono transition-colors cursor-pointer"
                    >
                      Show All {filteredCelebrities.length}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filteredCelebrities.slice(0, visibleCount).map((celeb) => (
                    <CelebrityCard
                      key={celeb.id}
                      celebrity={celeb}
                      unit={unit}
                      onSelect={(c) => setInspectCelebrity(c)}
                      onToggleCompare={handleToggleCompare}
                      isComparing={selectedForCompare.some(c => c.id === celeb.id)}
                    />
                  ))}
                </div>

                {/* Progressive Loading / Show More */}
                {visibleCount < filteredCelebrities.length && (
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 pb-2">
                    <button
                      onClick={() => setVisibleCount(prev => prev + 36)}
                      className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs transition-all cursor-pointer shadow-sm"
                    >
                      Load Next 36 (Showing {Math.min(visibleCount, filteredCelebrities.length)} of {filteredCelebrities.length})
                    </button>
                    <button
                      onClick={() => setVisibleCount(filteredCelebrities.length)}
                      className="px-4 py-2.5 rounded-xl bg-[#16181f] hover:bg-[#20232c] text-neutral-400 hover:text-white border border-[#232730] text-xs font-mono transition-colors cursor-pointer"
                    >
                      Show All {filteredCelebrities.length}
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

        {/* VIEW 2: HEIGHT COMPARISON STUDIO */}
        {activeTab === 'compare' && (
          <HeightComparisonStudio
            selectedCelebrities={selectedForCompare}
            allCelebrities={ALL_CELEBRITIES}
            onRemoveCelebrity={handleRemoveFromCompare}
            onAddCelebrity={handleAddToCompare}
            unit={unit}
            onSelectForDetails={(c) => setInspectCelebrity(c)}
          />
        )}

        {/* VIEW 3: DISCREPANCY INDEX */}
        {activeTab === 'leaderboard' && (
          <TruthMeterLeaderboard
            allCelebrities={ALL_CELEBRITIES}
            unit={unit}
            onSelectCelebrity={(c) => setInspectCelebrity(c)}
            onCompareCelebrity={handleAddToCompare}
          />
        )}

      </main>

      {/* Floating Studio Comparison Bar (Bottom of screen) */}
      {selectedForCompare.length > 0 && activeTab !== 'compare' && (
        <div className="fixed bottom-6 inset-x-0 z-40 flex justify-center px-4 pointer-events-none">
          <div className="pointer-events-auto bg-[#14161c]/95 border border-[#2a2e3a] rounded-xl p-3 sm:px-4 sm:py-3 shadow-2xl backdrop-blur-xl flex items-center justify-between gap-4 max-w-lg w-full">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-black flex items-center justify-center font-bold">
                <Scale className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <span>Compare Lineup ({selectedForCompare.length})</span>
                </div>
                <div className="text-[11px] font-mono text-neutral-400 truncate max-w-[180px] sm:max-w-xs">
                  {selectedForCompare.map(c => c.name.split(' ')[0]).join(', ')}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedForCompare([])}
                className="px-2.5 py-1 text-xs text-neutral-400 hover:text-white cursor-pointer"
              >
                Clear
              </button>
              <button
                onClick={() => setActiveTab('compare')}
                className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              >
                <span>Launch Compare</span>
                <Scale className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <CelebrityDetailModal
        celebrity={inspectCelebrity}
        onClose={() => setInspectCelebrity(null)}
        unit={unit}
        onToggleCompare={handleToggleCompare}
        isComparing={inspectCelebrity ? selectedForCompare.some(c => c.id === inspectCelebrity.id) : false}
      />

      {/* Clean Human-Made Editorial Footer */}
      <footer className="mt-20 border-t border-[#1d2028] bg-[#0b0c0e] py-8 text-neutral-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-amber-500 flex items-center justify-center text-black font-black text-[11px]">
              R
            </div>
            <span className="font-semibold text-neutral-200">Real Heights</span>
            <span className="font-mono text-[10px] text-neutral-400">v2.4</span>
          </div>

          <p className="text-center sm:text-left text-neutral-400 text-[11px]">
            Based on CelebHeights archives, verified measurements, and footwear notes.
          </p>

          <div className="flex items-center gap-3 font-mono text-[11px] text-neutral-400">
            <span>1,007 Stars Cataloged</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
