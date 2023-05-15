const dropDownEl = document.querySelector('.dropdown');
const dropdownButton = dropDownEl.querySelector('.dropdown__button');
const dropdownList = dropDownEl.querySelector('.dropdown__list');
const dropdownListButton = dropDownEl.querySelectorAll(
  '.dropdown__list button'
);
const dropdownText = dropDownEl.querySelector('.dropdown__text');

function toogleMenu() {
  dropdownList.classList.toggle('flex');
}
function removeMenu() {
  dropdownList.classList.remove('flex');
}

dropdownButton.addEventListener('click', toogleMenu);
dropdownListButton.forEach((button) => {
  button.addEventListener('click', (event) => {
    const selectedOption = event.target.textContent;
    dropdownText.textContent = selectedOption;
    toogleMenu();
  });
});

document.body.addEventListener('click', (event) => {
  const isContained = dropdownButton.contains(event.target);
  if (!isContained) {
    removeMenu();
  }
});
