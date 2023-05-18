import getDaysInMonth from 'date-fns/getDaysInMonth';
import getDay from 'date-fns/getDay';
import lastDayOfMonth from 'date-fns/lastDayOfMonth';
import sub from 'date-fns/sub';
import format from 'date-fns/format';
import weeksToDays from 'date-fns/weeksToDays';
import addMonths from 'date-fns/addMonths';
import startOfMonth from 'date-fns/startOfMonth';

// renderCalendarDays(month, year);
const datepickerEl = document.querySelector('#datepicker');
const daysEl = datepickerEl.querySelector('.datepicker__days');

//TITLE CALENDAR//
const calendarTitleEl = datepickerEl.querySelector('.calendar__title');
let currentDateUserSelected = new Date(); //bota el dia que escoje el usuario//
let currentDateCalendar = new Date(); //bota el dia actual//

function renderCalendarTitle() {
  const formattedCurrentDate = format(currentDateCalendar, '	MMM yyyy'); //formato de mes y a~o//
  calendarTitleEl.textContent = formattedCurrentDate;
}
function renderCalendaValue(date) {
  const datepickerTitleEl = datepickerEl.querySelector('.datepicker__value');

  const allFormattedCurrentDate = format(date, 'd MMM yyyy'); //formato de dia mes y a~o//
  datepickerTitleEl.textContent = allFormattedCurrentDate;
}

//DIAS//
function renderCalendarDays() {
  const startDayInAMonth = startOfMonth(currentDateCalendar); // bota el primer del mes//
  const starDayOfMonth = getDay(startDayInAMonth); // bota la posicion que cae el primer dia//
  const daysInAMonth = getDaysInMonth(currentDateCalendar); //bota la cantidad de dias que tiene el mes//
  const previewMonthDate = sub(currentDateCalendar, {
    //bota el mes anterior (1)//
    months: 1,
  });
  const lastPrevDate = lastDayOfMonth(previewMonthDate); //bota el ultimo dia del mes anterior//
  const lastDayOfPrevMonth = format(lastPrevDate, 'd'); //bota la cantidad de dias del mes anterior//

  // sale 25 : cantidad de dias del mes anterior(31)- posicion del primer dia del mes actual(6)
  const initialPrevDate = lastDayOfPrevMonth - starDayOfMonth;
  const lastCurrentDate = lastDayOfMonth(currentDateCalendar); //bota el ultimo dia del mes//
  const lastDayCurrentDate = format(lastCurrentDate, 'd'); //formato de los dias agarrados//
  const getCurrentLastDay = getDay(lastCurrentDate); //bota la posicion del ultimo dia del mes//
  console.log('getCurrentLastDay', getCurrentLastDay);

  //dias previos al mes actual//
  const prevDays = [...Array(starDayOfMonth).keys()].map(
    (i) => i + initialPrevDate + 1
  ); //crea el array de espacios a rellenar//

  // dias actuales del mes//
  const dayArray = [...Array(daysInAMonth).keys()]; //crea el array de espacios a rellenar//
  const currentDays = dayArray.map((i) => {
    return i + 1; // contando desde el "1" (i +1)//
  });

  //dias posteriores al mes actual//
  const daysInAWeek = weeksToDays(1); //cantidad de dias de una semana//
  const lastNextDate = daysInAWeek - getCurrentLastDay - 1; // cantidad de espacios que ocupa los dias post.//
  const nextDays = [...Array(lastNextDate).keys()].map((i) => i + 1); // crea el array de espacios a rellenar//

  //(...) junta a los dias previos + actuales + posteriores//
  const allDays = [...prevDays, ...currentDays, ...nextDays];

  allDays.forEach((item, idx) => {
    const isInactiveDay =
      idx < starDayOfMonth ||
      idx >= prevDays.length + Number(lastDayCurrentDate);

    const spanEl = document.createElement('span');
    spanEl.addEventListener('click', () => {
      const test = format(currentDateCalendar, 'M');
      const year = format(currentDateCalendar, 'yyyy');

      currentDateUserSelected = new Date([year, test, item]);
      currentDateCalendar;

      renderCalendaValue(currentDateUserSelected);
    });

    spanEl.setAttribute('role', 'button');
    spanEl.setAttribute('tabindex', 0);
    spanEl.classList.add('text-h4', 'datepicker-day');

    if (isInactiveDay) {
      spanEl.classList.add('is-inactive');
    }

    if (
      format(currentDateUserSelected, 'd') == item &&
      format(currentDateUserSelected, 'M') ==
        format(currentDateCalendar, 'M') &&
      format(currentDateUserSelected, 'yyyy') ==
        format(currentDateCalendar, 'yyyy') &&
      !isInactiveDay
    ) {
      spanEl.classList.add('current');
    }

    spanEl.textContent = item;
    daysEl.append(spanEl);
  });
}

//FUNCTIONS//
renderCalendarTitle();
renderCalendarDays();
renderCalendaValue(currentDateCalendar);

//ARROWS//
const prevMonthEl = datepickerEl.querySelector('#prevMonth');
const nextMonthEl = datepickerEl.querySelector('#nextMonth');
nextMonthEl.addEventListener('click', () => {
  currentDateCalendar = addMonths(currentDateCalendar, 1); // agrega una cantidad de meses posteriores al actual//
  renderCalendarTitle();
  daysEl.innerHTML = '';

  renderCalendarDays();
});
prevMonthEl.addEventListener('click', () => {
  currentDateCalendar = sub(currentDateCalendar, {
    //bota el mes anterior (1)//
    months: 1,
  });
  renderCalendarTitle();
  daysEl.innerHTML = '';

  renderCalendarDays();
});
