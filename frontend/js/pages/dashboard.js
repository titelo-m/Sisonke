import { mockTools } from '../api.js';
import {
  formatMoney,
  formatDate,
  statusBadge,
  emptyState,
  refreshIcons,
} from '../ui.js';

const myToolsGrid = document.getElementById('my-tools-grid');
const myBookingsList = document.getElementById('my-bookings-list');
const incomingRequestsList = document.getElementById('incoming-requests-list');

const mockMyTools = async () => {
  const all = await mockTools();
  return all.slice(0, 2);
};

const mockMyBookings = () => [
  {
    id: 1,
    toolName: 'Aluminium Extension Ladder',
    owner: 'Neighbour in Thokoza',
    startDate: '2026-11-10',
    endDate: '2026-11-12',
    status: 'APPROVED',
    imageUrl: '',
  },
  {
    id: 2,
    toolName: 'Pressure Washer',
    owner: 'Neighbour in Alberton',
    startDate: '2026-11-20',
    endDate: '2026-11-21',
    status: 'PENDING',
    imageUrl: '',
  },
];

const mockIncomingRequests = () => [
  {
    id: 3,
    toolName: 'Bosch Cordless Drill',
    borrower: 'Thabo M.',
    startDate: '2026-11-15',
    endDate: '2026-11-16',
    status: 'PENDING',
    imageUrl: '',
  },
];

function toolCardWithActions(tool) {
  const img = tool.imageUrl
    ? `<img src="${tool.imageUrl}" alt="${tool.name}" />`
    : `<i data-lucide="image-off" style="width:32px;height:32px;"></i>`;
  return `
    <div class="tool-card my-tool-card">
      <div class="tool-card-image">${img}</div>
      <div class="tool-card-body">
        <span class="badge badge-category">${tool.category}</span>
        <h3 class="tool-card-title">${tool.name}</h3>
        <div class="tool-card-meta">
          <i data-lucide="map-pin" style="width:14px;height:14px;"></i>
          <span>${tool.suburb}</span>
        </div>
        <div class="tool-card-footer">
          <span class="tool-card-price">${formatMoney(tool.depositFee)}</span>
        </div>
        <div class="my-tool-actions">
          <a href="tool-form.html?id=${tool.id}" class="btn btn-outline btn-sm">Edit</a>
          <button class="btn btn-danger btn-sm" data-delete="${tool.id}">Delete</button>
        </div>
      </div>
    </div>
  `;
}

function bookingRow(booking, kind) {
  const img = booking.imageUrl
    ? `<img src="${booking.imageUrl}" alt="${booking.toolName}" />`
    : `<i data-lucide="image-off" style="width:24px;height:24px;"></i>`;

  const meta =
    kind === 'borrow'
      ? `From ${booking.owner}`
      : `Requested by ${booking.borrower}`;

  const actions =
    kind === 'incoming' && booking.status === 'PENDING'
      ? `
        <button class="btn btn-primary btn-sm" data-approve="${booking.id}">Approve</button>
        <button class="btn btn-danger btn-sm" data-reject="${booking.id}">Reject</button>
      `
      : kind === 'borrow' && booking.status === 'COMPLETED'
      ? `<button class="btn btn-outline btn-sm" data-review="${booking.id}">Leave Review</button>`
      : '';

  return `
    <div class="booking-row">
      <div class="booking-thumb">${img}</div>
      <div class="booking-info">
        <strong>${booking.toolName}</strong>
        <span>${meta} · ${formatDate(booking.startDate)} – ${formatDate(booking.endDate)}</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        ${statusBadge(booking.status)}
        <div class="booking-actions">${actions}</div>
      </div>
    </div>
  `;
}

async function renderMyTools() {
  myToolsGrid.innerHTML = `
    <a href="tool-form.html" class="add-tool-card">
      <i data-lucide="plus" style="width:40px;height:40px;margin-bottom:8px;"></i>
      <strong>Add new tool</strong>
      <span style="font-size:0.85rem;margin-top:4px;">List a tool you own</span>
    </a>
  `;

  const tools = await mockMyTools();
  if (!tools.length) {
    myToolsGrid.innerHTML += emptyState(
      'package',
      'No tools listed yet',
      'Add your first tool to start lending.'
    );
  } else {
    myToolsGrid.innerHTML += tools.map(toolCardWithActions).join('');
  }

  refreshIcons();
  bindToolActions();
}

function bindToolActions() {
  document.querySelectorAll('[data-delete]').forEach((btn) => {
    btn.addEventListener('click', () => {
      btn.closest('.tool-card').remove();
    });
  });
}

function renderMyBookings() {
  const bookings = mockMyBookings();
  if (!bookings.length) {
    myBookingsList.innerHTML = emptyState(
      'calendar-x',
      'No bookings yet',
      'Browse tools to make your first request.'
    );
  } else {
    myBookingsList.innerHTML = bookings.map((b) => bookingRow(b, 'borrow')).join('');
  }
  refreshIcons();
}

function renderIncomingRequests() {
  const requests = mockIncomingRequests();
  if (!requests.length) {
    incomingRequestsList.innerHTML = emptyState(
      'inbox',
      'No incoming requests',
      'When someone requests your tools, they will appear here.'
    );
  } else {
    incomingRequestsList.innerHTML = requests.map((r) => bookingRow(r, 'incoming')).join('');
  }
  refreshIcons();
  bindIncomingActions();
}

function bindIncomingActions() {
  document.querySelectorAll('[data-approve]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const row = btn.closest('.booking-row');
      row.querySelector('.badge').outerHTML = statusBadge('APPROVED');
      row.querySelector('.booking-actions').innerHTML = '';
    });
  });
  document.querySelectorAll('[data-reject]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const row = btn.closest('.booking-row');
      row.querySelector('.badge').outerHTML = statusBadge('REJECTED');
      row.querySelector('.booking-actions').innerHTML = '';
    });
  });
}

function bindTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      document.querySelectorAll('.tab-content').forEach((c) => c.classList.remove('active'));
      document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');
    });
  });
}

bindTabs();
renderMyTools();
renderMyBookings();
renderIncomingRequests();