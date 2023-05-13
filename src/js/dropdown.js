const menuEl = document.querySelector('#menu');
const selectorEl = document.querySelector('.selector');
const buttonsSelectorEl = document.querySelectorAll('.selector button');
const textMenu = document.querySelector('.menu__text');

function toogleMenu() {
  selectorEl.classList.toggle('flex');
}
function removeMenu() {
  selectorEl.classList.remove('flex');
}

menuEl.addEventListener('click', toogleMenu);
buttonsSelectorEl.forEach((button) => {
  button.addEventListener('click', (event) => {
    const selectedOption = event.target.textContent;
    textMenu.textContent = selectedOption;
    toogleMenu();
  });
});

document.body.addEventListener('click', (event) => {
  const isContained = menuEl.contains(event.target);
  if (!isContained) {
    removeMenu();
  }
});
