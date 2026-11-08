import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ALL_CELEBRITIES } from '@/data/celebrities';
import { formatHeight, getExaggerationBadge } from '@/lib/heightUtils';
import { Award, ShieldAlert, Ruler, Sparkles, Info, ArrowLeft, ExternalLink, Scale } from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

// Pre-generate static params for top 150 celebrities at build time, render others on-demand
export function generateStaticParams() {
  return ALL_CELEBRITIES.slice(0, 150).map(c => ({
    id: c.id,
  }));
}

// Dynamic Server-Side Rendering (SSR) metadata generation
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const celeb = ALL_CELEBRITIES.find(c => c.id === id);

  if (!celeb) {
    return {
      title: 'Dossier Not Found | Stature Archive',
    };
  }

  const realFt = formatHeight(celeb.realHeight.cm, 'imperial');
  const claimedFt = formatHeight(celeb.claimedHeight.cm, 'imperial');

  return {
    title: `${celeb.name} Real Barefoot Height — ${realFt} (${celeb.realHeight.cm} cm) | Stature Archive`,
    description: `How tall is ${celeb.name} really? Verified barefoot height is ${realFt} (${celeb.realHeight.cm} cm) vs billed agency claim of ${claimedFt}. Read photographic proof, shoe lift breakdown & co-star calibrations.`,
    openGraph: {
      title: `${celeb.name}: Verified Barefoot Stature vs Billed Claim`,
      description: `Barefoot Real: ${realFt} vs Billed: ${claimedFt}. ${celeb.proofNotes}`,
      images: [
        {
          url: celeb.image,
          alt: celeb.name,
        },
      ],
    },
  };
}

// Server Component: Fully Server-Side Rendered (SSR)
export default async function CelebrityPage({ params }: Props) {
  const { id } = await params;
  const celeb = ALL_CELEBRITIES.find(c => c.id === id);

  if (!celeb) {
    notFound();
  }

  const badge = getExaggerationBadge(celeb.exaggerationLevel, celeb.exaggerationDiffInches);
  const realFt = formatHeight(celeb.realHeight.cm, 'imperial');
  const realCm = `${celeb.realHeight.cm} cm`;
  const claimedFt = formatHeight(celeb.claimedHeight.cm, 'imperial');
  const claimedCm = `${celeb.claimedHeight.cm} cm`;
  const peakFt = celeb.peakHeight ? formatHeight(celeb.peakHeight.cm, 'imperial') : null;

  return (
    <div className="min-h-screen bg-[#0d0e11] text-neutral-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#0d0e11]/90 border-b border-[#20232c] px-4 sm:px-8 h-14 flex items-center justify-between">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-neutral-300 hover:text-white transition-colors text-xs font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
          <span>Back to Database</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#181a21] text-amber-400 border border-[#2b303d]">
            Archival Dossier
          </span>
          <span className="text-[11px] font-mono text-neutral-400 hidden sm:inline">ID: {celeb.id}</span>
        </div>
      </header>

      {/* Main Server-Rendered Content */}
      <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
        
        {/* Banner with Real Portrait */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-2xl overflow-hidden bg-[#14161c] border border-[#232731] shadow-2xl">
          <img
            src={celeb.image}
            alt={celeb.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-top"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e11] via-[#0d0e11]/60 to-transparent" />

          <div className="absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-6 sm:right-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-[#1d2029] text-neutral-300 border border-[#2c303c]">
                {celeb.industry === 'bollywood' ? 'Bollywood' : 'Hollywood'} • {celeb.category}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${badge.bg}`}>
                {badge.label}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
              {celeb.name}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 mt-0.5">
              {celeb.knownFor} • Born {celeb.birthYear} ({celeb.nationality})
            </p>
          </div>
        </div>

        {/* Height Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          
          {/* Real Barefoot */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#13151b] border border-[#232731]">
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              <span>Verified Barefoot Height</span>
            </div>
            <div className="text-3xl font-black font-mono tabular-nums text-white mt-1.5">
              {realFt}
            </div>
            <div className="text-xs font-mono text-neutral-400 mt-0.5">
              {realCm}
            </div>
            <div className="text-[11px] text-neutral-400 mt-2 font-mono">
              Source: {celeb.realHeight.source}
            </div>
          </div>

          {/* Claimed Height */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#13151b] border border-[#232731]">
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Billed Agency Listing</span>
            </div>
            <div className="text-3xl font-bold font-mono tabular-nums text-neutral-400 mt-1.5 line-through decoration-neutral-600">
              {claimedFt}
            </div>
            <div className="text-xs font-mono text-neutral-400 mt-0.5">
              {claimedCm}
            </div>
            <div className="text-[11px] text-neutral-400 mt-2 font-mono">
              Source: {celeb.claimedHeight.source}
            </div>
          </div>

          {/* Discrepancy & Peak */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#13151b] border border-[#232731]">
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider">
              <Ruler className="w-3.5 h-3.5" />
              <span>Stature Discrepancy</span>
            </div>
            <div className={`text-3xl font-black font-mono tabular-nums mt-1.5 ${celeb.exaggerationDiffInches > 0.5 ? 'text-red-400' : 'text-emerald-400'}`}>
              {celeb.exaggerationDiffInches > 0 ? `+${celeb.exaggerationDiffInches}"` : '0"'}
            </div>
            <div className="text-xs font-mono text-neutral-400 mt-0.5">
              {celeb.exaggerationDiffCm > 0 ? `+${celeb.exaggerationDiffCm} cm padding` : 'Unembellished match'}
            </div>
            <div className="text-[11px] text-neutral-400 mt-2 font-mono">
              {peakFt ? `Peak Stature: ${peakFt}` : 'Consistent stature'}
            </div>
          </div>

        </div>

        {/* Shoe Lifts & Footwear Breakdown */}
        <div className="bg-[#12141a] rounded-2xl p-5 border border-[#20232c] space-y-2">
          <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Footwear & Elevator Shoe Analysis</span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            {celeb.shoeLifts}
          </p>
        </div>

        {/* Photographic Proof & Co-Star Calibrations */}
        <div className="bg-[#12141a] rounded-2xl p-5 border border-[#20232c] space-y-2">
          <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-neutral-300 uppercase tracking-wider">
            <Info className="w-3.5 h-3.5 text-amber-400" />
            <span>Photographic Evidence & Film Calibrations</span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            {celeb.proofNotes}
          </p>
        </div>

        {/* Famous Quote */}
        {celeb.quote && (
          <div className="p-5 rounded-2xl bg-[#141720] border-l-2 border-amber-500 text-xs sm:text-sm italic text-amber-200/90 leading-relaxed font-serif">
            "{celeb.quote}"
          </div>
        )}

        {/* External References & Action */}
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#1e222a]">
          <div className="flex items-center gap-2">
            {celeb.imdbUrl && (
              <a
                href={celeb.imdbUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-[#181a21] hover:bg-[#222530] text-neutral-300 hover:text-white border border-[#262a35] text-xs font-mono flex items-center gap-1.5 transition-colors"
              >
                <span>IMDb Archive</span>
                <ExternalLink className="w-3 h-3 text-neutral-400" />
              </a>
            )}
            {celeb.celebHeightsUrl && (
              <a
                href={celeb.celebHeightsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-[#181a21] hover:bg-[#222530] text-neutral-300 hover:text-white border border-[#262a35] text-xs font-mono flex items-center gap-1.5 transition-colors"
              >
                <span>CelebHeights Dossier</span>
                <ExternalLink className="w-3 h-3 text-neutral-400" />
              </a>
            )}
          </div>

          <Link
            href="/"
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Compare on Scale Stage</span>
          </Link>
        </div>

      </main>

    </div>
  );
}
