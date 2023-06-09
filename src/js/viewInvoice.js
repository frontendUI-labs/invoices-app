import Router from '../utils/router.js';
import { getDate } from 'date-fns'
import { format } from 'date-fns'



const loading = document.querySelector('#loaderDetails');
async function getInvoice() {
  const { pathname } = window.location;
  const paths = pathname.split('/');
  const invoiceId = paths[2];
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

export async function getUserDetails(invoiceDetails) {
  const itemCode = invoiceDetails.id.substr(0, 8).toUpperCase();
  const description = invoiceDetails.description;
  const address = invoiceDetails.streetAddress;
  const city = invoiceDetails.city;
  const postalCode = invoiceDetails.postCode;
  const country = invoiceDetails.country;
  // fecha de inicial de invoice
  const invoiceDate = new Date(invoiceDetails.invoiceDate);
  const allformatInvoice = format(invoiceDate, 'd MMM YYY');
  // fecha final de invoice
  const invoiceDue = new Date(invoiceDetails.dueDate);
  const allformatInvoiceDue = format(invoiceDue, 'd MMM YYY');
;
  // client information
  const userName = invoiceDetails.clientName;
  const userAddress = invoiceDetails.clientStreetAddress;
  const userCity = invoiceDetails.clientCity;
  const userPostalCode = invoiceDetails.clientPostCode;
  const userCountry = invoiceDetails.clientCountry;
  const userMail = invoiceDetails.clientEmail;
  const totalInvoicesPrice = invoiceDetails.amount;
  const statusClassNamesMap = {
    PENDING: 'pending',
    PAID: 'paid',
    DRAFT: 'draft',
  };
  const statusInvoice = invoiceDetails.status.toLowerCase();
  const container = document.querySelector('#invoiceDetails');
  const itemsEl = invoiceDetails.invoiceItems
    .map((item) => {
      return `<li class="viewInvoice__details__first__billing">
    <p
      class="text-h4 viewInvoice__details__first__billing__title" id="lala">
      ${item.name}
    </p>
    <dd
      class="text-h4 viewInvoice__details__first__billing__unit mobile">
      ${item.quantity} x $ ${item.price}
    </dd>
    <dd
      class="text-h4 viewInvoice__details__first__billing__cant desktop">
      ${item.quantity}
    </dd>
    <dd
      class="text-h4 viewInvoice__details__first__billing__price desktop">
      $ ${item.price}
    </dd>
    <dd
      class="text-h3 viewInvoice__details__first__billing__totalPrice" id="totalPrice">
      $ ${parseInt(item.price * item.quantity)}
    </dd>
  </li>`;
    })
    .join('');

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
    <button class="text-h4 button button--secondary">Edit</button>
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
        $ ${totalInvoicesPrice}
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
    } catch (err) {
      console.log(err.message);
    }
  }

  deleteInvoidebyID.addEventListener('click', deleteinvoiceID);
  openModal.addEventListener('click', openPopupConfirmation);
  closeModal.addEventListener('click', closePopupConfirmation);
  closeModal.addEventListener('keydown', closePopupConfirmationbyKey);
  closeConfirmationDelete.addEventListener('click', closeConfirmatioDelete);

  function openPopupConfirmation() {
    modal.style.display = 'flex';
    modal.showModal();
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
}
loadInvoice();
