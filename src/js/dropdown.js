export default class Dropdown {
  constructor(id) {
    this.id = id;
  }
  selectedOption = null;
  get selectedOption() {
    return this.selectedOption;
  }

  render() {
    const dropDownEl = document.querySelector(this.id);
    const dropdownButtonEl = dropDownEl.querySelector('.dropdown__button');
    const dropdownListEl = dropDownEl.querySelector('.dropdown__list');
    const dropdownTextEl = dropDownEl.querySelector('.dropdown__text');
    const dropdownListButtonEl = dropDownEl.querySelectorAll(
      '.dropdown__list button'
    );
    const dropdownArrow = dropDownEl.querySelector('.dropdown__arrowrotate');
    function toogleMenu() {
      dropdownListEl.classList.toggle('flex');
    }
    function removeMenu() {
      dropdownListEl.classList.remove('flex');
    }

    // rotacion del icono//
    function rotateArrowDrop() {
      dropdownArrow.classList.toggle('rotate');
    }
    function dontrotateArrowDrop() {
      dropdownArrow.classList.remove('rotate');
    }

    dropdownButtonEl.addEventListener('click', () => {
      toogleMenu();
      rotateArrowDrop();
    });
    //trae la eleccion escogida al campo/
    dropdownListButtonEl.forEach((button) => {
      button.addEventListener('click', (event) => {
        const selectedOption = event.target.textContent;
        this.selectedOption = button.dataset.day;
        dropdownTextEl.textContent = selectedOption;
        toogleMenu();
      });
    });

    // remueve el bloque cuando se hace click afuera de el//
    document.body.addEventListener('click', (event) => {
      const isContained = dropdownButtonEl.contains(event.target);
      if (!isContained) {
        removeMenu();
        dontrotateArrowDrop();
      }
    });
  }
}

const mainDropdown = new Dropdown('#dropdownMain');
mainDropdown.render();
