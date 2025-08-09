// Add 1 + percentage
export function addedPercent(value) {
  return 1 + (value / 100);
}

// Calculate total output (damage per attack) and cooldown time (ms)
export function totalOutputAndTime(rowPercent, baseStat) {
  const totalOutput =
    addedPercent(rowPercent.attack + rowPercent.weapon_attack) *
    baseStat.attack_per_hit *
    baseStat.attack_bonus *
    addedPercent(rowPercent.final_attack);

  const timeMs = baseStat.cooldown * 1000;
  return [totalOutput, timeMs];
}

// Calculate armor-based damage reduction coefficient
export function calcArmor(rowPercent, baseStat, bonus = 0) {
  const armorScaled = addedPercent(rowPercent.armor + bonus) * baseStat.armor;
  return armorScaled
}

export function calcArmorDamageReduction(armor) {
  const armorCoef = (12000 + armor) / 12000;
  return armorCoef;
}

// Calculate general damage reduction coefficient
export function calcDamageReduction(row) {
  return addedPercent(row.damage_reduction);
}

// Apply ocean buff (adds bonus stats)
export function ocean(stats) {
  const statIncrease = {
    attack: 300,
    hp: 300,
    armor: 300,
    shield: 300,
    final_attack: 30,
    damage_reduction: 30,
  };

  const newStats = { ...stats };
  for (const stat in statIncrease) {
    newStats[stat] = (newStats[stat] || 0) + statIncrease[stat];
  }

  return newStats;
}

// Remove ocean buff (subtracts stats)
export function exitOcean(stats) {
  const statIncrease = {
    attack: -300,
    hp: -300,
    armor: -300,
    shield: -300,
    final_attack: -30,
    damage_reduction: -30,
  };

  const newStats = { ...stats };
  for (const stat in statIncrease) {
    newStats[stat] = (newStats[stat] || 0) + statIncrease[stat];
  }

  return newStats;
}