import { findFinalScore, Fleet, doBattle } from './simulation.js';

export function optimize(consoleLog, graph, gtype, f1BaseStat, f1Stats, statIncrease, basicBaseStat, basicFleetStat, startingLeadership = 1) {
  const baseScore = findFinalScore(f1BaseStat, f1Stats, basicFleetStat, basicBaseStat, 1.1, startingLeadership, graph, gtype);
  logToConsole(consoleLog, 'base score: ' + baseScore);

  for (const stat in statIncrease) {
    const newStats = { ...f1Stats };
    newStats[stat] += statIncrease[stat];
    const score = findFinalScore(f1BaseStat, newStats, basicFleetStat, basicBaseStat, 1.1, baseScore);
    const scoreDiff = score - baseScore;
    logToConsole(consoleLog, `${stat} +${statIncrease[stat]} gives +${scoreDiff} score`);
  }
}

export function compareStats(consoleLog, graph, gtype, f1BaseStat, f1Stats, statsChanges, basicBaseStat, basicFleetStat, startingLeadership = 1) {
  const baseScore = findFinalScore(f1BaseStat, f1Stats, basicFleetStat, basicBaseStat, 1.1, startingLeadership, graph, gtype);
  logToConsole(consoleLog, 'base score: ' + baseScore);

  statsChanges.forEach((change, i) => {
    const { fleetstat: deltaFleetStat = {}, fleetbasestat: deltaFleetBaseStat = {} } = change;
    logToConsole(consoleLog, `--- Setup ${i + 1} ---`);

    // Deep clone and apply delta to fleetStat
    const newStats = { ...f1Stats };
    for (const stat in deltaFleetStat) {
        const oldVal = newStats[stat] ?? 0;
        const delta = deltaFleetStat[stat];
        newStats[stat] = oldVal + delta;
        console.log(`+${delta} ${stat} (${oldVal} → ${newStats[stat]})`);
    }

    // Deep clone and apply delta to fleetBaseStat
    const newBaseStats = { ...f1BaseStat };
    for (const stat in deltaFleetBaseStat) {
        const oldVal = newBaseStats[stat] ?? 0;
        const newVal = deltaFleetBaseStat[stat];
        newBaseStats[stat] = newVal;
        console.log(`+$ (base) ${stat} (${oldVal} → ${newVal} )`);
    }

    const score = findFinalScore(newBaseStats, newStats, basicFleetStat, basicBaseStat, 1.1, startingLeadership);
    const scoreDiff = score - baseScore;
    const prefix = scoreDiff >= 0 ? '+' : '';
    logToConsole(consoleLog, `Total score: ${score.toFixed(2)} (${prefix}${scoreDiff.toFixed(2)} vs base)\n`);
    });
}

export function simulateBattle(consoleLog, graph, gtype, f1BaseStat, f1Stats, f2BaseStat, f2Stats) {
console.log(gtype)
  const f1 = new Fleet(f1BaseStat, f1Stats, 'Fleet 1');
  const f2 = new Fleet(f2BaseStat, f2Stats, 'Fleet 2');
  const f1Wins = doBattle(f1, f2, true, gtype, graph);
  logToConsole(consoleLog, (f1Wins ? 'Fleet 1 wins' : 'Fleet 2 wins'));
}

function logToConsole(consoleBox, message) {
  const line = `${message}`;
  consoleBox.textContent += line + '\n';
  consoleBox.scrollTop = consoleBox.scrollHeight; // auto scroll
}