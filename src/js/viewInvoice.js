let currentInvoice;

fetch(
  `https://invoice-services.onrender.com/api/invoice/f1c9b66d-b75d-4fe0-8885-17b8f9d676ea`
)
  .then((response) => {
    return response.json().then((data) => {
      currentInvoice = data.data;
      statusName();
      templateDetails();
      itemSummary();
    });
  })
  .catch((error) => {
    console.log('Ups, salio algo mal!');
  });


  

function statusName() {
  const status = document.querySelector('#statusInvoice');
  status.textContent = currentInvoice.status;
}

function templateDetails() {
  const itemCode = currentInvoice.id.substr(0, 8).toUpperCase();
  const description = currentInvoice.description;
  const address = currentInvoice.streetAddress;
  const city = currentInvoice.city;
  const postalCode = currentInvoice.postCode;
  const country = currentInvoice.country;
  // fecha de inicial de invoice
  const InvoiceDate = new Date(currentInvoice.invoiceDate);
  const getDay = InvoiceDate.getDate();
  const $invoiceDate = InvoiceDate.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
  const allformatInvoice = getDay + 1 + ' ' + $invoiceDate;
  // fecha final de invoice
  const InvoiceDue = new Date(currentInvoice.dueDate);
  const getdueDate = InvoiceDue.getDate();
  const $invoiceDue = InvoiceDue.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
  const allformatInvoiceDue = getdueDate + 1 + ' ' + $invoiceDue;
  // client information
  const userName = currentInvoice.clientName;
  const userAddress = currentInvoice.clientStreetAddress;
  const userCity = currentInvoice.clientCity;
  const userPostalCode = currentInvoice.clientPostCode;
  const userCountry = currentInvoice.clientCountry;
  const userMail = currentInvoice.clientEmail;

  const invoiceContainer = document.querySelector('#viewInvoiceDetails');
  const HTML = `<div class="viewInvoice__details__information">
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

  return (invoiceContainer.innerHTML = HTML);
}

function itemSummary() {
  const renderItems = currentInvoice.invoiceItems.map((item)=>{

    // fisrt item summary
  
   
  // second item summary
  
    const itemName = item.name;
    const itemQuantity = item.quantity;
    const itemPrice = item.price;
    const totalPriceNumber = parseInt(itemPrice * itemQuantity)


    return `<li class="viewInvoice__details__first__billing">
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
  </li>`
  })
  const productLists = document.querySelector('#detailLists')
  const joinProductList = renderItems.join('')
  productLists.innerHTML = joinProductList
  
  const totalInvoiceAmount = document.querySelector('#totalInvoicesPrices')
  const totalInvoicesPrice = currentInvoice.amount
  totalInvoiceAmount.innerHTML = '£ ' + totalInvoicesPrice

}


// function statusName() {
//   const status = document.querySelector('#statusInvoice');
//   currentInvoice.push('currentStatus')
//   status.textContent = currentInvoice;
// }
