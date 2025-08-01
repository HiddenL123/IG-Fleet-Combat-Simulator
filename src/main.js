import { createFeatureSelector, calculate, createBoundingBoxWrapper } from './components/featureSelect.js';
import { renderFeatureContent, fleet1Persistent, fleet2Persistent, compareUI } from './components/display.js';
import { createOutputSection , consoleBox, canvas, graphState} from './components/output.js';
import { getBaseStats } from './logic/getBaseStats.js';
import { optimize, compareStats, simulateBattle } from './logic/calculate.js';

const app = document.getElementById('app');
let graph = null;
let consoleLog = null;
let gtype = graphState.type;


const statIncrease = {
    "attack": 1,
    "hp": 1,
    "armor": 1,
    "shield": 1,
    "final_attack": 0.1,
    "damage_reduction": 0.1,
    "leadership": 10
}

function switchTo(featureId) {
  app.innerHTML = '';

  // Outer container for centering and padding
  const container = document.createElement('div');
  container.className = 'max-w-screen-lg mx-auto px-4 py-6 space-y-6';

  // Feature content
  const content = renderFeatureContent(featureId);

  const outputSection = createOutputSection();

  outputSection.className = 'max-w-screen-lg mx-auto px-4 py-6 space-y-6';

  graph = canvas;
  consoleLog = consoleBox;

  // Top controls: selector + calculate button
  const Controls = document.createElement('div');
  Controls.className = 'flex flex-col sm:flex-row items-center justify-center gap-4';

  const selector = createFeatureSelector(switchTo);
  const calculateButton = calculate(simulate, featureId);
  const buttonWrapper = createBoundingBoxWrapper(selector, calculateButton);

  Controls.appendChild(buttonWrapper);

  // Assemble layout
  container.appendChild(outputSection);
  container.appendChild(Controls);
  container.appendChild(content);

  app.appendChild(container);
}

function simulate(featureId) {
  const { fleetstat: f1Stats, fleetbasestat: f1BaseStat } = getFleetInfo(fleet1Persistent) || {};
  const { fleetstat: f2Stats, fleetbasestat: f2BaseStat } = getFleetInfo(fleet2Persistent) || {};

  if (!f1Stats || !f1BaseStat || !f2Stats || !f2BaseStat) {
    console.error('Fleet data missing');
    return;
  }
  console.log('Simulating for feature: ' + featureId);
  gtype = graphState.type;
  if (featureId === 'battle') {
    simulateBattle(consoleLog, graph, gtype, f1BaseStat, f1Stats, f2BaseStat, f2Stats);
  } else if (featureId === 'optimize') {
    optimize(consoleLog, graph, gtype, f1BaseStat, f1Stats, statIncrease, f2BaseStat, f2Stats);
  } else if (featureId === 'compare') {
    const increaseFleet = getFleetArray(compareUI.getPresets());
    compareStats(consoleLog, graph, gtype, f1BaseStat, f1Stats, increaseFleet, f2BaseStat, f2Stats);
  } else {
    console.error('Unknown feature for simulation.');
  }
}


function getFleetInfo(fleet) {
  if (!fleet) return null;

  const fleetstat = fleet.getStats();
  const fleetbasestat = getBaseStats(fleet.getTier(), fleet.getType());

  return { fleetstat, fleetbasestat };
}

function getFleetArray(fleetList) {
  return fleetList.map(fleet => getFleetInfo(fleet));
}

// Initial render
switchTo('battle');



