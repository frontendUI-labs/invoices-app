import addDays from 'date-fns/addDays';
const newInvoiceAllContentEl = document.querySelector('.newInvoice');
const buttonAddNewItemEl =
  newInvoiceAllContentEl.querySelector('.button__addItem');
const addImputsItemsEl =
  newInvoiceAllContentEl.querySelector('.addItemsImputs');
const itemsInputEl = addImputsItemsEl.querySelectorAll('.input-fieldItem');
const imputsFieldsEl = newInvoiceAllContentEl.querySelectorAll('.input-Rest');
const imputValueEl = newInvoiceAllContentEl.querySelector(
  '.total__imput__borderColor'
);
const newInvoiceDialog = document.querySelector('.newInvoice');
const cleanButtonEl = addImputsItemsEl.querySelector('.cleanCalc');
const buttonDraftEl = newInvoiceAllContentEl.querySelector('.button__draft');
const buttonSaveEl = newInvoiceAllContentEl.querySelector('.button__save');
const buttonDiscardEl =
  newInvoiceAllContentEl.querySelector('.button__discard');
const succesfullCreate = document.querySelector('#succefullCreate');

import Datepicker from '../js/datepicker';
const newInvoiceDatepicker = new Datepicker('#newInvoice-datepicker');
newInvoiceDatepicker.render();

import { loadInvoices } from './listinvoice';

import Dropdown from '../js/dropdown';
const newInvoiceDropdown = new Dropdown('#newInvoice-dropdown');
newInvoiceDropdown.render();

function closeModal() {
  newInvoiceDialog.close();
  document.body.style.overflow = 'auto';
}
newInvoiceAllContentEl.addEventListener('keydown', (event) => {
  if (event.code === 'Escape') {
    closeModal();
  }
});
buttonDiscardEl.addEventListener('click', () => {
  closeModal();
});

//items//
let items = [];
let item = {
  name: {
    value: '',
    valid: false,
  },
  quantity: {
    value: '',
    valid: false,
  },
  price: {
    value: '',
    valid: false,
  },
};
// valid inputs items//
const itemContainerElement = newInvoiceAllContentEl.querySelector(
  '.itemList__components'
);

const numeroInputs = document.querySelectorAll('.numeroInput');
numeroInputs.forEach(function (input) {
  input.addEventListener('input', function () {
    const valor = input.value;
    input.value = valor.replace(/\D/g, '');
  });
});

const divElement = document.createElement('div');
itemsInputEl.forEach((input) => {
  input.addEventListener('input', (event) => {
    const isValidInput = event.target.value !== '';
    item = {
      ...item,
      [event.target.name]: {
        value: event.target.value,
        valid: isValidInput,
      },
    };
    if (isValidInput) {
      input.classList.remove('error');
      divElement.style.display = 'none';
    }

    //calculadora//
    if (event.target.name === 'quantity' || event.target.name === 'price') {
      let amountTotalValue = item.quantity.value * item.price.value;
      item.price.value = parseInt(item.price.value);
      item.quantity.value = parseInt(item.quantity.value);
      item.amountTotal = amountTotalValue;
      imputValueEl.textContent = amountTotalValue;
    }
  });
});
//create DOM for items//
function createDom(string) {
  const stringToNodo = new DOMParser();
  const inserToHTML = stringToNodo.parseFromString(string, 'text/html');
  return inserToHTML.body.firstChild;
}

const itemsLisEl = newInvoiceAllContentEl.querySelector('#items');
buttonAddNewItemEl.addEventListener('click', () => {
  const { amountTotal, ...rest } = item;
  const isValidItem = Object.values(rest).every((item) => item.valid);
  divElement.textContent = 'required field';
  if (!isValidItem) {
    itemsInputEl.forEach((input) => {
      if (input.value === '') {
        divElement.classList.add('error');
        input.classList.add('error');
      }
    });
    itemContainerElement.insertAdjacentElement('beforeend', divElement);
    // return;
  } else {
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
      value = "${item.name.value}"
      type="text" />     
      </div> 
      <div class="textfield Qty">
      <label class="text-body1 textfield__label">Qty.</label>
      <input
      class="text-h4 textfield__input input-fieldItem disabled" disabled
      id="putcuantity"
      name="quantity"
      value="${item.quantity.value}"
      type="text" />
      </div>
      <div class="textfield price">
      <label class="text-body1 textfield__label">Price</label>
      <input
      class="text-h4 textfield__input input-fieldItem disabled" disabled
      id="putprice"
      name="price"
      value="${item.price.value}"
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
      //clean values of items//
    });
    item = {
      name: {
        value: '',
        valid: false,
      },
      quantity: {
        value: '',
        valid: false,
      },
      price: {
        value: '',
        valid: false,
      },
    };
    imputValueEl.textContent = '';
    itemsInputEl.forEach((input) => {
      input.value = '';
    });
  }
});
cleanButtonEl.addEventListener('click', () => {
  item = {
    name: {
      value: '',
      valid: false,
    },
    quantity: {
      value: '',
      valid: false,
    },
    price: {
      value: '',
      valid: false,
    },
  };
  itemsInputEl.forEach((item) => {
    item.value = '';
  });
  imputValueEl.textContent = '';
});

//rest fields//
let allFields = {
  status: '',
  description: {
    value: '',
    valid: false,
  },
  streetAddress: {
    value: '',
    valid: false,
  },
  city: {
    value: '',
    valid: false,
  },
  postCode: {
    value: '',
    valid: false,
  },
  country: {
    value: '',
    valid: false,
  },
  currencyCountry: 'USD',
  clientName: {
    value: '',
    valid: false,
  },
  clientEmail: {
    value: '',
    valid: false,
  },
  clientStreetAddress: {
    value: '',
    valid: false,
  },
  clientCity: {
    value: '',
    valid: false,
  },
  clientPostCode: {
    value: '',
    valid: false,
  },
  clientCountry: {
    value: '',
    valid: false,
  },
  invoiceDate: {
    value: '',
    valid: false,
  },
  dueDate: {
    value: '',
    valid: false,
  },
  amount: {
    value: 0,
    valid: false,
  },
  invoiceItems: {
    value: [],
    valid: false,
  },
};

const errorInputsEl = newInvoiceAllContentEl.querySelectorAll('#inputError');
errorInputsEl.forEach((span) => {
  if (imputsFieldsEl !== '') {
    span.style.display = 'none';
  }
});
imputsFieldsEl.forEach((input) => {
  input.addEventListener('input', (event) => {
    input.classList.remove('error');
    input.nextElementSibling.style.display = 'none';
    const isValidFields = event.target.value !== '';
    const separateObjct = event.target.name.split('-');
    allFields = {
      ...allFields,
      [separateObjct[1]]: {
        value: event.target.value,
        valid: isValidFields,
      },
    };
  });
  console.log(item);
});

//object to backend//
function formatInvoice(data, dueDate, amount, invoiceItems) {
  return {
    status: data.status,
    description: data.description.value,
    streetAddress: data.streetAddress.value,
    city: data.city.value,
    postCode: data.postCode.value,
    country: data.country.value,
    currencyCountry: data.currencyCountry,
    clientName: data.clientName.value,
    clientEmail: data.clientEmail.value,
    clientStreetAddress: data.clientStreetAddress.value,
    clientCity: data.clientCity.value,
    clientPostCode: data.clientPostCode.value,
    clientCountry: data.clientCountry.value,
    invoiceDate: newInvoiceDatepicker.selectedDatepicker,
    dueDate,
    amount,
    invoiceItems,
  };
}

let formFields = {};
function setTime() {
  setTimeout(function () {
    succesfullCreate.style.display = 'none';
  }, 4000);
}
function succesNotificacion() {
  closeModal();
  succesfullCreate.style.display = 'flex';
}

async function methodPost() {
  const total = items
    .map((item) => item.amountTotal)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  const itemsN = items.map((item) => ({
    name: item.name.value,
    quantity: item.quantity.value,
    price: item.price.value,
  }));

  const daysToPayment = parseInt(newInvoiceDropdown.selectedOption ?? 0);
  const dueDate = addDays(
    newInvoiceDatepicker.selectedDatepicker,
    daysToPayment
  );

  formFields = {
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

  formFields = formatInvoice(allFields, dueDate, total, itemsN);
  //fecth//
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
    setTime();
    succesNotificacion();
    console.log('Respuesta:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

//valid all inputs//
const isCleanFields = document.querySelectorAll('[name*= "clean"]');
function isAllComplete() {
  const {
    status,
    currencyCountry,
    amount,
    invoiceItems,
    dueDate,
    invoiceDate,
    ...rest
  } = allFields;
  const validInput = Object.values(rest).every((allFields) => allFields.valid);
  console.log(validInput);
  if (validInput & (itemsLisEl.children.length > 0)) {
    methodPost();
  } else {
    isCleanFields.forEach((input) => {
      if (input.value === '') {
        input.classList.add('error');
        input.nextElementSibling.style.display = 'block';
      }
    });
    divElement.textContent = 'required field';
    itemContainerElement.insertAdjacentElement('beforeend', divElement);
    itemsInputEl.forEach((input) => {
      if (input.value === '') {
        divElement.classList.add('error');
        input.classList.add('error');
      }
    });
  }
}

//events//
buttonSaveEl.addEventListener('click', async () => {
  allFields = {
    ...allFields,
    status: 'PENDING',
  };
  isAllComplete();
});
buttonDraftEl.addEventListener('click', async () => {
  allFields = {
    ...allFields,
    status: 'DRAFT',
  };
  isAllComplete();
});
