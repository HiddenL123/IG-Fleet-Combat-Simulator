import { Fleet } from './fleet.js';

export class CompareUI {
  /**
   * @param {Fleet} fleet1
   * @param {Fleet} fleet2
   * @param {(elements: HTMLElement[]) => HTMLElement} wrapperFn
   */
  constructor(fleet1, fleet2, wrapperFn) {
    this.fleet1 = fleet1;
    this.fleet2 = fleet2;
    this.wrapperFn = wrapperFn;

    this.comparePresetCount = 1; // starts at 1
    this.presets = [];

    // Create main container
    this.container = document.createElement('div');
    this.container.className = 'flex flex-col gap-6';

    // Create presets container
    this.presetsContainer = document.createElement('div');
    this.presetsContainer.className = 'flex flex-col sm:flex-row flex-wrap gap-y-4 gap-x-2 m-0 p-0';

    // Add initial preset
    this.addPreset();

    // Add Preset button
    this.addPresetBtn = document.createElement('button');
    this.addPresetBtn.className = 'self-start bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded shadow';
    this.addPresetBtn.textContent = '➕ Add Preset';
    this.addPresetBtn.style.minWidth = '8rem';
    this.addPresetBtn.style.width = 'fit-content';
    this.addPresetBtn.style.maxWidth = '12rem';
    this.addPresetBtn.style.margin = '0 auto';

    this.addPresetBtn.onclick = () => this.addPreset();

    // Wrap fleets + presets container
    const fleetsWrapper = this.wrapperFn(this.fleet1.container, this.fleet2.container, this.presetsContainer);

    // Vertical wrapper to stack fleetsWrapper and button
    this.verticalWrapper = document.createElement('div');
    this.verticalWrapper.style.display = 'flex';
    this.verticalWrapper.style.flexDirection = 'column';
    this.verticalWrapper.style.gap = '1rem';

    this.verticalWrapper.appendChild(fleetsWrapper);
    this.verticalWrapper.appendChild(this.addPresetBtn);

    this.container.appendChild(this.verticalWrapper);
  }

  addPreset() {
    this.comparePresetCount++;

    // Create new Fleet preset
    const newPreset = new Fleet(`Stats Change Preset ${this.comparePresetCount}`);

    // Create a wrapper div to hold the preset UI and the remove button horizontally
    const presetWrapper = document.createElement('div');
    presetWrapper.style.display = 'flex';
    presetWrapper.style.alignItems = 'center';
    presetWrapper.style.gap = '0.5rem';

    // Add remove button
    const removeBtn = document.createElement('button');
    removeBtn.textContent = '✖';
    removeBtn.title = 'Remove preset';
    removeBtn.style.background = 'transparent';
    removeBtn.style.border = 'none';
    removeBtn.style.color = 'red';
    removeBtn.style.cursor = 'pointer';
    removeBtn.style.fontSize = '1.25rem';
    removeBtn.style.padding = '0';
    removeBtn.style.lineHeight = '1';

    // Remove handler
    removeBtn.onclick = () => {
      // Remove from DOM
      this.presetsContainer.removeChild(presetWrapper);
      // Remove from presets array
      this.presets = this.presets.filter(p => p !== newPreset);
    };

    // Append preset UI and remove button inside wrapper
    presetWrapper.appendChild(newPreset.container);
    presetWrapper.appendChild(removeBtn);

    // Add wrapper to presets container and store preset reference
    this.presetsContainer.appendChild(presetWrapper);
    this.presets.push(newPreset);
  }

  getUI() {
    return this.container;
  }

  createUI() {
    // Wrap fleets + presets container using the wrapper function
    const fleetsWrapper = this.wrapperFn(this.fleet1.container, this.fleet2.container, this.presetsContainer);

    // Clear verticalWrapper children in case createUI is called multiple times
    while (this.verticalWrapper.firstChild) {
      this.verticalWrapper.removeChild(this.verticalWrapper.firstChild);
    }

    this.verticalWrapper.appendChild(fleetsWrapper);
    this.verticalWrapper.appendChild(this.addPresetBtn);

    // Clear container children (optional: only if you want to re-render container itself)
    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }

    this.container.appendChild(this.verticalWrapper);

    return this.container;
  }

  getPresets() {
    return this.presets;
  }
}
