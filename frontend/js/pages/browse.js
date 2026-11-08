import { mockTools } from '../api.js';
import { toolCard, skeletonGrid, emptyState, refreshIcons } from '../ui.js';

let allTools = [];

const searchInput = document.getElementById('search-input');
const categoryFilters = document.getElementById('category-filters');
const suburbFilter = document.getElementById('suburb-filter');
const depositFilter = document.getElementById('deposit-filter');
const availableFilter = document.getElementById('available-filter');
const toolGrid = document.getElementById('tool-grid');
const resultsCount = document.getElementById('results-count');

function getSelectedCategories() {
  return Array.from(categoryFilters.querySelectorAll('input:checked')).map(
    (cb) => cb.value
  );
}

function applyFilters(tools) {
  const query = searchInput.value.trim().toLowerCase();
  const categories = getSelectedCategories();
  const suburb = suburbFilter.value;
  const maxDeposit = depositFilter.value ? Number(depositFilter.value) * 100 : null;
  const availableOnly = availableFilter.checked;

  return tools.filter((tool) => {
    if (query && !tool.name.toLowerCase().includes(query)) return false;
    if (categories.length && !categories.includes(tool.category)) return false;
    if (suburb && tool.suburb !== suburb) return false;
    if (maxDeposit != null && tool.depositFee > maxDeposit) return false;
    if (availableOnly && !tool.available) return false;
    return true;
  });
}

function render() {
  const filtered = applyFilters(allTools);

  resultsCount.textContent =
    filtered.length === 1 ? '1 tool found' : `${filtered.length} tools found`;

  if (!filtered.length) {
    toolGrid.innerHTML = emptyState(
      'search-x',
      'No tools match your filters',
      'Try widening your search or clearing some filters.'
    );
  } else {
    toolGrid.innerHTML = filtered.map(toolCard).join('');
  }

  refreshIcons();
}

async function init() {
  toolGrid.innerHTML = skeletonGrid(6);
  resultsCount.textContent = 'Loading...';

  try {
    allTools = await mockTools();
    render();
  } catch (err) {
    toolGrid.innerHTML = emptyState(
      'alert-triangle',
      'Could not load tools',
      err.message
    );
    resultsCount.textContent = '0 tools found';
    refreshIcons();
  }
}

searchInput.addEventListener('input', render);
categoryFilters.addEventListener('change', render);
suburbFilter.addEventListener('change', render);
depositFilter.addEventListener('input', render);
availableFilter.addEventListener('change', render);

init();