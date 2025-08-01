import { baseStats } from './baseStats.js';

export function getBaseStats(tier, type) {
  const tierKey = tier; // e.g., "tier_10"
  const typeKey = type.toLowerCase(); // e.g., "frigates"

  if (baseStats[typeKey] && baseStats[typeKey][tierKey]) {
    return baseStats[typeKey][tierKey];
  } else {
    throw new Error(`Stats not found for type "${typeKey}" and tier "${tierKey}"`);
  }
}