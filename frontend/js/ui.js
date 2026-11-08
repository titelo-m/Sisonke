export function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (key === 'class') node.className = value;
    else if (key === 'text') node.textContent = value;
    else if (key === 'html') node.innerHTML = value;
    else if (key.startsWith('on')) node.addEventListener(key.slice(2).toLowerCase(), value);
    else if (value !== false && value != null) node.setAttribute(key, value);
  }
  for (const child of [].concat(children)) {
    if (child == null) continue;
    node.append(child.nodeType ? child : document.createTextNode(child));
  }
  return node;
}

export function formatMoney(cents) {
  const rand = (cents / 100).toFixed(0);
  return `R${rand}`;
}

export function formatDate(dateString) {
  if (!dateString) return '';
  const d = new Date(dateString);
  return d.toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function statusBadge(status) {
  const map = {
    PENDING: 'badge-amber',
    APPROVED: 'badge-green',
    REJECTED: 'badge-red',
    COMPLETED: 'badge-grey',
  };
  const cls = map[status] || 'badge-grey';
  const label = status.charAt(0) + status.slice(1).toLowerCase();
  return `<span class="badge ${cls}">${label}</span>`;
}

export function toolCard(tool) {
  const img = tool.imageUrl
    ? `<img src="${tool.imageUrl}" alt="${tool.name}" />`
    : `<i data-lucide="image-off" style="width:32px;height:32px;"></i>`;

  const availabilityBadge = tool.available
    ? `<span class="badge badge-green">Available</span>`
    : `<span class="badge badge-grey">Booked</span>`;

  return `
    <a class="tool-card" href="tool.html?id=${tool.id}">
      <div class="tool-card-image">${img}</div>
      <div class="tool-card-body">
        <span class="badge badge-category">${tool.category}</span>
        <h3 class="tool-card-title">${tool.name}</h3>
        <div class="tool-card-meta">
          <i data-lucide="map-pin" style="width:14px;height:14px;"></i>
          <span>${tool.suburb}</span>
        </div>
        <div class="tool-card-footer">
          <span class="tool-card-price">${formatMoney(tool.depositFee)} deposit</span>
          ${availabilityBadge}
        </div>
      </div>
    </a>
  `;
}

export function skeletonCard() {
  return `<div class="skeleton skeleton-card"></div>`;
}

export function skeletonGrid(count = 3) {
  return Array.from({ length: count }, skeletonCard).join('');
}

export function emptyState(iconName, title, message) {
  return `
    <div class="empty-state">
      <i data-lucide="${iconName}" class="empty-state-icon" style="width:48px;height:48px;"></i>
      <div class="empty-state-title">${title}</div>
      <p>${message}</p>
    </div>
  `;
}

export function refreshIcons() {
  if (window.lucide) window.lucide.createIcons();
}

export function showToast(message, type = 'info') {
  const colors = {
    info: 'var(--surface-hi)',
    success: 'var(--success)',
    error: 'var(--danger)',
  };
  const toast = el('div', {
    text: message,
    style: `
      position: fixed;
      bottom: 24px;
      right: 24px;
      padding: 14px 20px;
      background-color: ${colors[type] || colors.info};
      color: white;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 500;
      z-index: 9999;
      box-shadow: 0 8px 24px rgba(0,0,0,0.4);
    `,
  });
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}