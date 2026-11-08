// Utilities for height conversion, calculations and formatting

export function cmToFeetInches(cm: number): { feet: number; inches: number; text: string } {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const remainingInches = totalInches % 12;
  
  // Format with standard fraction or single decimal
  const roundedInches = Math.round(remainingInches * 2) / 2;
  let formattedInches = `${roundedInches}`;
  if (roundedInches % 1 === 0.5) {
    const whole = Math.floor(roundedInches);
    formattedInches = whole === 0 ? '½' : `${whole} ½`;
  }
  
  return {
    feet,
    inches: roundedInches,
    text: `${feet}' ${formattedInches}"`
  };
}

export function feetInchesToCm(feet: number, inches: number): number {
  return Math.round((feet * 12 + inches) * 2.54 * 10) / 10;
}

export function formatHeight(cm: number, unit: 'imperial' | 'metric'): string {
  if (unit === 'metric') {
    return `${Math.round(cm * 10) / 10} cm`;
  }
  return cmToFeetInches(cm).text;
}

export function calculateExaggeration(claimedCm: number, realCm: number) {
  const diffCm = Math.round((claimedCm - realCm) * 10) / 10;
  const diffInches = Math.round((diffCm / 2.54) * 10) / 10;
  
  let level: 'honest' | 'mild_exaggeration' | 'major_exaggeration' | 'understated';
  if (diffInches > 1.5) {
    level = 'major_exaggeration';
  } else if (diffInches > 0.4) {
    level = 'mild_exaggeration';
  } else if (diffInches < -0.4) {
    level = 'understated';
  } else {
    level = 'honest';
  }
  
  return {
    diffCm,
    diffInches,
    level,
  };
}

export function getExaggerationBadge(level: 'honest' | 'mild_exaggeration' | 'major_exaggeration' | 'understated', diffInches: number) {
  switch (level) {
    case 'major_exaggeration':
      return {
        label: `+${diffInches}" Inflated`,
        text: 'Major Exaggeration',
        bg: 'bg-red-500/15 text-red-400 border-red-500/30',
        badgeBg: 'bg-red-500',
        color: 'text-red-400',
        dot: 'bg-red-500'
      };
    case 'mild_exaggeration':
      return {
        label: `+${diffInches}" Claimed`,
        text: 'Slightly Inflated',
        bg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
        badgeBg: 'bg-amber-500',
        color: 'text-amber-400',
        dot: 'bg-amber-500'
      };
    case 'understated':
      return {
        label: `${diffInches}" Modest`,
        text: 'Understated',
        bg: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
        badgeBg: 'bg-blue-500',
        color: 'text-blue-400',
        dot: 'bg-blue-500'
      };
    case 'honest':
    default:
      return {
        label: '100% Verified',
        text: 'Honest Listing',
        bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
        badgeBg: 'bg-emerald-500',
        color: 'text-emerald-400',
        dot: 'bg-emerald-500'
      };
  }
}

