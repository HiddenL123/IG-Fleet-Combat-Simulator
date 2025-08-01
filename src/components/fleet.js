const FLEET_STATS = [
  'weapon_attack',
  'attack',
  'hp',
  'armor',
  'shield',
  'final_attack',
  'damage_reduction',
  'leadership',
];

// Class representing one fleet input form
export class FleetUI {
  constructor(name) {
    this.name = name;
    this.inputs = {};
    this.title = null;
    this.container = this.createFleetUI();
  }

  createFleetUI() {
    // Outer container (no width/height limits)
    const outer = document.createElement('div');
    outer.className = 'flex justify-center items-start w-full';
    outer.style.padding = '0.5rem';

    // Inner container (the actual form)
    const container = document.createElement('div');
    container.className =
      'p-4 border border-gray-300 rounded bg-gray-50 w-full';

    // Apply styling to the inner container only
    container.style.position = 'relative';
    container.style.width = '100%';
    container.style.maxWidth = '320px';
    container.style.maxHeight = '600px';
    container.style.overflowY = 'auto';
    container.style.padding = '0.5rem';
    container.style.border = '1px solid #ccc';
    container.style.borderRadius = '0.25rem';
    container.style.backgroundColor = '#f9fafb';
    container.style.margin = '0 auto'

    this.title = document.createElement('h3');
    this.title.textContent = this.name;
    this.title.className = 'text-lg font-semibold mb-4 text-center';
    container.appendChild(this.title);

    const form = document.createElement('div');
    form.className = 'flex flex-col gap-3';
    container.appendChild(form);

    FLEET_STATS.forEach(stat => {
      const group = document.createElement('div');
      group.style.display = 'flex';
      group.style.alignItems = 'center';
      group.style.gap = '4px';
      group.style.marginBottom = '12px';

      const label = document.createElement('label');
      label.textContent = stat;
      label.style.width = '8rem';
      label.style.display = 'inline-block';
      label.style.fontWeight = '600';
      label.style.fontSize = '0.875rem';
      label.style.boxSizing = 'border-box';

      const input = document.createElement('input');
      input.type = 'number';
      input.name = stat;
      input.value = 0;
      input.style.flexGrow = '1';
      input.style.padding = '0.5rem';
      input.style.border = '1px solid #ccc';
      input.style.borderRadius = '0.25rem';
      input.style.boxSizing = 'border-box';

      this.inputs[stat] = input;

      group.appendChild(label);
      group.appendChild(input);
      form.appendChild(group);
    });

    // -- Add Tier selector --
    const tierGroup = document.createElement('div');
    tierGroup.style.display = 'flex';
    tierGroup.style.alignItems = 'center';
    tierGroup.style.gap = '8px';
    tierGroup.style.marginTop = '1rem';

    const tierLabel = document.createElement('label');
    tierLabel.textContent = 'Tier';
    tierLabel.style.width = '8rem';
    tierLabel.style.fontWeight = '600';
    tierLabel.style.fontSize = '0.875rem';
    tierLabel.style.boxSizing = 'border-box';

    const tierSelect = document.createElement('select');
    tierSelect.name = 'tier';
    tierSelect.style.flexGrow = '1';
    tierSelect.style.padding = '0.5rem';
    tierSelect.style.border = '1px solid #ccc';
    tierSelect.style.borderRadius = '0.25rem';
    tierSelect.style.boxSizing = 'border-box';

    ['Tier 1', 'Tier 10', 'Tier 11', 'Tier 12'].forEach(tier => {
      const option = document.createElement('option');
      option.value = tier.toLowerCase().replace(' ', '_'); // e.g. 'tier_1'
      option.textContent = tier;
      tierSelect.appendChild(option);
    });

    tierGroup.appendChild(tierLabel);
    tierGroup.appendChild(tierSelect);
    form.appendChild(tierGroup);

    // -- Add Type selector --
    const typeGroup = document.createElement('div');
    typeGroup.style.display = 'flex';
    typeGroup.style.alignItems = 'center';
    typeGroup.style.gap = '8px';
    typeGroup.style.marginTop = '1rem';

    const typeLabel = document.createElement('label');
    typeLabel.textContent = 'Type';
    typeLabel.style.width = '8rem';
    typeLabel.style.fontWeight = '600';
    typeLabel.style.fontSize = '0.875rem';
    typeLabel.style.boxSizing = 'border-box';

    const typeSelect = document.createElement('select');
    typeSelect.name = 'type';
    typeSelect.style.flexGrow = '1';
    typeSelect.style.padding = '0.5rem';
    typeSelect.style.border = '1px solid #ccc';
    typeSelect.style.borderRadius = '0.25rem';
    typeSelect.style.boxSizing = 'border-box';

    ['Frigates', 'Destroyers', 'Cruisers'].forEach(type => {
      const option = document.createElement('option');
      option.value = type.toLowerCase();
      option.textContent = type;
      typeSelect.appendChild(option);
    });

    typeGroup.appendChild(typeLabel);
    typeGroup.appendChild(typeSelect);
    form.appendChild(typeGroup);

    // Optionally store references for later
    this.tierSelect = tierSelect;
    this.typeSelect = typeSelect;

    // Nest the form container inside the outer wrapper
    outer.appendChild(container);

    return outer;
  }

  getStats() {
    const stats = {};
    for (const stat in this.inputs) {
      stats[stat] = parseFloat(this.inputs[stat].value) || 0;
    }
    return stats;
  }

  getTier() {
    return this.tierSelect ? this.tierSelect.value : null;
  }
  getType() {
    return this.typeSelect ? this.typeSelect.value : null;
  }

  changeName(newName) {
    this.name = newName;
    this.title.textContent = newName;
  }
}
