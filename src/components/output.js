export let canvas = null;
export let consoleBox = null;
export const graphState = {
  type: 'leadership',
};

export function createOutputSection() {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.marginTop = '2.5rem';
    container.style.width = '100%';
    container.style.padding = '0 1rem';
    container.className = 'max-w-screen-lg mx-auto px-4 py-6 space-y-6';

    const boundingBox = document.createElement('div');
    boundingBox.style.width = '100%';
    boundingBox.style.maxWidth = '64rem';
    boundingBox.style.backgroundColor = 'white';
    boundingBox.style.border = '1px solid #e5e7eb';
    boundingBox.style.borderRadius = '1rem';
    boundingBox.style.boxShadow = '0 10px 15px rgba(0, 0, 0, 0.1)';
    boundingBox.style.padding = '1.5rem 1.5rem 2.5rem';
    boundingBox.style.display = 'flex';
    boundingBox.style.flexDirection = 'column';
    boundingBox.style.gap = '2.5rem';

    const title = document.createElement('h2');
    title.textContent = 'IG Combat Simulator/Calculator';
    title.style.fontSize = '1.5rem';
    title.style.fontWeight = '600';
    title.style.color = '#1f2937';
    title.style.textAlign = 'center';
    title.style.marginBottom = '1.5rem';
    boundingBox.appendChild(title);

    const graphSection = document.createElement('section');
    graphSection.style.border = '1px solid #d1d5db';
    graphSection.style.borderRadius = '0.5rem';
    graphSection.style.padding = '1rem';
    graphSection.style.backgroundColor = 'white';
    graphSection.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.06)';
    graphSection.style.display = 'flex';
    graphSection.style.flexDirection = 'column';
    graphSection.style.alignItems = 'center';
    graphSection.style.gap = '0.75rem';

    const graphLabel = document.createElement('h3');
    graphLabel.textContent = 'Graph';
    graphLabel.style.fontSize = '0.875rem';
    graphLabel.style.fontWeight = '500';
    graphLabel.style.color = '#4b5563';
    graphLabel.style.textAlign = 'center';
    graphSection.appendChild(graphLabel);

    const graphBox = document.createElement('div');
    graphBox.style.width = '100%';
    graphBox.style.height = '36rem';
    graphBox.style.display = 'flex';
    graphBox.style.alignItems = 'center';
    graphBox.style.justifyContent = 'center';

    canvas = document.createElement('canvas');
    canvas.id = 'output-chart';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.borderRadius = '0.5rem';

    graphBox.appendChild(canvas);
    graphSection.appendChild(graphBox);

    const consoleSection = document.createElement('section');
    consoleSection.style.border = '1px solid #d1d5db';
    consoleSection.style.borderRadius = '0.5rem';
    consoleSection.style.padding = '1rem';
    consoleSection.style.backgroundColor = '#f9fafb';
    consoleSection.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.06)';
    consoleSection.style.display = 'flex';
    consoleSection.style.flexDirection = 'column';
    consoleSection.style.gap = '0.5rem';

    const consoleLabel = document.createElement('h3');
    consoleLabel.textContent = 'Console Log';
    consoleLabel.style.fontSize = '0.875rem';
    consoleLabel.style.fontWeight = '500';
    consoleLabel.style.color = '#4b5563';
    consoleSection.appendChild(consoleLabel);

    consoleBox = document.createElement('div');
    consoleBox.id = 'output-console';
    consoleBox.style.height = '12rem';
    consoleBox.style.overflowY = 'auto';
    consoleBox.style.whiteSpace = 'pre-wrap';
    consoleBox.style.fontSize = '0.875rem';
    consoleBox.style.fontFamily = 'ui-monospace, SFMono-Regular, monospace';
    consoleBox.style.backgroundColor = 'transparent';
    consoleBox.textContent = '';


  // Selector Panel
    const selectorPanel = document.createElement('div');
    selectorPanel.style.display = 'flex';
    selectorPanel.style.justifyContent = 'center';
    selectorPanel.style.gap = '1rem';
    selectorPanel.style.marginTop = '0.5rem';

    // Create label
    const selectorLabel = document.createElement('label');
    selectorLabel.style.marginTop = '4px'; // moves it down by 4 pixels
    selectorLabel.textContent = 'Graph Type';
    selectorLabel.style.fontSize = '1rem';
    selectorLabel.style.fontWeight = '500';
    selectorLabel.style.color = '#4b5563';
    selectorLabel.setAttribute('for', 'type-select');

    // Create select dropdown
    const typeSelect = document.createElement('select');
    typeSelect.id = 'type-select';
    typeSelect.style.padding = '0.25rem 0.5rem';
    typeSelect.style.border = '1px solid #d1d5db';
    typeSelect.style.borderRadius = '0.375rem';
    typeSelect.style.backgroundColor = 'white';
    typeSelect.style.fontSize = '0.875rem';
    typeSelect.style.color = '#1f2937';

    // Populate options
    ['Leadership', 'Power', 'Percent'].forEach(type => {
        const option = document.createElement('option');
        option.value = type.toLowerCase();
        option.textContent = type;
        typeSelect.appendChild(option);
    });
    typeSelect.addEventListener('change', (event) => {
        graphState.type = event.target.value;
        console.log('Graph type changed to:', graphState.type);
    });

    // Append label and select to panel
    selectorPanel.appendChild(selectorLabel);
    selectorPanel.appendChild(typeSelect);

    consoleSection.appendChild(consoleBox);

    boundingBox.appendChild(graphSection);
    graphSection.appendChild(selectorPanel);
    boundingBox.appendChild(consoleSection);
    container.appendChild(boundingBox);
    /*return {
        container,     // the full thing to append to DOM
        canvas,        // reference to canvas (for Chart.js)
        consoleBox     // reference to console (for logging output)
    };*/
    
    return container;
}