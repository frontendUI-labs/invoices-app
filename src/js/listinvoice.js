const listInvoiceEl = document.querySelector('.listinvoice');
const filterButtonEl = listInvoiceEl.querySelector('.filter__button');
const filterCheckboxEl = listInvoiceEl.querySelector('.filter__checkbox');
const filterWraperEl = listInvoiceEl.querySelector('.filter__button__wrapper');
const arrowRotateEl = listInvoiceEl.querySelector('.arrowrotate');
const filterSelectedEl = listInvoiceEl.querySelector('.filter__selected');
const selectedOptions = listInvoiceEl.querySelector(
  '.filter__selected__number'
);
const checkboxList = listInvoiceEl.querySelectorAll('.checkbox');
const errorEl = listInvoiceEl.querySelector('#error');
const loaderEl = listInvoiceEl.querySelector('#loader');
const invoiceRenderEl = listInvoiceEl.querySelector('.list__content__cards');
const invoicesCountSelected = listInvoiceEl.querySelector('.counOfInvoices');
const emptyEl = listInvoiceEl.querySelector('.empty');

function toggleCheckboxDropdown() {
  filterCheckboxEl.classList.toggle('flex');
}
function removeCheckboxDropdown() {
  filterCheckboxEl.classList.remove('flex');
}

// rotacion del icono//
function rotateArrow() {
  arrowRotateEl.classList.toggle('rotate');
}
function dontRotateArrow() {
  arrowRotateEl.classList.remove('rotate');
}

filterButtonEl.addEventListener('click', () => {
  toggleCheckboxDropdown();
  rotateArrow();
});

//remueve el bloque cuando se hace click afuera de el//
document.body.addEventListener('click', (event) => {
  const isContained = filterWraperEl.contains(event.target);
  if (!isContained) {
    removeCheckboxDropdown();
    dontRotateArrow();
  }
});

const statusClassNamesMap = {
  PENDING: 'pending',
  PAID: 'paid',
  DRAFT: 'draft',
};
function renderInvoices(invoices) {
  const invoicesEl = invoices.map((invoice) => {
    const status = invoice.status.toLowerCase();
    const upperCaseId = invoice.id.substr(0, 8).toUpperCase();
    const formatDate = new Date(invoice.dueDate);
    const gettDay = formatDate.getDate();
    const dueDatee = formatDate.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
    const allFormatDate = gettDay + 1 + ' ' + dueDatee;

    return `
        <li class="list__cards">
          <div class="list__code">
            <div class="text-body1">
              <a class="link__details" href="/details">
                <span class="list__code__numeral">#</span
                ><span class="list__code__number">${upperCaseId}</span>
              </a>
            </div>
            <span class="text-body1 list__code__name">${invoice.clientName}</span>
          </div>
          <div class="list__details">
            <div class="list__details__count">
              <span class="text-body1 list__details__date"
                >Due ${allFormatDate}</span
              >
              <span class="text-h3">$ ${invoice.amount}</span>
            </div>
            <div class="list__details__status list__details__status--${status}">
              <div
                class="list__status__point list__status__point--${status}"></div>
              <span class="text-h4 list__status__statuspage--${status}">${invoice.status}</span>
            </div>
          </div>
        </li>`;
  });
  const allInvoicesEl = invoicesEl.join('');
  invoiceRenderEl.innerHTML = allInvoicesEl;
}

let currentInvoices = [];
let statusOptions = [];
//escoja cuantas opciones estan seleccionada//
checkboxList.forEach((checbox) => {
  checbox.addEventListener('change', (event) => {
    const idSelected = event.currentTarget.id; //selecciona el id del input//
    if (event.target.checked) {
      statusOptions.push(idSelected); // agrega al array vacio si el imput esta con check//
    } else {
      statusOptions = statusOptions.filter((id) => {
        //quita al array ya creado//
        if (id !== idSelected) {
          return true;
        }
        return false;
      });
    }

    //numero de filtros//
    selectedOptions.textContent = statusOptions.length;
    if (statusOptions.length > 0) {
      filterSelectedEl.classList.add('flex');
    } else {
      filterSelectedEl.classList.remove('flex');
    }

    //interaccion del filter con los cards//
    const filteredInvoices = currentInvoices.filter((invoice) => {
      return statusOptions.includes(invoice.status);
    });
    if (statusOptions.length === 0) {
      renderInvoices(currentInvoices);
    } else {
      renderInvoices(filteredInvoices);
    }
  });
});

// loader
fetch('https://invoice-services.onrender.com/api/invoice')
  .then((response) => {
    return response.json().then((data) => {
      currentInvoices = data.data;
      // currentInvoices = [];
      renderInvoices(currentInvoices);
      invoicesCountSelected.textContent = currentInvoices.length;
      if (currentInvoices.length !== 0) {
        emptyEl.classList.remove('flex');
      } else {
        emptyEl.classList.add('flex');
      }
    });
  })
  .catch((error) => {
    errorEl.textContent = 'Ups, salio algo mal!';
  })
  .finally(() => {
    loaderEl.remove();
  });
