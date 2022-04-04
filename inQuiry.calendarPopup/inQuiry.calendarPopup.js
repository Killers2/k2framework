/*!
 * PLUGIN inQuiry CalendarPopUp  V1.2
 * @laguage: Javascript ES6
 * @Inspired by: https://github.com/rolyart/rolyart-calendar
 * @author: Tony N. Hyde (Date: 23 March 2022)
 * @Dependencies: inQuiry.js
 */
(function ($$) {
	"use strict";

    class CalendarPopUp {
        
        constructor(config) {

            this.container = config.container;
            this.months = config.months;
            this.weekDays = config.weekDays;
            this.onDayClick = config.onDayClick;

            this.container.classList.add('calendar-popup-calendar');
            
            this.today = new Date();
            this.selected = this.today;
            this.currentMonth = this.today.getMonth();
            this.currentYear = this.today.getFullYear();

            this.nextMonth = () => {

                if (this.currentMonth == 11) {

                    this.currentMonth = 0;

                    this.currentYear = this.currentYear + 1;

                }
                else 
                {

                    this.currentMonth = this.currentMonth + 1;

                }

                this.showCalendar(this.currentYear, this.currentYear);

            };

            this.prevMonth = () => {
                
                if (this.currentMonth == 0) {
                    
                    this.currentMonth = 11;
                    
                    this.currentYear = this.currentYear - 1;
                
                }
                else 
                {

                    this.currentMonth = this.currentMonth - 1;
                
                }

                this.showCalendar(this.currentYear, this.currentYear);

            };

            this.getPrevDays = (date, staDay = 0) => {
                
                let ret = [];
                
                let year = date.getFullYear();
               
                let month = date.getMonth();
                
                let firstWeekday = new Date(year, month, 1).getDay();
                
                let days = (firstWeekday + 7) - (staDay + 7) - 1;
                
                for (let i = days * -1; i <= 0; i++) {
                    
                    ret.push({ date: new Date(year, month, i).getDate(), type: "not-current", id: new Date(year, month, i) });
                
                }

                return ret;

            };

            this.getNextDays = (prevMonthDays, monthDays) => {
                
                let ret = [];
                
                let days = 42 - (prevMonthDays.length + monthDays.length);
                
                for (let i = 1; i <= days; i++) {
                    
                    ret.push({ date: i, type: "not-current" });
                
                }

                return ret;

            };

            this.getCurrentDays = (date) => {
                
                let ret = [];
                
                let year = date.getFullYear();
                
                let month = date.getMonth();
                
                let lastDay = new Date(year, month + 1, 0).getDate();
                
                for (let i = 1; i <= lastDay; i++) {
                   
                    ret.push({ date: i, type: "current", id: this.YYYYmmdd(new Date(year, month, i)) });
                
                }

                return ret;

            };

            this.YYYYmmdd = (date) => {
                
                let d = new Date(date), month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear();
                
                if (month.length < 2)
                {
                    month = '0' + month;
                }

                if (day.length < 2){

                    day = '0' + day;
                
                }

                return [year, month, day].join('-');

            };

            this.calendarHeader = () => {

                let header = document.createElement('header');

                header.classList.add('calendar-header');

                let monthAndYear = document.createElement('h3');

                let calendarControl = document.createElement('div');

                let prevMonth = document.createElement('button');

                let currentMonth = document.createElement('button');

                let nextMonth = document.createElement('button');

                monthAndYear.classList.add('month-year');

                calendarControl.classList.add('calendar-control');

                monthAndYear.innerHTML = `${this.months[this.currentMonth] + ' ' + this.currentYear}`;

                prevMonth.innerHTML = '<i class="fa fa-arrow-left"></i>';

                prevMonth.addEventListener('click', () => {

                    this.prevMonth();

                    monthAndYear.innerHTML = `${this.months[this.currentMonth] + ' ' + this.currentYear}`;

                });

                nextMonth.innerHTML = '<i class="fa fa-arrow-right"></i>';

                nextMonth.addEventListener('click', () => {

                    this.nextMonth();

                    monthAndYear.innerHTML = `${this.months[this.currentMonth] + ' ' + this.currentYear}`;

                });

                currentMonth.innerHTML = '<i class="fa fa-calendar"></i>';

                currentMonth.addEventListener('click', () => {

                    this.currentYear = new Date().getFullYear();

                    this.currentMonth = new Date().getMonth();

                    monthAndYear.innerHTML = `${this.months[this.currentMonth] + ' ' + this.currentYear}`;

                    this.showCalendar();

                });

                let weekDays = document.createElement('div');
                
                weekDays.classList.add('week-days');
                
                for (let i = 0; i <= 6; i++) {
                    
                    weekDays.innerHTML += `<div>${this.weekDays[i]}</div>`;
                
                }

                currentMonth.classList.add('control-current-month');

                calendarControl.appendChild(prevMonth);

                calendarControl.appendChild(currentMonth);

                calendarControl.appendChild(nextMonth);

                header.appendChild(monthAndYear);

                header.appendChild(calendarControl);

                this.container.appendChild(header);

                this.container.appendChild(weekDays);

            };

            this.calendarBody = (year, month) => {

                year = this.currentYear;

                month = this.currentMonth;

                let date = new Date(year, month + 1, 0);

                let daysPrevMonth = this.getPrevDays(date);

                let daysThisMonth = this.getCurrentDays(date);

                let daysNextMonth = this.getNextDays(daysPrevMonth, daysThisMonth);

                let calendarBody = document.createElement('div');

                calendarBody.classList.add('calendar-body');

                [...daysPrevMonth, ...daysThisMonth, ...daysNextMonth].forEach(num => {

                        let cell = document.createElement('div');

                        cell.setAttribute('id', num.id);

                        cell.classList.add('day');

                        let day = document.createElement('span');

                        day.innerHTML = num.date;

                        cell.appendChild(day);

                        cell.addEventListener('click', () => {

                            this.selected = num.id;

                            let selected = document.getElementsByClassName("selected");
                            
                            if (selected.length > 0) {

                                selected[0].className = selected[0].className.replace(" selected", "");

                            }

                            cell.className += " selected";

                            this.onDayClick(new Date(this.selected));

                        });
                        
                        num.type === 'not-current' ? cell.classList.add('not-current') : cell.classList.add('current');
                        
                        if (num.id === this.YYYYmmdd(this.today)) {

                            cell.classList.add('active');

                            cell.classList.add('selected');

                        }

                        calendarBody.appendChild(cell);

                    });

                this.container.appendChild(calendarBody);

            };

            this.showCalendar = (year, month) => {

                this.container.innerHTML = '';

                this.calendarHeader();

                this.calendarBody(year, month);

            };

            this.showCalendar(this.currentYear, this.currentMonth);

        }

    }

    $$.fn.calendarPopup = function(options)
    {
        
        if(this.length <= 0) { 

            return this; 

        }

        var defaults = {
            months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "Octomber", "November", "December"],
            weekDays: ["S", "M", "T", "W", "T", "F", "S"],
            container: this[0],
            onDayClick: (date) => {}
        }

        this[0].calendarPopup = new CalendarPopUp($$.merge(defaults, options));

        return this;

    }

})(inQuiry);

