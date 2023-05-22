const listInvoiceEl = document.querySelector('.listinvoice');
const filterButtonEl = listInvoiceEl.querySelector('.filter__button');
const filterCheckboxEl = listInvoiceEl.querySelector('.filter__checkbox');

function toggleCheckbox() {
  filterCheckboxEl.classList.toggle('flex');
}
function removeCheckbox() {
  filterCheckboxEl.classList.remove('flex');
}

filterButtonEl.addEventListener('click', toggleCheckbox);
