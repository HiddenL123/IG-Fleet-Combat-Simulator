import { FleetUI } from './fleet.js';
import { CompareUI } from './compare.js';
export let fleet1Persistent = new FleetUI('Fleet 1');
export let fleet2Persistent = new FleetUI('Fleet 2');
export let compareUI = null;

export function renderFeatureContent(featureId) {
  const content = document.createElement('div');
  content.className = 'space-y-6 text-gray-700';


  if (featureId === 'battle') {
    switchToBattle(content);
  } else if (featureId === 'optimize') {
    switchToOptimize(content);
  } else if (featureId === 'compare') {
    switchToCompare(content);
  } else {
    const errorMsg = document.createElement('p');
    errorMsg.textContent = 'Unknown feature.';
    errorMsg.className = 'text-red-600 font-semibold';
    content.appendChild(errorMsg);
  }

  return content;
}

function switchToBattle(content) {
  const fleetContainer = document.createElement('div');
  fleetContainer.className = 'flex flex-col sm:flex-row gap-6 sm:justify-center max-w-[680px] mx-auto';

  if (!fleet1Persistent) {
    fleet1Persistent = new FleetUI("Fleet 1");
  } else {
    fleet1Persistent.changeName("Fleet 1");
  }
  if (!fleet2Persistent) {
    fleet2Persistent = new FleetUI("Fleet 2");
  } else{
    fleet2Persistent.changeName("Fleet 2");
  }

  const wrapper = createFleetWrapper(
    fleet1Persistent.container,
    fleet2Persistent.container
  );

  content.appendChild(wrapper);
  content.appendChild(makeDescription("Fleet Battle UI goes here."));
}

function switchToOptimize(content) {
  if (!fleet1Persistent) {
    fleet1Persistent = new FleetUI("Fleet 1");
  } else {
    fleet1Persistent.changeName("Fleet 1");
  }
  if (!fleet2Persistent) {
    fleet2Persistent = new FleetUI("Opponent Fleet");
  } else {
    fleet2Persistent.changeName("Opponent Fleet");
  }
  const wrapper = createFleetWrapper(
    fleet1Persistent.container,
    fleet2Persistent.container
  );
  content.appendChild(wrapper);
  content.appendChild(makeDescription("Fleet Optimization UI goes here."));
}


function switchToCompare(content) {
  if (!fleet1Persistent) {
    fleet1Persistent = new FleetUI("Fleet 1");
  } else {}
    fleet1Persistent.changeName("Fleet 1");
  if (!fleet2Persistent) {
    fleet2Persistent = new FleetUI("Opponent Fleet");
  } else {
    fleet2Persistent.changeName("Opponent Fleet");
  }
  if (!compareUI) {
    compareUI = new CompareUI(fleet1Persistent, fleet2Persistent, createFleetWrapper);
  } else{
    compareUI.createUI();
  }
  content.appendChild(compareUI.getUI());
  content.appendChild(makeDescription("Fleet Comparison UI goes here."));
}

function createFleetWrapper(...elements) {
  const outer = document.createElement('div');
  outer.style.display = 'flex';
  outer.style.justifyContent = 'center';
  outer.style.marginTop = '2.5rem';  // mt-10 roughly 40px
  outer.style.width = '100%';
  outer.style.padding = '0 1rem'; // px-4

  // Inner bounding box container with max width, border, rounded corners, shadow, padding
  const inner = document.createElement('div');
  inner.style.width = '100%';
  inner.style.maxWidth = '64rem';  // max-w-5xl ~1024px
  inner.style.backgroundColor = 'white';
  inner.style.border = '1px solid #e5e7eb'; // border-gray-200
  inner.style.borderRadius = '1rem'; // rounded-2xl
  inner.style.boxShadow = '0 10px 15px rgba(0, 0, 0, 0.1)'; // shadow-xl
  inner.style.display = 'flex';
  inner.style.flexDirection = 'column';
  inner.style.gap = '1.5rem'; // space-y-10 padding between rows
  inner.style.padding = '1.5rem 1.5rem 2.5rem'; // p-6 with extra bottom space

  // On large screens, switch to row layout and adjust gap
  const mediaQuery = window.matchMedia('(min-width: 1024px)');
  function updateLayout(e) {
    if (e.matches) {
      inner.style.flexDirection = 'row';
      inner.style.gap = '0.5rem'; // gap-6 approx 24px horizontally
      // Make children equal width and allow shrinking
      for (const el of elements) {
        el.style.flex = '1 1 0'; // grow and shrink equally
        el.style.minWidth = '0'; // prevent overflow
        
      }
    } else {
      inner.style.flexDirection = 'column';
      inner.style.gap = '2.5rem'; // vertical spacing
      for (const el of elements) {
        el.style.flex = 'none';
        el.style.minWidth = 'auto';
      }
    }
  }
  mediaQuery.addEventListener('change', updateLayout);
  updateLayout(mediaQuery);

  // Append each fleet element, add flex-shrink-0 as you had
  for (const el of elements) {
    el.classList.add('flex-shrink-0');
    inner.appendChild(el);
  }

  outer.appendChild(inner);
  return outer;
}

function makeDescription(text) {
  const p = document.createElement('p');
  p.textContent = text;
  p.className = 'text-sm text-gray-500';
  return p;
}

export function resetFleet1() {
  fleet1Persistent = null;
}

