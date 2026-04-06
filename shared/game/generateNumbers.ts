import { MIN_NUMBER, MAX_NUMBER, NUMBER_COUNT } from './constants';

export function generateNumbers(rng: () => number = Math.random): number[] {
  return Array.from({ length: NUMBER_COUNT }, () =>
    Math.floor(rng() * (MAX_NUMBER - MIN_NUMBER + 1)) + MIN_NUMBER
  );
}
