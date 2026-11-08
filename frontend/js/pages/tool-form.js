import { showToast, refreshIcons } from '../ui.js';

const form = document.getElementById('tool-form');
const formTitle = document.getElementById('form-title');

const nameInput = document.getElementById('name');
const categoryInput = document.getElementById('category');
const suburbInput = document.getElementById('suburb');
const depositInput = document.getElementById('depositFee');
const descriptionInput = document.getElementById('description');
const imageInput = document.getElementById('imageUrl');
const availableInput = document.getElementById('available');

const previewName = document.getElementById('preview-name');
const previewCategory = document.getElementById('preview-category');
const previewSuburb = document.getElementById('preview-suburb');
const previewPrice = document.getElementById('preview-price');
const previewAvailability = document.getElementById('preview-availability');
const previewImage = document.getElementById('preview-image');

const params = new URLSearchParams(window.location.search);
const editId = params.get('id');

if (editId) {
  formTitle.textContent = 'Edit Tool';
  document.title = 'Edit Tool — Sisonke';
}

function updatePreview() {
  previewName.textContent = nameInput.value || 'Tool name';
  previewCategory.textContent = categoryInput.value || 'Category';
  previewSuburb.textContent = suburbInput.value || 'Suburb';
  previewPrice.textContent = depositInput.value ? `R${depositInput.value}` : 'R0';

  if (availableInput.checked) {
    previewAvailability.textContent = 'Available';
    previewAvailability.className = 'badge badge-green';
  } else {
    previewAvailability.textContent = 'Booked';
    previewAvailability.className = 'badge badge-grey';
  }

  if (imageInput.value) {
    previewImage.innerHTML = `<img src="${imageInput.value}" alt="Preview" onerror="this.parentElement.innerHTML='<i data-lucide=\\'image-off\\' style=\\'width:32px;height:32px;\\'></i>'; lucide.createIcons();" />`;
  } else {
    previewImage.innerHTML = `<i data-lucide="image-off" style="width:32px;height:32px;"></i>`;
    refreshIcons();
  }
}

[nameInput, categoryInput, suburbInput, depositInput, imageInput].forEach((input) => {
  input.addEventListener('input', updatePreview);
  input.addEventListener('change', updatePreview);
});
availableInput.addEventListener('change', updatePreview);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (depositInput.value && Number(depositInput.value) < 0) {
    showToast('Deposit fee cannot be negative.', 'error');
    return;
  }

  showToast(
    editId ? 'Tool updated successfully.' : 'Tool listed successfully.',
    'success'
  );

  setTimeout(() => {
    window.location.href = 'dashboard.html';
  }, 1200);
});

refreshIcons();
updatePreview();