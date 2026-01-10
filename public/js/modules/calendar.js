export class CalendarManager {
    constructor() {
        this.currentDate = new Date();
        this.monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        this.dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        this.events = this.loadEvents();
        this.listenersAdded = false;
    }

    loadEvents() {
        return [
            { date: '2023-06-15', title: 'Client Meeting', type: 'meeting' },
            { date: '2023-06-18', title: 'Quote Deadline', type: 'deadline' },
            { date: '2023-06-22', title: 'Product Delivery', type: 'delivery' },
            { date: '2023-06-25', title: 'Team Meeting', type: 'meeting' },
            { date: '2023-06-28', title: 'Invoice Due', type: 'deadline' }
        ];
    }

    init() {
        try {
            this.render();
            this.bindEvents();
        } catch (error) {
            console.error('Error initializing calendar:', error);
        }
    }

    bindEvents() {
        if (this.listenersAdded) return;
        
        const prevBtn = document.getElementById('prevMonth');
        const nextBtn = document.getElementById('nextMonth');
        
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => this.previousMonth());
            nextBtn.addEventListener('click', () => this.nextMonth());
            this.listenersAdded = true;
        }
    }

    previousMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.render();
    }

    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.render();
    }

    render() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        this.updateMonthYearDisplay(year, month);
        this.renderCalendarGrid(year, month);
    }

    updateMonthYearDisplay(year, month) {
        const monthYearElement = document.getElementById('currentMonthYear');
        if (monthYearElement) {
            monthYearElement.textContent = `${this.monthNames[month]} ${year}`;
        }
    }

    renderCalendarGrid(year, month) {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const firstDayOfWeek = firstDay.getDay();
        const daysInMonth = lastDay.getDate();

        const calendarGrid = document.getElementById('calendarGrid');
        if (!calendarGrid) return;

        calendarGrid.innerHTML = '';
        
        // Add day headers
        this.dayNames.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header';
            dayHeader.textContent = day;
            calendarGrid.appendChild(dayHeader);
        });

        // Add empty cells for previous month
        this.renderPreviousMonthDays(calendarGrid, year, month, firstDayOfWeek);
        
        // Add current month days
        this.renderCurrentMonthDays(calendarGrid, year, month, daysInMonth);
        
        // Add next month days to fill grid
        this.renderNextMonthDays(calendarGrid, year, month, firstDayOfWeek, daysInMonth);
    }

    renderPreviousMonthDays(grid, year, month, firstDayOfWeek) {
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = 0; i < firstDayOfWeek; i++) {
            const dateNum = prevMonthLastDay - firstDayOfWeek + i + 1;
            const cell = this.createDayCell(dateNum, 'other-month');
            grid.appendChild(cell);
        }
    }

    renderCurrentMonthDays(grid, year, month, daysInMonth) {
        const today = new Date();
        for (let day = 1; day <= daysInMonth; day++) {
            const cell = this.createDayCell(day);
            
            // Check if today
            if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                cell.classList.add('today');
            }
            
            // Add events
            this.addEventsToDay(cell, year, month, day);
            grid.appendChild(cell);
        }
    }

    renderNextMonthDays(grid, year, month, firstDayOfWeek, daysInMonth) {
        const totalCells = firstDayOfWeek + daysInMonth;
        const remainingCells = 42 - totalCells; // 6 rows x 7 days = 42
        
        for (let i = 1; i <= remainingCells; i++) {
            const cell = this.createDayCell(i, 'other-month');
            grid.appendChild(cell);
        }
    }

    createDayCell(day, className = '') {
        const cell = document.createElement('div');
        cell.className = `calendar-cell ${className}`.trim();
        cell.innerHTML = `<div class="calendar-date">${day}</div>`;
        return cell;
    }

    addEventsToDay(cell, year, month, day) {
        const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayEvents = this.events.filter(event => event.date === dateString);
        
        if (dayEvents.length > 0) {
            const eventsContainer = document.createElement('div');
            eventsContainer.className = 'calendar-events';
            
            dayEvents.forEach(event => {
                const eventElement = document.createElement('div');
                eventElement.className = `calendar-event event-${event.type}`;
                eventElement.textContent = event.title;
                eventsContainer.appendChild(eventElement);
            });
            
            cell.appendChild(eventsContainer);
        }
    }
}