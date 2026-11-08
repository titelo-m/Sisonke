import { mockTools } from '../api.js';
import { toolCard, skeletonGrid, emptyState, refreshIcons } from '../ui.js';

async function loadFeaturedTools() {
  const container = document.getElementById('featured-tools');
  if (!container) return;

  container.innerHTML = skeletonGrid(3);

  try {
    const tools = await mockTools();
    if (!tools.length) {
      container.innerHTML = emptyState(
        'package-open',
        'No tools listed yet',
        'Be the first to list a tool in your neighbourhood.'
      );
    } else {
      container.innerHTML = tools.map(toolCard).join('');
    }
    refreshIcons();
  } catch (err) {
    container.innerHTML = emptyState(
      'alert-triangle',
      'Could not load tools',
      err.message
    );
    refreshIcons();
  }
}

loadFeaturedTools();