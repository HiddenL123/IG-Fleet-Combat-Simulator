// src/components/display.js

export function createFeatureSelector(onSwitch) {
  const outer = document.createElement('div');
  outer.className = 'w-full max-w-4xl bg-white rounded-xl shadow-lg p-6 space-y-6';
  outer.style.margin = '0 auto'; // center horizontally

  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.gap = '1rem';
  container.style.flexWrap = 'wrap';          // wrap on narrow screens
  container.style.justifyContent = 'center'; // center buttons horizontally

  const features = ['battle', 'optimize', 'compare'];

  features.forEach((featureId) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = featureId.charAt(0).toUpperCase() + featureId.slice(1);
    button.style.padding = '0.75rem 1.5rem';    // bigger tap target
    button.style.cursor = 'pointer';
    button.style.border = '1px solid #ccc';
    button.style.borderRadius = '4px';
    button.style.backgroundColor = '#fff';
    button.style.fontSize = '1rem';
    button.style.minWidth = '100px';

    button.addEventListener('click', () => {
      onSwitch(featureId);
    });

    // Focus visible outline for accessibility
    button.addEventListener('focus', () => {
      button.style.outline = '2px solid #3b82f6'; // blue outline on focus
      button.style.outlineOffset = '2px';
    });
    button.addEventListener('blur', () => {
      button.style.outline = 'none';
    });

    container.appendChild(button);
  });

  outer.appendChild(container);
  return outer;
}

export function calculate(feature_function, feature_id) {
  const outer = document.createElement('div');
  outer.className = 'w-full max-w-4xl bg-white rounded-xl shadow-lg p-6 space-y-6';
  outer.style.margin = '1rem auto 0 auto'; // margin top 1rem, center horizontally

  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.justifyContent = 'center';

  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'Calculate';
  button.style.padding = '0.75rem 2rem'; // larger tap target
  button.style.cursor = 'pointer';
  button.style.border = '1px solid #4f46e5';
  button.style.borderRadius = '4px';
  button.style.backgroundColor = '#6366f1'; // indigo 500
  button.style.color = 'white';
  button.style.fontSize = '1rem';
  button.style.minWidth = '140px';

  // Hover style
  button.addEventListener('mouseenter', () => {
    button.style.backgroundColor = '#4f46e5'; // indigo 600
  });
  button.addEventListener('mouseleave', () => {
    button.style.backgroundColor = '#6366f1'; // indigo 500
  });

  // Focus style for accessibility
  button.addEventListener('focus', () => {
    button.style.outline = '2px solid #a5b4fc'; // lighter blue outline
    button.style.outlineOffset = '2px';
  });
  button.addEventListener('blur', () => {
    button.style.outline = 'none';
  });

  button.addEventListener('click', () => {
    feature_function(feature_id);
  });

  container.appendChild(button);
  outer.appendChild(container);
  return outer;
}


export function createBoundingBoxWrapper(...elements) {
  // Outer container centered with padding and full width
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.justifyContent = 'center';
  container.style.marginTop = '2.5rem';
  container.style.width = '100%';
  container.style.padding = '0 1rem';

  // Main bounding box with max width and styling
  const boundingBox = document.createElement('div');
  boundingBox.style.width = '100%';
  boundingBox.style.maxWidth = '64rem'; // max-w-5xl ~1024px
  boundingBox.style.backgroundColor = 'white';
  boundingBox.style.border = '1px solid #e5e7eb'; // border-gray-200
  boundingBox.style.borderRadius = '1rem'; // rounded-2xl
  boundingBox.style.boxShadow = '0 10px 15px rgba(0, 0, 0, 0.1)'; // shadow-xl
  boundingBox.style.padding = '1.5rem 1.5rem 2.5rem';
  boundingBox.style.display = 'flex';
  boundingBox.style.flexDirection = 'column';
  boundingBox.style.gap = '0.5rem'; // space between elements vertically

  // Append all given elements inside the bounding box
  elements.forEach(el => {
    boundingBox.appendChild(el);
  });

  // Append bounding box to container
  container.appendChild(boundingBox);

  return container;
}