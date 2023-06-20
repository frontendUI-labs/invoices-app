import Router from '../utils/router.js';
import { format } from 'date-fns';
import Dropdown from '../js/dropdown';
import { loadInvoices } from './listinvoice';
import Datepicker from '../js/datepicker';
import { differenceInCalendarDays } from 'date-fns';

const loading = document.querySelector('#loaderDetails');
async function getInvoice() {
  const { pathname } = window.location;
  const paths = pathname.split('/');
  const invoiceId = paths[2];
  if (!invoiceId) return;
  try {
    const response = await fetch(
      `https://invoice-services.onrender.com/api/invoice/${invoiceId}`
    );
    const data = await response.json();
    return data.data;
  } catch (err) {
    console.log(err.message);
  } finally {
    loading.remove();
  }
}

function createDOM(string) {
  const parser = new DOMParser();
  const HTML = parser.parseFromString(string, 'text/html');
  return HTML.body.firstChild;
}

function deleteConfirm(invoiceDetails) {
  const deletePopup = document.querySelector('#deletePopup');
  const itemCode = invoiceDetails.id.substr(0, 8).toUpperCase();
  const popUpDOM = `<h2 class="text-h2 delete__title">Confirm Deletion</h2>
  <p class="text-body2 delete__description">
  Are you sure you want to delete invoice <span id="deleteCode">#${itemCode}</span>? This
  action cannot be undone.
  </p>`;
  deletePopup.innerHTML = popUpDOM;
}

async function loadInvoice() {
  const invoiceDetails = await getInvoice();
  if (invoiceDetails == null) {
    return;
  }
  getUserDetails(invoiceDetails);
  deleteConfirm(invoiceDetails);
}

async function getUserDetails(invoiceDetails) {
  const itemCode = invoiceDetails.id.substr(0, 8).toUpperCase();
  const description = invoiceDetails.description;
  const address = invoiceDetails.streetAddress;
  const city = invoiceDetails.city;
  const postalCode = invoiceDetails.postCode;
  const country = invoiceDetails.country;
  // fecha de inicial de invoice
  const $invoiceDate = new Date(invoiceDetails.invoiceDate);
  const allformatInvoice = format($invoiceDate, 'd MMM YYY');
  // fecha final de invoice
  const invoiceDue = new Date(invoiceDetails.dueDate);
  const allformatInvoiceDue = format(invoiceDue, 'd MMM YYY');
  // client information
  const userName = invoiceDetails.clientName;
  const userAddress = invoiceDetails.clientStreetAddress;
  const userCity = invoiceDetails.clientCity;
  const userPostalCode = invoiceDetails.clientPostCode;
  const userCountry = invoiceDetails.clientCountry;
  const userMail = invoiceDetails.clientEmail;

  const totalInvoicesPrice = invoiceDetails.amount;
  // AQOIOOOOOOOOOOOOOOOO
  const statusClassNamesMap = {
    PENDING: 'pending',
    PAID: 'paid',
    DRAFT: 'draft',
  };

  const statusInvoice = invoiceDetails.status.toLowerCase();
  const container = document.querySelector('#invoiceDetails');

  let unshiftPriceItems = [];
  let createPriceItems = {
    name: {
      value: '',
      valid: false,
    },
    price: {
      value: '',
      valid: false,
    },
    quantity: {
      value: '',
      valid: false,
    },
  };

  const itemsEl = invoiceDetails.invoiceItems
    .map((item) => {
      createPriceItems = {
        name: {
          value: item.name,
          valid: item.name !== '',
        },
        price: {
          value: item.price,
          valid: item.price !== '',
        },
        quantity: {
          value: item.quantity,
          valid: item.quantity !== '',
        },
        totalAmount: {
          value: parseInt(item.price * item.quantity),
          valid: parseInt(item.price * item.quantity) !== '',
        },
      };
      unshiftPriceItems.unshift(createPriceItems.totalAmount.value);

      const invoiceItemName = item.name;
      const invoiceItemQuantity = item.quantity;
      const invoiceItemPrice = item.price;
      const totalInvoicePrice = parseInt(
        invoiceItemQuantity * invoiceItemPrice
      );

      return `<li class="viewInvoice__details__first__billing">
    <p
      class="text-h4 viewInvoice__details__first__billing__title" id="lala">
      ${invoiceItemName}
    </p>
    <dd
      class="text-h4 viewInvoice__details__first__billing__unit mobile">
      ${invoiceItemQuantity} x $ ${invoiceItemPrice}
    </dd>
    <dd
      class="text-h4 viewInvoice__details__first__billing__cant desktop">
      ${invoiceItemQuantity}
    </dd>
    <dd
      class="text-h4 viewInvoice__details__first__billing__price desktop">
      $ ${invoiceItemPrice}
    </dd>
    <dd
      class="text-h3 viewInvoice__details__first__billing__totalPrice" id="totalPrice">
      $ ${totalInvoicePrice}
    </dd>
  </li>`;
    })
    .join('');

  const totalinputsValue = unshiftPriceItems
    .map((value) => value)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  console.log(totalinputsValue);
  const invoiceDetailsDOM = createDOM(`<div class="viewInvoice__status">
  <div class="viewInvoice__summary">
  <div class="viewInvoice__summary__main">
  <dt class="text-body1 viewInvoice__summary__title">Status</dt>
  <div class="viewInvoice__summary__button list__details__status--${statusInvoice}" id="statusPaidBackground">
    <div class="viewInvoice__summary__button__icon list__status__point--${statusInvoice}" id="buttonIcon"></div>
    <dd
      class="text-h4 list__status__statuspage--${statusInvoice}"
      id="statusInvoice">
      ${statusInvoice.toUpperCase()}
    </dd>
  </div>
  </div>
  <div class="viewInvoice__buttons">
    <button class="text-h4 button button--secondary" id="editDetailInvoice">Edit</button>
    <button class="text-h4 button button--danger" id="deleteInvoice">Delete</button>
    <button class="text-h4 button button--primary" id="MarkAsPaid">
      Mark as Paid
    </button>
  </div>
</div>
<div class="viewInvoice__details">
  <div class="viewInvoice__details__information">
  <div class="invoiceID__desktop">
    <div class="viewInvoice__details__top">
      <div class="viewInvoice__details__title">
        <span class="text-h4 viewInvoice__details__hash"
          >#</span
        >
        <dd
          class="text-h4 viewInvoice__details__number"
          id="itemCode">
          ${itemCode}
        </dd>
      </div>
      <dd
        class="text-body1 viewInvoice__details__text"
        id="jobDescription">
        ${description}
      </dd>
    </div>
    <dd class="text-body1 viewInvoice__ditails__address">
      <span class="Invoice__Address" id="invoiceAdress"
        >${address}</span
      >
      <span class="Invoice__Address" id="invoiceCity"
        >${city}</span
      >
      <span class="Invoice__Address" id="invoiceNumber"
        >${postalCode}</span
      >
      <span class="Invoice__Address" id="invoicecountry"
        >${country}</span
      >
    </dd>
  </div>
</div>
<div class="detail__billing_mail1" >
  <div class="viewInvoice__details__date__bill">
    <div class="viewInvoice__details__date">
      <div class="viewInvoice__details__initialDate">
        <dt
          class="text-body1 viewInvoice__details__initialDate__title">
          Invoice Date
        </dt>
        <dd
          class="text-h3 viewInvoice__details__initialDate__text" id="invoiceDate">
          ${allformatInvoice}
        </dd>
      </div>
      <div class="viewInvoice__details__dueDate">
        <dt
          class="text-body1 viewInvoice__details__dueDate__title">
          Payment Due
        </dt>
        <dd class="text-h3 viewInvoice__details__dueDate__text" id="invoiceDue">
        ${allformatInvoiceDue}
        </dd>
      </div>
    </div>
    <div class="viewInvoice__details__bill">
      <dt class="text-body1 viewInvoice__details__bill__title">
        Bill To
      </dt>
      <dd class="text-h3 viewInvoice__details__bill__name" id="userName"> 
      ${userName}
      </dd>
      <dd
        class="text-body1 viewInvoice__details__bill__addreess">
        <span class="Invoice__Address" id="userAddress">${userAddress}</span>
        <span class="Invoice__Address" id="userCity">${userCity}</span>
        <span class="Invoice__Address" id="userPostalcode">${userPostalCode}</span>
        <span class="Invoice__Address" id="userCountry">${userCountry}</span>
      </dd>
    </div>
  </div>
  <div class="viewInvoice__details__sent">
    <dt class="text-body1 viewInvoice__details__sent__title">
      Sent to
    </dt>
    <dd class="text-h3 viewInvoice__details__sent__mail" id="userMail">
    ${userMail}
    </dd>
  </div>
</div>
    <div class="viewInvoice__details__billing">
      <div class="viewInvoice__details__billing__title desktop">
        <h3
          class="text-body1 viewInvoice__details__billing__ItemName">
          Item Name
        </h3>

        <h3
          class="text-body1 viewInvoice__details__billing__quantity">
          QTY.
        </h3>
        <h3
          class="text-body1 viewInvoice__details__billing__itemPrice">
          Price
        </h3>
        <h3 class="text-body1 viewInvoice__details__billing__total">
          Total
        </h3>
      </div>
      <ul class="viewInvoice__details__billing__firstSecond">
      ${itemsEl}
      </ul>
      <div class="viewInvoice__details__total__billing__section">
      <div class="viewInvoice__details__total__billing" >
      <dt
        class="text-body2 viewInvoice__details__total__billing__title mobile">
        Grand Total
      </dt>
      <dt
        class="text-body2 viewInvoice__details__total__billing__title desktop">
        Amount Due
      </dt>
      <dd
        class="text-h2 viewInvoice__details__total__billing__final"
        >
        $ ${totalinputsValue}
      </dd>
    </div>
      </div>
    </div>
  </div>
  </div>
</div>
</div>`);
  container.append(invoiceDetailsDOM);

  const openModal = document.querySelector('#deleteInvoice');
  const modal = document.querySelector('#modal');
  const closeModal = document.querySelector('#closeModal');
  const deleteInvoidebyID = document.querySelector('#deleteInvoidebyID');
  const succefullDelete = document.querySelector('#succefullDelete');

  const closeConfirmationDelete = document.querySelector('#succefullDelete');
  const listinvoice = document.querySelector('.list__content__wraper');

  async function deleteinvoiceID() {
    try {
      const response = await fetch(
        `https://invoice-services.onrender.com/api/invoice/${invoiceDetails.id}`,
        {
          method: 'DELETE',
        }
      );
      const data = await response.json();
      closePopupConfirmation();
      Router.go('/');
      showNotification();
      loadInvoices();
    } catch (err) {
      console.log(err.message);
    }
  }

  deleteInvoidebyID.addEventListener('click', deleteinvoiceID);
  openModal.addEventListener('click', openPopupConfirmation);
  closeModal.addEventListener('click', closePopupConfirmation);
  document.addEventListener('keydown', closePopupConfirmationbyKey);
  closeConfirmationDelete.addEventListener('click', closeConfirmatioDelete);

  function openPopupConfirmation() {
    modal.style.display = 'flex';
    modal.show();
  }
  function closePopupConfirmation() {
    modal.style.display = 'none';
    modal.close();
    setTimeout(function () {
      succefullDelete.style.display = 'none';
    }, 5000);
  }
  function closePopupConfirmationbyKey(event) {
    if (event.code === 'Escape') {
      modal.close();

      modal.style.display = 'none';
    }
  }

  function closeConfirmatioDelete() {
    succefullDelete.style.display = 'none';
  }

  function showNotification() {
    succefullDelete.style.display = 'flex';
  }
  const paidButton = document.querySelector('#MarkAsPaid');
  paidButton.addEventListener('click', changeStatusInvoice);

  async function changeStatusInvoice() {
    try {
      const response = await fetch(
        `https://invoice-services.onrender.com/api/invoice`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: invoiceDetails.id,
            status: 'PAID',
          }),
        }
      );
      const data = await response.json();
      container.innerHTML = '';
      await loadInvoice();
    } catch (err) {
      console.log(err.message);
    }
  }

  // EDIT INBOICES

  const editDetailButton = document.querySelector('#editInvoiceDialog');
  const buttonAddNewItemEl = document.querySelector('#buttonEditItem');
  const itemsInputEl = editDetailButton.querySelectorAll('.input-fieldItem');
  const imputValueEl = editDetailButton.querySelector(
    '.total__imput__borderColor'
  );
  const cleanButtonEl = document.querySelector('#cleanCalc');
  const editInvoiceDetails = document.querySelector('#editDetailInvoice');
  editInvoiceDetails.addEventListener('click', openEditInvoice);
  function openEditInvoice() {
    document.body.style.overflow = 'hidden';
    editDetailButton.style.overflow = 'auto';
    editDetailButton.show();
    editDetailButton.style.display = 'flex';
    const showItemsDetailed = document.querySelector('#keepNewItems');

    let emptyArr = [];
    let getInvoiceDetails = {
      name: {
        value: '',
        valid: true,
      },
      precio: {
        value: '',
        valid: true,
      },
      quantity: {
        value: '',
        valid: true,
      },
    };
    // const detailedItemsChanges = {
    //     id: invoiceItem.id,
    //     name: invoiceItem.name,
    //     quantity: invoiceItem.quantity,
    //     price: invoiceItem.price,
    //     totalAmmount: invoiceItem.quantity * invoiceItem.price,
    //   };

    invoiceDetails.invoiceItems.map((invoiceItem) => {
      getInvoiceDetails = {
        name: {
          value: invoiceItem.name,
          valid: invoiceItem.name !== '',
        },
        price: {
          value: invoiceItem.price,
          valid: invoiceItem.price !== '',
        },
        quantity: {
          value: invoiceItem.quantity,
          valid: invoiceItem.quantity !== '',
        },
      };
      emptyArr.unshift(getInvoiceDetails);
      console.log(emptyArr, 'emptyArr');

      const editItemsDetails = createDom(`<div class="itemList__calc">
        <div class="textfield itemName">
        <label class="text-body1 textfield__label"
        >Item Name</label
        >
        <input
        class="text-h4 textfield__input input-fieldItem disabled" disabled
        name="name"
        value = "${invoiceItem.name}"
        type="text" />     
        </div> 
        <div class="textfield Qty">
        <label class="text-body1 textfield__label">Qty.</label>
        <input
        class="text-h4 textfield__input input-fieldItem disabled" disabled
        id="putcuantity"
        name="quantity"
        value="${invoiceItem.quantity}"
        type="text" />
        </div>
        <div class="textfield price">
        <label class="text-body1 textfield__label">Price</label>
        <input
        class="text-h4 textfield__input input-fieldItem disabled" disabled
        id="putprice"
        name="price"
        value="${invoiceItem.price}"
        type="text" />
        </div>
        <div class="textfield total disabled">
        <div class="text-body1 textfield__label">Total</div>
        <div class="total__imput">
        <div
        class="text-h4 textfield__input total__imput__borderColor">${parseInt(
          invoiceItem.quantity * invoiceItem.price
        )} </div>
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
      showItemsDetailed.append(editItemsDetails);

      const iconRemovenewEl = editItemsDetails.querySelector('button');
      iconRemovenewEl.addEventListener('click', deleteItems);
      async function deleteItems() {
        try {
          const response = await fetch(
            `https://invoice-services.onrender.com/api/invoice-item/${invoiceItem.id}`,
            {
              method: 'DELETE',
            }
          );
          const data = await response.json();
          console.log('funciono');
          editItemsDetails.remove();
          container.innerHTML = '';
          await loadInvoice();
          // closePopupConfirmation();
          // Router.go('/');
          // showNotification();
          // loadInvoices();
        } catch (err) {
          console.log(err.message);
        }
      }

      itemsInputEl.forEach((input) => {
        input.addEventListener('input', (event) => {
          itemsList = {
            ...itemsList,
            [event.target.name]: event.target.value,
          };

          //calculadora//
          if (
            event.target.name === 'quantity' ||
            event.target.name === 'price'
          ) {
            let amountTotalValue = itemsList.quantity * itemsList.price;
            itemsList = {
              ...itemsList,
              price: parseInt(itemsList.price),
              quantity: parseInt(itemsList.quantity),
              // amount: amountTotalValue,
            };

            imputValueEl.textContent = amountTotalValue;
          }
        });
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.code === 'Escape') {
        closeEditModal();
      }
    });
    function closeEditModal() {
      editDetailButton.close();
      document.body.style.overflow = 'auto';
      testinput.innerHTML = '';
      editDetailButton.style.display = 'none';
    }
    const buttonDiscardEl = document.querySelector('#buttonDiscard');
    buttonDiscardEl.addEventListener('click', () => {
      closeEditModal();
    });

    //valid inputs//
    const prueba = editDetailButton.querySelector('#editItemNameError');

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
    let itemsDetailsList = [];
    let itemsList = {
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

    function createDom(string) {
      const stringToNodo = new DOMParser();
      const inserToHTML = stringToNodo.parseFromString(string, 'text/html');
      return inserToHTML.body.firstChild;
    }

    const itemsLisEl = document.querySelector('#editNewItems');
    buttonAddNewItemEl.addEventListener('click', () => {
      itemsLisEl.innerHTML = '';
      itemsDetailsList.unshift(itemsList);
      itemsDetailsList.forEach((item) => {
        itemsList = {
          name: {
            value: item.name,
            valid: item.name !== '',
          },
          quantity: {
            value: item.quantity,
            valid: item.quantity !== '',
          },
          price: {
            value: item.price,
            valid: item.price !== '',
          },
        };

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
        class="text-h4 textfield__input total__imput__borderColor">${parseInt(
          item.quantity * item.quantity
        )}</div>
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
          itemsDetailsList = itemsDetailsList.filter((savedItem) => {
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

    const result = differenceInCalendarDays(
      new Date(allformatInvoiceDue),
      new Date(allformatInvoice)
    );

    const testInputValue = document.querySelector('#testDeInputs');
    const testinput = createDOM(`<div id="testDeInputs">
  <div class="text-h2 editInvoice__title" id="editInvoiceCode">
    <h1 class="text-h2 editInvoice__maintitle">Edit</h1>
    <dd class="text-h2 editInvoice__details__hash">#</dd>
    <dd class="text-h2">${itemCode}</dd>
  </div>

  <div class="editInvoice__bill form">
    <h2 class="text-h4 bill__subtitle">Bill From</h2>
    <div class="textfield streetAddress" id="testInputValue">
      <label class="text-body1 textfield__label"
        >Street Address</label
      >
      <input
        class="text-h4 textfield__input input-Rest"
        name="edit-streetAddress"
        value="${address}"
        type="text" />
    <span class="error emptyInput">this field is required</span>

    </div>
    <div class="bill__cityCodeCountry">
      <div class="textfield city">
        <label class="text-body1 textfield__label">City</label>
        <input
          class="text-h4 textfield__input input-Rest"
          name="edit-city"
          value="${city}"
          type="text" />
    <span class="error emptyInput">this field is required</span>

      </div>
      <div class="textfield postCode">
        <label class="text-body1 textfield__label">Post Code</label>
        <input
          class="text-h4 textfield__input input-Rest"
          name="edit-postCode"
          value="${postalCode}"
          type="text" />
    <span class="error emptyInput">this field is required</span>

      </div>
      <div class="textfield country">
        <label class="text-body1 textfield__label">Country</label>
        <input
          class="text-h4 textfield__input input-Rest"
          name="edit-country"
          value="${country}"

          type="text" />
    <span class="error emptyInput">this field is required</span>

      </div>
    </div>
  </div>
  <div class="editInvoice__bill to">
    <h2 class="text-h4 bill__subtitle">Bill To</h2>
    <div class="textfield clientName">
      <label class="text-body1 textfield__label"
        >Client’s Name</label
      >
      <input
        class="text-h4 textfield__input input-Rest"
        name="edit-clientName"
        value="${userName}"
        type="text" />
    <span class="error emptyInput">this field is required</span>

    </div>
    <div class="textfield clientEmail">
      <label class="text-body1 textfield__label"
        >Client’s Email</label
      >
      <input
        class="text-h4 textfield__input input-Rest"
        name="edit-clientEmail"
        value="${userMail}"
        type="text" />
    <span class="error emptyInput">this field is required</span>

    </div>
    <div class="textfield streetAddress">
      <label class="text-body1 textfield__label"
        >Street Address</label
      >
      <input
        class="text-h4 textfield__input input-Rest"
        name="edit-clientStreetAddress"
        value="${userAddress}"
        
        type="text" />
        <span class="error emptyInput">this field is required</span>
    </div>
    <div class="bill__cityCodeCountry">
      <div class="textfield city">
        <label class="text-body1 textfield__label">City</label>
        <input
          class="text-h4 textfield__input input-Rest"
          name="edit-clientCity"
          value="${userCity}"
          type="text" />
    <span class="error emptyInput">this field is required</span>

      </div>
      <div class="textfield postCode">
        <label class="text-body1 textfield__label">Post Code</label>
        <input
          class="text-h4 textfield__input input-Rest"
          name="edit-clientPostCode"
          value="${userPostalCode}"
          type="text" />
    <span class="error emptyInput">this field is required</span>

      </div>
      <div class="textfield country">
        <label class="text-body1 textfield__label">Country</label>
        <input
          class="text-h4 textfield__input input-Rest"
          name="edit-clientCountry"
          value="${userCountry}"

          type="text" />
    <span class="error emptyInput">this field is required</span>

      </div>
    </div>
  </div>
  <div class="editInvoice__dueDate">
  <div class="datepicker" id="editInvoice-datepicker">
    <div class="datepicker__form">
      <span class="text-body1 datepicker__label">Issue Date</span>
      <button class="text-h4 datepicker__button input-Rest">
        <span class="datepicker__value">
        ${allformatInvoice}</span>
        <img src="../../icon/calendar.svg" alt="boton-de-calendario" />
      </button>
    </div>
    <div class="datepicker__calendar">
      <div class="datepicker__month">
        <button
          class="datepicker__monthButton datepicker__prevButton">
          <img
            class="datepicker__prevButtonImg"
            src="../../icon/arrowdown.svg"
            alt="boton-de-calendario" />
        </button>
        <span class="text-h4 calendar__title"></span>
        <button
          class="datepicker__monthButton datepicker__nextButton">
          <img
            class="datepicker__nextButtonImg"
            src="../../icon/arrowdown.svg"
            alt="boton-de-calendario" />
        </button>
      </div>
      <div class="text-h4 datepicker__weekdays">
        <span class="text-h4">Sun</span
        ><span class="text-h4">Mon</span
        ><span class="text-h4">Tue</span
        ><span class="text-h4">Wed</span
        ><span class="text-h4">Thu</span
        ><span class="text-h4">Fri</span
        ><span class="text-h4">Sat</span>
      </div>
      <div class="datepicker__days"></div>
    </div>
  </div>
  <div class="dropdown" id="editInvoice-dropdown">
    <div class="dropdown__form">
      <span class="text-body1 dropdown__label">Payment Terms</span>
      <button class="text-h4 dropdown__button input-Rest" id="menu">
        <span class="dropdown__text">Next ${result} days</span>
        <img
          class="dropdown__arrowrotate"
          src="../../icon/arrowdown.svg"
          alt="" />
      </button>
    </div>
    <div class="dropdown__list">
      <button class="dropdown__option" data-day="1">
        Next 1 Day
      </button>
      <button class="dropdown__option" data-day="7">
        Next 7 Days
      </button>
      <button class="dropdown__option" data-day="14">
        Next 14 Days
      </button>
      <button class="dropdown__option" data-day="30">
        Next 30 Days
      </button>
    </div>
  </div>
</div>
<div class="textfield project">
  <label class="text-body1 textfield__label"
    >Project Description</label
  >
  <input
    class="text-h4 textfield__input input-Rest"
    name="edit-description"
    value = "${description}"
    type="text" />
    <span class="error emptyInput">this field is required</span>

</div>
</div>`);
    testInputValue.append(testinput);

    let inputchanges = {
      description: {
        value: description,
        valid: description !== '',
      },
      streetAddress: {
        value: address,
        valid: address !== '',
      },
      city: {
        value: city,
        valid: city !== '',
      },
      postCode: {
        value: postalCode,
        valid: postalCode !== '',
      },
      country: {
        value: country,
        valid: country !== '',
      },
      clientName: {
        value: userName,
        valid: userName !== '',
      },
      clientEmail: {
        value: userMail,
        valid: userMail !== '',
      },
      clientStreetAddress: {
        value: userAddress,
        valid: userAddress !== '',
      },
      clientCity: {
        value: userCity,
        valid: userCity !== '',
      },
      clientPostCode: {
        value: userPostalCode,
        valid: userPostalCode !== '',
      },
      clientCountry: {
        value: userCountry,
        valid: userCountry !== '',
      },
    };

    // const inputPriceItems = document.querySelector('#editItemsInput')
    // const inputsInPrice = inputPriceItems.querySelectorAll('.textfield ')
    // const divInput = document.createElement('div');
    // console.log(createPriceItems);
    // itemsInputEl.forEach((input) => {
    //   input.addEventListener('input', (event) => {
    //     const isValidInput = event.target.value !== '';
    //     createPriceItems = {
    //       ...createPriceItems,
    //       [event.target.name]: {
    //         value: event.target.value,
    //         valid: isValidInput,
    //       },
    //     };
    //     if (isValidInput) {
    //       input.classList.remove('error');
    //       divInput.style.display = 'none';
    //     }

    //     //calculadora//
    //     if (event.target.name === 'quantity' || event.target.name === 'price') {
    //       let amountTotalValue = createPriceItems.quantity.value * createPriceItems.price.value;
    //       createPriceItems.price.value = parseInt(createPriceItems.price.value);
    //       createPriceItems.quantity.value = parseInt(createPriceItems.quantity.value);
    //       createPriceItems.amountTotal = amountTotalValue;
    //       imputValueEl.textContent = amountTotalValue;
    //     }
    //   });
    // });

    //   const total = items
    //   .map((item) => item.amountTotal)
    //   .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    // console.log(total, 'total');

    function saveInputchanges(data, invoiceItems) {
      return {
        id: invoiceDetails.id,
        description: data.description.value,
        streetAddress: data.streetAddress.value,
        city: data.city.value,
        postCode: data.postCode.value,
        country: data.country.value,
        currencyCountry: 'USD',
        clientName: data.clientName.value,
        clientEmail: data.clientEmail.value,
        clientStreetAddress: data.clientStreetAddress.value,
        clientCity: data.clientCity.value,
        clientPostCode: data.clientPostCode.value,
        clientCountry: data.clientCountry.value,
        invoiceItems,
      };
    }

    const buttonSaveEdit = document.querySelector('#buttonSaveEdit');
    const editElements = testinput.querySelectorAll('[name*="edit"]');

    editElements.forEach((input) => {
      input.addEventListener('input', (event) => {
        input.nextElementSibling.style.display = 'none';
        input.classList.remove('error');
        const separarObjeto = event.target.name.split('-');
        inputchanges = {
          ...inputchanges,
          [separarObjeto[1]]: {
            value: event.target.value,
            valid: event.target.value !== '',
          },
        };
      });
    });
    const showsuccedEdit = document.querySelector('#succefullSaved');
    function showNotificationSaved() {
      editDetailButton.close();
      showsuccedEdit.style.display = 'flex';
    }

    showsuccedEdit.addEventListener('click', closeSavedConfirmation);
    function closeSavedConfirmation() {
      editDetailButton.close();
      editDetailButton.style.display = 'none';
      setTimeout(function () {
        showsuccedEdit.style.display = 'none';
      }, 5000);
    }

    buttonSaveEdit.addEventListener('click', saveChangesOfInvoice);
    async function saveChangesOfInvoice() {
      // const { invoiceDetailTotal, ...rest } = inputchanges;
      const validInput = Object.values(inputchanges).every(
        (inputchanges) => inputchanges.valid
      );

      if (!validInput) {
        editElements.forEach((input) => {
          if (input.value === '') {
            input.nextElementSibling.style.display = 'block';
            input.classList.add('error');
          }
        });
      } else {
        const formatInputsChange = saveInputchanges(
          (inputchanges = { ...inputchanges, id: invoiceDetails.id }),
          itemsDetailsList
        );
        console.log(formatInputsChange, 'formatInputsChange');
        try {
          const response = await fetch(
            'https://invoice-services.onrender.com/api/invoice',
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(formatInputsChange),
            }
          );
          const data = await response.json();
          console.log('Logrado');
          showNotificationSaved();
          closeSavedConfirmation();
          container.innerHTML = '';
          testinput.innerHTML = '';
          await loadInvoice();
        } catch (err) {
          console.log(err.message);
        }
      }
    }

    const editInvoiceDatepicker = new Datepicker('#editInvoice-datepicker');
    editInvoiceDatepicker.render();
    const newInvoiceDropdown = new Dropdown('#editInvoice-dropdown');
    newInvoiceDropdown.render();
  }
}
loadInvoice();
