const newInvoiceAllContentEl = document.querySelector('.newInvoice');
const buttonAddNewItemEl =
  newInvoiceAllContentEl.querySelector('.button__addItem');
const addImputsItemsEl =
  newInvoiceAllContentEl.querySelector('.addItemsImputs');
const spaceAddItemsEl = newInvoiceAllContentEl.querySelector(
  '.itemList__components'
);
const itemsInputEl = addImputsItemsEl.querySelectorAll('.input-fieldItem');
const numberQtyEl = addImputsItemsEl.querySelector('#putQty');
const numberPriceEl = addImputsItemsEl.querySelector('#putPrice');
const imputValueEl = newInvoiceAllContentEl.querySelector(
  '.total__imput__borderColor'
);
const cleanButtonEl = addImputsItemsEl.querySelector('.cleanCalc');

cleanButtonEl.addEventListener('click', () => {
  itemsInputEl.forEach((input) => {
    input.value = '';
  });
  imputValueEl.textContent = '';
});
let items = [];
let item = {
  name: '',
  quantity: '',
  price: '',
};
function createDom(string) {
  const stringToNodo = new DOMParser();
  const inserToHTML = stringToNodo.parseFromString(string, 'text/html');
  return inserToHTML.body.firstChild;
}
itemsInputEl.forEach((input) => {
  input.addEventListener('input', (event) => {
    item = {
      ...item,
      [event.target.name]: event.target.value,
    };
    //calculadora//
    if (event.target.name === 'quantity' || event.target.name === 'price') {
      console.log(item.quantity * item.price);
      const amountTotalValue = item.quantity * item.price;
      item = {
        ...item,
        amountTotal: amountTotalValue,
      };
      imputValueEl.textContent = amountTotalValue;
    }
  });
});

// agregar imputs/items//

const itemsLisEl = newInvoiceAllContentEl.querySelector('#items');
buttonAddNewItemEl.addEventListener('click', () => {
  items.unshift(item);
  console.log(items);
  itemsLisEl.innerHTML = '';
  items.forEach((item) => {
    const itemEl = createDom(`<div class="newInvoice__bill prueba">
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
        <div class="itemList__calc">
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
        <img src="./icon/trashcan.svg" alt="" />
        </button>
        </div>
        <div id="items"></div>
        </div>
        </div>
        </div>`);

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
