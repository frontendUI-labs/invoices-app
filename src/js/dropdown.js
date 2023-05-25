const dropDownEl = document.querySelector('.dropdown');
const dropdownButtonEl = dropDownEl.querySelector('.dropdown__button');
const dropdownListEl = dropDownEl.querySelector('.dropdown__list');
const dropdownTextEl = dropDownEl.querySelector('.dropdown__text');
const dropdownListButtonEl = dropDownEl.querySelectorAll(
  '.dropdown__list button'
);

function toogleMenu() {
  dropdownListEl.classList.toggle('flex');
}
function removeMenu() {
  dropdownListEl.classList.remove('flex');
}

dropdownButtonEl.addEventListener('click', toogleMenu);
//trae la eleccion escogida al campo/
dropdownListButtonEl.forEach((button) => {
  button.addEventListener('click', (event) => {
    const selectedOption = event.target.textContent;
    dropdownTextEl.textContent = selectedOption;
    toogleMenu();
  });
});

//remueve el bloque cuando se hace click afuera de el//
document.body.addEventListener('click', (event) => {
  const isContained = dropdownButtonEl.contains(event.target);
  if (!isContained) {
    removeMenu();
  }
});
