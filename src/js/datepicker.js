import getDaysInMonth from 'date-fns/getDaysInMonth';
import getDay from 'date-fns/getDay';
import lastDayOfMonth from 'date-fns/lastDayOfMonth';
import sub from 'date-fns/sub';
import format from 'date-fns/format';
import weeksToDays from 'date-fns/weeksToDays';
import addMonths from 'date-fns/addMonths';
import startOfMonth from 'date-fns/startOfMonth';

export default class Datepicker {
  constructor(id) {
    this.id = id;
    this.selectedDatepicker = new Date();
    this.currentDateCalendar = new Date(); //bota el dia actual//
    this.datepickerEl = document.querySelector(this.id);
  }

  cleanSpans() {
    const allSpans = document.querySelectorAll('.datepicker-day');
    allSpans.forEach((span) => {
      span.classList.remove('current');
    });
  }

  renderCalendaValue(date) {
    const datepickerTitleEl =
      this.datepickerEl.querySelector('.datepicker__value');
    const allFormattedCurrentDate = format(date, 'd MMM yyyy'); //formato de dia mes y a~o//
    datepickerTitleEl.textContent = allFormattedCurrentDate;
  }

  handleSpanElClick(isInactiveDay, item, event) {
    if (isInactiveDay) {
      // no permitir escogerprevDays ni nextDays//
      return;
    }
    const month = format(this.currentDateCalendar, 'M');
    const year = format(this.currentDateCalendar, 'yyyy');
    this.selectedDatepicker = new Date(year, month - 1, item);
    this.renderCalendaValue(this.selectedDatepicker);

    this.cleanSpans();
    //integrar la clase current
    event.target.classList.add('current');
  }

  renderCalendarTitle() {
    const calendarTitleEl = this.datepickerEl.querySelector('.calendar__title');

    const formattedCurrentDate = format(this.currentDateCalendar, 'MMM yyyy'); //formato de mes y a~o//
    calendarTitleEl.textContent = formattedCurrentDate;
  }

  renderCalendarDays() {
    const startDayInAMonth = startOfMonth(this.currentDateCalendar); // bota el primer del mes//
    const starDayOfMonth = getDay(startDayInAMonth); // bota la posicion que cae el primer dia//
    const daysInAMonth = getDaysInMonth(this.currentDateCalendar); //bota la cantidad de dias que tiene el mes//
    const previewMonthDate = sub(this.currentDateCalendar, {
      //bota el mes anterior (1)//
      months: 1,
    });
    const lastPrevDate = lastDayOfMonth(previewMonthDate); //bota el ultimo dia del mes anterior//
    const lastDayOfPrevMonth = format(lastPrevDate, 'd'); //bota la cantidad de dias del mes anterior//

    // sale 25 : cantidad de dias del mes anterior(31)- posicion del primer dia del mes actual(6)
    const initialPrevDate = lastDayOfPrevMonth - starDayOfMonth;
    const lastCurrentDate = lastDayOfMonth(this.currentDateCalendar); //bota el ultimo dia del mes//
    const lastDayCurrentDate = format(lastCurrentDate, 'd'); //formato de los dias agarrados//
    const getCurrentLastDay = getDay(lastCurrentDate); //bota la posicion del ultimo dia del mes//

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

    const daysEl = this.datepickerEl.querySelector('.datepicker__days');

    allDays.forEach((item, idx) => {
      const isInactiveDay =
        idx < starDayOfMonth ||
        idx >= prevDays.length + Number(lastDayCurrentDate);

      // se debe crear un span con esta opcion para poder agregarles un evento//
      const spanEl = document.createElement('span');

      // se debe dar el atributo al span para traer los estilos//
      spanEl.setAttribute('role', 'button');
      spanEl.setAttribute('tabindex', 0);
      spanEl.classList.add('text-h4', 'datepicker-day');

      if (isInactiveDay) {
        spanEl.classList.add('is-inactive');
      }
      //iguala los dias, mese y a~o del calenadar con la fecha seleccionada por el usuario//
      if (
        format(this.selectedDatepicker, 'd') == item &&
        format(this.selectedDatepicker, 'M') ==
          format(this.currentDateCalendar, 'M') &&
        format(this.selectedDatepicker, 'yyyy') ==
          format(this.currentDateCalendar, 'yyyy') &&
        !isInactiveDay
      ) {
        spanEl.classList.add('current');
      }

      //EVENTO CLICK//
      spanEl.textContent = item;
      spanEl.addEventListener('click', (event) => {
        this.handleSpanElClick(isInactiveDay, item, event);
      });

      //EVENTO KEWDOWN//
      spanEl.addEventListener('keypress', (event) => {
        if (event.code === 'Enter') {
          this.handleSpanElClick(isInactiveDay, item, event);
        }
      });
      daysEl.append(spanEl);
    });
  }
  render() {
    const daysEl = this.datepickerEl.querySelector('.datepicker__days');
    const prevMonthEl = this.datepickerEl.querySelector(
      '.datepicker__prevButton'
    );
    const nextMonthEl = this.datepickerEl.querySelector(
      '.datepicker__nextButton'
    );
    const datepickerButtonEl = this.datepickerEl.querySelector(
      '.datepicker__button'
    );
    const datepickerCalendarEl = this.datepickerEl.querySelector(
      '.datepicker__calendar'
    );

    //TITLE CALENDAR//
    const calendarDate = null;

    //TOGGLE CALENDAR//
    function toogleCalendar() {
      datepickerCalendarEl.classList.toggle('flex'); // muestra y remueve el calendar//
    }
    function removeCalendar() {
      datepickerCalendarEl.classList.remove('flex'); //solo remueve el calendar
    }

    datepickerButtonEl.addEventListener('click', toogleCalendar);
    //el calendar se removera si se hace click fuera del calendar//
    document.body.addEventListener('click', (event) => {
      const isContained = this.datepickerEl.contains(event.target);
      if (!isContained) {
        removeCalendar();
      }
    });

    //ARROWS//

    nextMonthEl.addEventListener('click', () => {
      this.currentDateCalendar = addMonths(this.currentDateCalendar, 1); // agrega una cantidad de meses posteriores al actual//
      this.renderCalendarTitle();

      daysEl.innerHTML = ''; //limpia el append//

      this.renderCalendarDays();
    });
    prevMonthEl.addEventListener('click', () => {
      this.currentDateCalendar = sub(this.currentDateCalendar, {
        //bota el mes anterior (1)//
        months: 1,
      });
      this.renderCalendarTitle();
      daysEl.innerHTML = ''; //limpia el append//
      this.renderCalendarDays();
    });

    //FUNCTIONS//
    this.renderCalendarTitle();
    this.renderCalendarDays();
    this.renderCalendaValue(this.selectedDatepicker);
  }
}
const mainDatepicker = new Datepicker('#datepickerMain');
mainDatepicker.render();
