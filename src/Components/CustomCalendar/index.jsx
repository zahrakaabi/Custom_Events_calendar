/* ------------------------------------------ */
/*                 DEPENDENCIES               */
/* ------------------------------------------ */
// Packages
import { useState, useEffect } from 'react';
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { VscCalendar } from 'react-icons/vsc';
import {
    format,
    startOfWeek,
    addDays,
    subMonths,
    addMonths,
    startOfMonth,
    endOfMonth,
    endOfWeek,
    isSameMonth,
    isSameDay
  } from "date-fns";

// Styles
import './index.css';

/* ------------------------------------------ */
/*              CUSTOM CALENDAR               */
/* ------------------------------------------ */
function CustomCalendar() {
   /* --------------- CONSTS ---------------- */
   const [selectedDate, setSelectedDate] = useState(new Date());
   const [activeDate, setActiveDate] = useState(new Date());
   const [events, setEvents] = useState([]);

   /* ------------------------ */
   /*         GET EVENTS       */
   /* ------------------------ */
   const getEvents = () => {
      fetch('EventsAPI.json')
      .then((response) => response.json())
      .then((response) => setEvents(response))
   }
   useEffect(() => getEvents(), [])

   const EVENTS_DATES = events?.map(({ date }) => date);

   /* ------------------------ */
   /*    GET CALENDAR HEADER   */
   /* ------------------------ */
   const getHeader = () => (
    <div className="calendar-header flex items-center justify-center">
        <div className="currentYear flex items-center">
            <VscCalendar className="calendarIcon" />
            <h2 className="currentMonth">{format(activeDate, "yyyy")}</h2>
        </div>
        <AiOutlineLeft className="navIcon" onClick={() => setActiveDate(subMonths(activeDate, 1))} />
        <h2 className="currentMonth">{format(activeDate, "MMMM")}</h2>
        <AiOutlineRight className="navIcon" onClick={() => setActiveDate(addMonths(activeDate, 1))} />
    </div>
   );


   /* ------------------------ */
   /*    GET WEEK DAYS NAMES   */
   /* ------------------------ */
   const getWeekDaysNames = () => {
    /* ---- CONSTS ---- */
    const weekStartDate = startOfWeek(activeDate);
    const weekDays = [];
    for (let day = 0; day < 7; day++) {
        weekDays.push(
          <div className="day weekNames">
            {format(addDays(weekStartDate, day), "EEEEEE")}
          </div>
        );
    }
    /* **** RENDERING **** */
    return <div className="weekContainer">{weekDays}</div>;
   };


   /* -------------------------------- */
   /*  GENERATE DATES FOR CURRENT WEEK */
   /* -------------------------------- */
   const generateDatesForCurrentWeek = (date, selectedDate, activeDate) => {
    /* ---- CONSTS ---- */
    let currentDate = date;
    const week = [];
    for (let day = 0; day < 7; day++) {
      const cloneDate = currentDate;
      const FORMATTED_CURENT_DATE = format(currentDate, 'dd-LL-yyyy');
      const EVENT_DATE = EVENTS_DATES?.find((eventDate) => FORMATTED_CURENT_DATE === eventDate);
      week.push(
        <div
          className={`day 
          ${isSameMonth(currentDate, activeDate) ? "" : "inactiveDay"} 
          ${isSameDay(currentDate, selectedDate) ? "selectedDay" : ""}
          ${EVENT_DATE ? "eventDay" : ""}
          ${isSameDay(currentDate, new Date()) ? "today" : ""}`}
          onClick={() => {
            setSelectedDate(cloneDate);
          }}
        >
          {format(currentDate, "d")}
        </div>
      );
      currentDate = addDays(currentDate, 1);
    }
    /* **** RENDERING **** */
    return <>{week}</>;
   };


   /* ------------------------ */
   /*           GET DAYS       */
   /* ------------------------ */
   const getDates = () => {
    /* ---- CONSTS ---- */
    const startOfTheSelectedMonth = startOfMonth(activeDate);
    const endOfTheSelectedMonth = endOfMonth(activeDate);
    const startDate = startOfWeek(startOfTheSelectedMonth);
    const endDate = endOfWeek(endOfTheSelectedMonth);

    let currentDate = startDate;

    const allWeeks = [];

    while (currentDate <= endDate) {
      allWeeks.push(
        generateDatesForCurrentWeek(currentDate, selectedDate, activeDate)
      );
      currentDate = addDays(currentDate, 7);
    }
    /* **** RENDERING **** */
    return <div className="weekContainer">{allWeeks}</div>;
   };

   /* ------------------------ */
   /*       GET EVENTS DAY     */
   /* ------------------------ */
   const SELECTED_DATE_EVENTS = events?.filter((event) => event.date === format(selectedDate, 'dd-LL-yyyy'));

  /* ************* RENDERING **************** */
  return (
    <div className="calendar flex items-center">
        <div className="events-wrapper flex justify-center items-center">
            <div className="events-container text-center">
                <h4 className="floated-text">{format(selectedDate, 'd')}</h4>
                <span className="event-day-date">{format(selectedDate, 'd')}</span><br />
                <span className="event-day">{format(selectedDate, 'EEEE')}</span>
                {SELECTED_DATE_EVENTS.length > 0 ? SELECTED_DATE_EVENTS?.map((event) => <div className="event">{event.title}</div>) : <div className="event">No events for this day</div>}
            </div>
        </div>

        <div className='calendar-wrapper flex justify-center items-center'>
            <div className="calendar-container">
                {getHeader()}
                {getWeekDaysNames()}
                {getDates()}
            </div>
        </div>
    </div>
  );
}

export default CustomCalendar;