import getDaysInMonth from 'date-fns/getDaysInMonth';
import getDay from 'date-fns/getDay';
import addMonths from 'date-fns/addMonths';
import lastDayOfMonth from 'date-fns/lastDayOfMonth';
import sub from 'date-fns/sub';
import format from 'date-fns/format';
import startOfDay from 'date-fns/startOfDay';
import weeksToDays from 'date-fns/weeksToDays';
import getMonth from 'date-fns/getMonth';

//bota el dia que pones//
const currentDate = new Date(2023, 11);

// bota la posicion que cae el dia//
const starDayOfMonth = getDay(currentDate);
//bota la cantidad de dias que tiene el mes//
const daysInAMonth = getDaysInMonth(currentDate);
// bota el primer dia del mes anterior//
const previewMonthDate = sub(currentDate, {
  months: 1,
});
//bota el ultimo dia del mes anterior//
const lastPrevDate = lastDayOfMonth(previewMonthDate);
//bota la cantidad de dias del mes anterior//
const lastDayOfPrevMonth = format(lastPrevDate, 'd');

// sale 25 : cantidad de dias del mes anterior(31)- posicion del primer dia del mes actual(6)
const initialPrevDate = lastDayOfPrevMonth - starDayOfMonth;

//bota el ultimo dia del mes//
const lastCurrentDate = lastDayOfMonth(currentDate);
const lastDayCurrentDate = format(lastCurrentDate, 'd');

//bota la posicion del ultimo dia del mes//
const getCurrentLastDay = getDay(lastCurrentDate);

const prevDays = [...Array(starDayOfMonth).keys()].map(
  (i) => i + initialPrevDate + 1
);

const dayArray = [...Array(daysInAMonth).keys()];
const currentDays = dayArray.map((i) => {
  return i + 1;
});

const daysInAWeek = weeksToDays(1);
const lastNextDate = daysInAWeek - getCurrentLastDay - 1;
const nextDays = [...Array(lastNextDate).keys()].map((i) => i + 1);

const allDays = [...prevDays, ...currentDays, ...nextDays];
const allDaysElements = allDays.map((item, idx) => {
  return `<span role="button" tabindex="0" class="text-h4 datepicker-day ${
    idx < starDayOfMonth || idx >= prevDays.length + Number(lastDayCurrentDate)
      ? 'is-inactive'
      : ''
  } ">${item}</span>`;
});

const allDaysElementsString = allDaysElements.join('');

const monthsDaysEl = document.querySelector('#datepicker');
const dayEl = monthsDaysEl.querySelector('.datepicker__days');
dayEl.innerHTML = allDaysElementsString;
