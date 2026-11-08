import { Celebrity } from '@/types/celebrity';
import rawData from './massiveCelebrities.json';

export const ALL_CELEBRITIES = rawData as unknown as Celebrity[];
export const BOLLYWOOD_CELEBRITIES = ALL_CELEBRITIES.filter(c => c.industry === 'bollywood');
export const HOLLYWOOD_CELEBRITIES = ALL_CELEBRITIES.filter(c => c.industry === 'hollywood');
export const CELEBRITIES = HOLLYWOOD_CELEBRITIES;
