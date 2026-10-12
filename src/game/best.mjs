export const BEST_KEY = "portfolio-runner-best";

export function loadBest(storage) {
  if (!storage) return 0;
  try {
    const value = Number(storage.getItem(BEST_KEY));
    return Number.isSafeInteger(value) && value > 0 ? value : 0;
  } catch {
    return 0;
  }
}

export function saveBest(storage, value) {
  if (!storage) return false;
  try {
    storage.setItem(BEST_KEY, String(Math.floor(value)));
    return true;
  } catch {
    return false;
  }
}
