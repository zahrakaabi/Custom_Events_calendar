/* ------------------------------------------ */
/*                 DEPENDENCIES               */
/* ------------------------------------------ */
// Packages
import { useState } from 'react';
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
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
//08 : 40 - 08 : 55
//12 : 50 - 13 : 10 

// Styles
import './index.css';

/* ------------------------------------------ */
/*              CUSTOM CALENDAR               */
/* ------------------------------------------ */
function CustomCalendar() {
   /* --------------- CONSTS ---------------- */
   const [selectedDate, setSelectedDate] = useState(new Date());
   const [activeDate, setActiveDate] = useState(new Date());

   /* ------------------------ */
   /*    GET CALENDAR HEADER   */
   /* ------------------------ */
   const getHeader = () => (
    <div className="calendar-header flex items-center">
        {/*<div className="currentYear">
            <img src="" alt="calendar_icon" />
            <h2 className="currentMonth">{format(activeDate, "yyyy")}</h2>
        </div>*/}
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
            {format(addDays(weekStartDate, day), "E")}
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
      week.push(
        <div
          className={`day ${
            isSameMonth(currentDate, activeDate) ? "" : "inactiveDay"
          } ${isSameDay(currentDate, selectedDate) ? "selectedDay" : ""}
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

  /* ************* RENDERING **************** */
  return (
    <div className='calendar-wrapper flex justify-center items-center'>
        <div className="calendar-container">
            {getHeader()}
            {getWeekDaysNames()}
            {getDates()}
        </div>
    </div>
  );
}

export default CustomCalendar;