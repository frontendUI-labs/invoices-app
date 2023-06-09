import addDays from 'date-fns/addDays';
const newInvoiceAllContentEl = document.querySelector('.newInvoice');
const buttonAddNewItemEl =
  newInvoiceAllContentEl.querySelector('.button__addItem');
const addImputsItemsEl =
  newInvoiceAllContentEl.querySelector('.addItemsImputs');
const itemsInputEl = addImputsItemsEl.querySelectorAll('.input-fieldItem');
const imputsFieldsEl = newInvoiceAllContentEl.querySelectorAll('.input-Rest');
// const numberQtyEl = addImputsItemsEl.querySelector('#putQty');
// const numberPriceEl = addImputsItemsEl.querySelector('#putPrice');
const imputValueEl = newInvoiceAllContentEl.querySelector(
  '.total__imput__borderColor'
);
const newInvoiceDialog = document.querySelector('.newInvoice');
const cleanButtonEl = addImputsItemsEl.querySelector('.cleanCalc');
const buttonDraftEl = newInvoiceAllContentEl.querySelector('.button__draft');
const buttonSaveEl = newInvoiceAllContentEl.querySelector('.button__save');
const buttonDiscardEl =
  newInvoiceAllContentEl.querySelector('.button__discard');
const listInvoiceEl = document.querySelector('.listinvoice');
const succesfullCreate = document.querySelector('#succefullCreate');

import Datepicker from '../js/datepicker';
const newInvoiceDatepicker = new Datepicker('#newInvoice-datepicker');
newInvoiceDatepicker.render();

import Dropdown from '../js/dropdown';
import { loadInvoices } from './listinvoice';
const newInvoiceDropdown = new Dropdown('#newInvoice-dropdown');
newInvoiceDropdown.render();

newInvoiceAllContentEl.addEventListener('keydown', (event) => {
  if (event.code === 'Escape') {
    closeModal();
  }
});
function closeModal() {
  newInvoiceDialog.close();
  document.body.style.overflow = 'auto';
}
buttonDiscardEl.addEventListener('click', () => {
  closeModal();
});
let items = [];
let item = {
  name: '',
  quantity: '',
  price: '',
  valid: '' ? false : true,
};
//valid inputs//
const prueba = newInvoiceAllContentEl.querySelector('#itemNameError');

itemsInputEl.forEach((input) => {
  buttonAddNewItemEl.addEventListener('click', () => {
    // Verifica si el input está vacío después del clic
    if (input.value === '') {
      input.classList.add('error');
      prueba.classList.add('error'); // Agrega la clase de error
    } else {
      input.classList.remove('error'); // Elimina la clase de error si el input está rellenado
    }
  });
});
// const validateCharacters = ['@', '.', 'com'];

itemsInputEl.forEach((input) => {
  input.addEventListener('input', (event) => {
    item = {
      ...item,
      [event.target.name]: event.target.value,
    };

    //calculadora//
    if (event.target.name === 'quantity' || event.target.name === 'price') {
      let amountTotalValue = item.quantity * item.price;
      item = {
        ...item,
        price: parseInt(item.price),
        quantity: parseInt(item.quantity),
        amountTotal: amountTotalValue,
      };

      imputValueEl.textContent = amountTotalValue;
    }
  });
});

function createDom(string) {
  const stringToNodo = new DOMParser();
  const inserToHTML = stringToNodo.parseFromString(string, 'text/html');
  return inserToHTML.body.firstChild;
}
const itemsLisEl = newInvoiceAllContentEl.querySelector('#items');
buttonAddNewItemEl.addEventListener('click', () => {
  items.unshift(item);
  itemsLisEl.innerHTML = '';
  items.forEach((item) => {
    const itemEl = createDom(`
       
        <div class="itemList__calc">
        <div class="textfield itemName">
        <label class="text-body1 textfield__label"
        >Item Name</label
        >
        <input
        class="text-h4 textfield__input input-fieldItem disabled" disabled
        name="name"
        value = "${item.name}"
        type="text" />     
        </div> 
        <div class="textfield Qty">
        <label class="text-body1 textfield__label">Qty.</label>
        <input
        class="text-h4 textfield__input input-fieldItem disabled" disabled
        id="putcuantity"
        name="quantity"
        value="${item.quantity}"
        type="text" />
        </div>
        <div class="textfield price">
        <label class="text-body1 textfield__label">Price</label>
        <input
        class="text-h4 textfield__input input-fieldItem disabled" disabled
        id="putprice"
        name="price"
        value="${item.price}"
        type="text" />
        </div>
        <div class="textfield total disabled">
        <div class="text-body1 textfield__label">Total</div>
        <div class="total__imput">
        <div
        class="text-h4 textfield__input total__imput__borderColor">${item.amountTotal}</div>
        <button class="removeCalc">
          <svg
            class="trash__icon"
            width="13"
            height="16"
            viewBox="0 0 13 16"
            fill="#none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M8.47225 0L9.36117 0.888875H12.4722V2.66667H0.027832V0.888875H3.13892L4.02783 0H8.47225ZM2.6945 16C1.71225 16 0.916707 15.2045 0.916707 14.2222V3.55554H11.5834V14.2222C11.5834 15.2045 10.7878 16 9.80562 16H2.6945Z"
              fill="#FFFFF" />
          </svg>
        </button>
        </div>
        <div id="items"></div>
        </div>
        </div>
        `);

    const iconRemoveEl = itemEl.querySelector('button');
    iconRemoveEl.addEventListener('click', () => {
      items = items.filter((savedItem) => {
        if (savedItem.name === item.name) {
          return false;
        }
        return true;
      });
      itemEl.remove();
    });
    itemsLisEl.append(itemEl);
  });
  imputValueEl.textContent = '';
  itemsInputEl.forEach((input) => {
    input.value = '';
  });
});

cleanButtonEl.addEventListener('click', () => {
  itemsInputEl.forEach((input) => {
    input.value = '';
  });
  imputValueEl.textContent = '';
});
// agregar imputs/items//
let allFields = {
  status: 'PENDING',
  description: '',
  streetAddress: '',
  city: '',
  postCode: '',
  country: '',
  currencyCountry: 'USD',
  clientName: '',
  clientEmail: '',
  clientStreetAddress: '',
  clientCity: '',
  clientPostCode: '',
  clientCountry: '',
  invoiceDate: '',
  dueDate: '',
  amount: 0,
  invoiceItems: items,
};

imputsFieldsEl.forEach((input) => {
  input.addEventListener('input', (event) => {
    allFields = {
      ...allFields,
      [event.target.name]: event.target.value,
    };
  });
});
async function methodPost() {
  const total = items
    .map((item) => item.amountTotal)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  const itemsN = items.map((item) => ({
    name: item.name,
    quantity: item.quantity,
    price: item.price,
  }));
  const daysToPayment = parseInt(newInvoiceDropdown.selectedOption ?? 0);
  const dueDate = addDays(
    newInvoiceDatepicker.selectedDatepicker,
    daysToPayment
  );

  let formFields = {
    ...allFields,
    invoiceDate: newInvoiceDatepicker.selectedDatepicker,
    amount: total,
    invoiceItems: itemsN,
    dueDate,
  };

  imputsFieldsEl.forEach((input) => {
    input.value = '';
  });
  succesfullCreate.addEventListener('click', () => {
    succesfullCreate.style.display = 'none';
  });
  try {
    const url = 'https://invoice-services.onrender.com/api/invoice';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
      },
      body: JSON.stringify(formFields),
    });
    const data = await response.json();
    Router.go('/');
    newInvoiceDialog.close();
    closeModal();
    loadInvoices();
    console.log('Respuesta:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}
// setTimeout(function () {
//   succesfullCreate.style.display = 'none';
// });

function setTime() {
  setTimeout(function () {
    succesfullCreate.style.display = 'none';
  }, 4000);
}
function succesNotificacion() {
  closeModal();
  succesfullCreate.style.display = 'flex';
}

buttonSaveEl.addEventListener('click', async () => {
  setTime();
  succesNotificacion();
  methodPost();
});
buttonDraftEl.addEventListener('click', async () => {
  succesNotificacion();
  setTime();
  allFields = {
    ...allFields,
    status: 'DRAFT',
  };
  methodPost();
});

// const emailError = document.querySelector('#emailError');
// const isEmailOk = validateCharacters.every((character) =>
//   emailValue.includes(character)
// );
// emailError.textContent = emailValue && isEmailOk ? '' : 'email required';
