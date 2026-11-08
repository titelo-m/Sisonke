import { mockTools } from '../api.js';
import {
  toolCard,
  emptyState,
  formatMoney,
  refreshIcons,
  showToast,
} from '../ui.js';

const params = new URLSearchParams(window.location.search);
const toolId = Number(params.get('id'));

const container = document.getElementById('tool-container');
const relatedSection = document.getElementById('related-section');
const relatedTools = document.getElementById('related-tools');

function renderTool(tool) {
  const image = tool.imageUrl
    ? `<img src="${tool.imageUrl}" alt="${tool.name}" />`
    : `<i data-lucide="image-off" style="width:64px;height:64px;"></i>`;

  const initial = 'T';

  container.innerHTML = `
    <div class="tool-detail">
      <div class="tool-image">${image}</div>
      <div class="tool-info">
        <span class="badge badge-category">${tool.category}</span>
        <h1>${tool.name}</h1>
        <div style="display:flex;align-items:center;gap:8px;color:var(--text-muted);font-size:0.9rem;margin-top:4px;">
          <i data-lucide="map-pin" style="width:14px;height:14px;"></i>
          ${tool.suburb}
        </div>

        <div class="owner-block">
          <div class="owner-avatar">${initial}</div>
          <div class="owner-info">
            <strong>Listed by a neighbour</strong>
            <span>Verified member</span>
          </div>
        </div>

        <div class="deposit-block">
          <span class="label">Deposit required</span>
          <span class="value">${formatMoney(tool.depositFee)}</span>
        </div>

        <p>${tool.description || 'No description provided.'}</p>

        <div class="booking-form">
          <h3>Request to borrow</h3>
          <div class="booking-row">
            <div class="form-group">
              <label class="form-label" for="start-date">Start date</label>
              <input class="form-input" type="date" id="start-date" />
            </div>
            <div class="form-group">
              <label class="form-label" for="end-date">End date</label>
              <input class="form-input" type="date" id="end-date" />
            </div>
          </div>
          <button class="btn btn-secondary" style="width:100%;margin-top:8px;" id="request-btn">
            Request to Borrow
          </button>
          <p class="form-hint mt-sm">
            You'll be contacted by the owner to arrange pickup once they approve your request.
          </p>
        </div>
      </div>
    </div>
  `;

  refreshIcons();

  document.getElementById('request-btn').addEventListener('click', () => {
    const start = document.getElementById('start-date').value;
    const end = document.getElementById('end-date').value;

    if (!start || !end) {
      showToast('Please select both a start and end date.', 'error');
      return;
    }
    if (new Date(end) <= new Date(start)) {
      showToast('End date must be after the start date.', 'error');
      return;
    }

    showToast('Request sent to the owner. You will be notified once approved.', 'success');
  });
}

function renderRelated(tools, currentId) {
  const related = tools.filter((t) => t.id !== currentId).slice(0, 3);
  if (!related.length) return;

  relatedSection.classList.remove('hidden');
  relatedTools.innerHTML = related.map(toolCard).join('');
  refreshIcons();
}

async function init() {
  try {
    const tools = await mockTools();
    const tool = tools.find((t) => t.id === toolId);

    if (!tool) {
      container.innerHTML = emptyState(
        'search-x',
        'Tool not found',
        'This tool may have been removed or the link is incorrect.'
      );
      refreshIcons();
      return;
    }

    renderTool(tool);
    renderRelated(tools, tool.id);
  } catch (err) {
    container.innerHTML = emptyState(
      'alert-triangle',
      'Could not load tool',
      err.message
    );
    refreshIcons();
  }
}

init();