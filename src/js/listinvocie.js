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

function toggleCheckboxDropdown() {
  filterCheckboxEl.classList.toggle('flex');
}
function removeCheckboxDropdown() {
  filterCheckboxEl.classList.remove('flex');
}
// rotacion del icono//
let rotation = 0;
const angle = 180;
function rotateArrow() {
  rotation = (rotation + angle) % 360;
  arrowRotateEl.style.transform = `rotate(${rotation}deg)`;
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
        if (id === idSelected) {
          return false;
        }
        return true;
      });
    }
    selectedOptions.textContent = statusOptions.length;
    if (statusOptions.length > 0) {
      filterSelectedEl.classList.add('flex');
    } else {
      filterSelectedEl.classList.remove('flex');
    }
  });
});
