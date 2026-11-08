export type CelebrityCategory = 'actor' | 'actress' | 'musician' | 'athlete' | 'icon' | 'creator';
export type CelebrityIndustry = 'bollywood' | 'hollywood' | 'global';

export type ExaggerationLevel = 
  | 'honest'              // <= 0.5 inches (within measurement margin of error)
  | 'mild_exaggeration'  // 0.6 - 1.5 inches
  | 'major_exaggeration' // > 1.5 inches
  | 'understated';       // actually taller than claimed

export interface HeightData {
  cm: number;
  ftIn: string; // e.g. "5' 9\""
  formatted: string;
}

export interface Celebrity {
  id: string;
  name: string;
  category: CelebrityCategory;
  industry?: CelebrityIndustry;
  gender: 'male' | 'female';
  birthYear: number;
  nationality: string;
  knownFor: string;
  image: string;
  
  // Height metrics
  claimedHeight: {
    cm: number;
    ftIn: string;
    source: string; // e.g. "IMDb bio / Agency CV"
  };
  realHeight: {
    cm: number;
    ftIn: string;
    source: string; // e.g. "CelebHeights / Barefoot photographic proof"
  };
  peakHeight?: {
    cm: number;
    ftIn: string;
  };
  
  // Exaggeration stats
  exaggerationDiffCm: number; // claimed - real
  exaggerationDiffInches: number;
  exaggerationLevel: ExaggerationLevel;
  
  // Analysis & Proof
  shoeLifts: string; // notes on footwear / elevator shoes
  quote?: string;
  proofNotes: string;
  
  // External links
  imdbId?: string;
  imdbUrl?: string;
  celebHeightsUrl?: string;
  wikidataId?: string;
}

export interface CustomPerson {
  id: string;
  name: string;
  heightCm: number;
  gender: 'male' | 'female';
  isUser: boolean;
}

