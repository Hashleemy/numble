import { MIN_TARGET, MAX_TARGET } from './constants';

export function generateTarget(rng: () => number = Math.random): number {
  return Math.floor(rng() * (MAX_TARGET - MIN_TARGET + 1)) + MIN_TARGET;
}
