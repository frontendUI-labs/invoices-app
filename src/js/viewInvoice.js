const ID_API = 'd618a117-46c0-4651-8246-a2d455c3b18e';

const loading = document.querySelector('#loaderDetails');
async function getInvoices() {
  try {
    const response = await fetch(
      `https://invoice-services.onrender.com/api/invoice/${ID_API}`
    );
    const data = await response.json();
    return data.data;
  } catch (err) {
    console.log(err.message);
  } finally {
    loading.remove();
  }
}

async function configInvoices() {
  const GetInvoicebyID = await getInvoices();

  templateDetails();
  UserDetails();
  itemSummary();
  totalPriceofInvoice();
  return GetInvoicebyID;
}

async function templateDetails() {
  const GetInvoicebyID = await getInvoices();

  const statusClassNamesMap = {
    PENDING: 'pending',
    PAID: 'paid',
    DRAFT: 'draft',
  };
  const statusInvoice = GetInvoicebyID.status.toLowerCase();
  const HTMLStatus = `<dt class="text-body1 viewInvoice__summary__title">Status</dt>
    <div class="viewInvoice__summary__button list__details__status--${statusInvoice}" >
      <div class="viewInvoice__summary__button__icon list__status__point--${statusInvoice}"></div>
      <dd
        class="text-h4 list__status__statuspage--${statusInvoice}"
        id="statusInvoice">
        ${statusInvoice.toUpperCase()}
      </dd>
    </div>`;

  const statusOfEachInvoice = document.querySelector('#statusOfEachInvoice');
  statusOfEachInvoice.innerHTML = HTMLStatus;
}

async function UserDetails() {
  const GetInvoicebyID = await getInvoices();

  const itemCode = GetInvoicebyID.id.substr(0, 8).toUpperCase();
  const description = GetInvoicebyID.description;
  const address = GetInvoicebyID.streetAddress;
  const city = GetInvoicebyID.city;
  const postalCode = GetInvoicebyID.postCode;
  const country = GetInvoicebyID.country;
  // fecha de inicial de invoice
  const InvoiceDate = new Date(GetInvoicebyID.invoiceDate);
  const getDay = InvoiceDate.getDate();
  const $invoiceDate = InvoiceDate.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
  const allformatInvoice = getDay + 1 + ' ' + $invoiceDate;
  // fecha final de invoice
  const InvoiceDue = new Date(GetInvoicebyID.dueDate);
  const getdueDate = InvoiceDue.getDate();
  const $invoiceDue = InvoiceDue.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
  const allformatInvoiceDue = getdueDate + 1 + ' ' + $invoiceDue;
  // client information
  const userName = GetInvoicebyID.clientName;
  const userAddress = GetInvoicebyID.clientStreetAddress;
  const userCity = GetInvoicebyID.clientCity;
  const userPostalCode = GetInvoicebyID.clientPostCode;
  const userCountry = GetInvoicebyID.clientCountry;
  const userMail = GetInvoicebyID.clientEmail;

  const HTMLUserInfo = `<div class="viewInvoice__details__information">
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
  </div>`;

  const invoiceContainer = document.querySelector('#viewInvoiceDetails');

  invoiceContainer.innerHTML = HTMLUserInfo;
}

async function itemSummary() {
  const GetInvoicebyID = await getInvoices();

  const itemName = GetInvoicebyID.invoiceItems[0].name;
  const itemQuantity = GetInvoicebyID.invoiceItems[0].quantity;
  const itemPrice = GetInvoicebyID.invoiceItems[0].price;
  const totalPriceNumber = parseInt(itemPrice * itemQuantity);

  const HTMLDestails = `<li class="viewInvoice__details__first__billing">
    <p
      class="text-h4 viewInvoice__details__first__billing__title" id="lala">
      ${itemName}
    </p>
    <dd
      class="text-h4 viewInvoice__details__first__billing__unit mobile">
      ${itemQuantity} x £ ${itemPrice}
    </dd>
    <dd
      class="text-h4 viewInvoice__details__first__billing__cant desktop">
      ${itemQuantity}
    </dd>
    <dd
      class="text-h4 viewInvoice__details__first__billing__price desktop">
      £ ${itemPrice}
    </dd>
    <dd
      class="text-h3 viewInvoice__details__first__billing__totalPrice" id="totalPrice">
      £ ${totalPriceNumber}
    </dd>
  </li>`;

  const productLists = document.querySelector('#detailLists');
  productLists.innerHTML = HTMLDestails;
}

async function totalPriceofInvoice() {
  const GetInvoicebyID = await getInvoices();

  const totalInvoicesPrice = GetInvoicebyID.amount;

  const HTMLPrices = `<div class="viewInvoice__details__total__billing" >
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
      £ ${totalInvoicesPrice}
    </dd>
  </div>`;

  const totalInvoiceAmount = document.querySelector('#totalInvoicesPrices');
  totalInvoiceAmount.innerHTML = HTMLPrices;
}
configInvoices();

// function statusName() {
//   const status = document.querySelector('#statusInvoice');
//   currentInvoice.push('currentStatus')
//   status.textContent = currentInvoice;
// }
