import getDaysInMonth from 'date-fns/getDaysInMonth';
import getDay from 'date-fns/getDay';

const currentDate = new Date(2023, 4, 15);

const starDayOfMonth = getDay(currentDate);

const daysInAMonth = getDaysInMonth(currentDate);

const dayArray = [...Array(daysInAMonth).keys()];
const dayElement = dayArray.map((item) => {
  return `<span role="button" tabindex="0" class="text-h4 datepicker-day">${
    item + 1
  }</span>`;
});

let dayString = '';
dayElement.forEach((i) => {
  dayString = dayString + i;
});

const monthsDaysEl = document.querySelector('#datepicker');
const dayEl = monthsDaysEl.querySelector('.datepicker__days');
dayEl.innerHTML = dayString;

dayEl.firstChild.style = `grid-column-start:${starDayOfMonth + 1}`;
