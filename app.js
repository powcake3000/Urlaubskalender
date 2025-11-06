// Password protection
const CORRECT_PASSWORD = 'dienstplanung';
const PASSWORD_KEY = 'urlaubskalender_auth';

// Team members with distinct colors
const TEAM_MEMBERS = [
    { id: 1, name: 'Casey', color: '#FF6B6B' },
    { id: 2, name: 'Felix', color: '#4ECDC4' },
    { id: 3, name: 'Ihtisham', color: '#45B7D1' },
    { id: 4, name: 'Kathrin', color: '#FFA07A' },
    { id: 5, name: 'Peter', color: '#98D8C8' }
];

// Public holidays in Hessen for 2026
const HOLIDAYS_2026 = [
    { date: '2026-01-01', name: 'Neujahr' },
    { date: '2026-04-03', name: 'Karfreitag' },
    { date: '2026-04-06', name: 'Ostermontag' },
    { date: '2026-05-01', name: 'Tag der Arbeit' },
    { date: '2026-05-14', name: 'Christi Himmelfahrt' },
    { date: '2026-05-25', name: 'Pfingstmontag' },
    { date: '2026-06-04', name: 'Fronleichnam' },
    { date: '2026-10-03', name: 'Tag der Deutschen Einheit' },
    { date: '2026-12-25', name: '1. Weihnachtsfeiertag' },
    { date: '2026-12-26', name: '2. Weihnachtsfeiertag' }
];

// Special days that don't count as vacation days
const SPECIAL_DAYS = ['2026-12-24', '2026-12-31'];

const MAX_VACATION_DAYS = 30;

// Application state
let vacations = [];
let editingVacationId = null;

// DOM elements
const loginScreen = document.getElementById('loginScreen');
const loginForm = document.getElementById('loginForm');
const passwordInput = document.getElementById('passwordInput');
const loginError = document.getElementById('loginError');
const mainApp = document.getElementById('mainApp');
const modal = document.getElementById('vacationModal');
const addVacationBtn = document.getElementById('addVacationBtn');
const closeBtn = document.querySelector('.close');
const cancelBtn = document.getElementById('cancelBtn');
const vacationForm = document.getElementById('vacationForm');
const memberSelect = document.getElementById('memberSelect');
const memberNameSelect = document.getElementById('memberName');
const yearlyCalendarDiv = document.getElementById('yearlyCalendar');
const legendItemsDiv = document.getElementById('legendItems');
const vacationListContent = document.getElementById('vacationListContent');
const vacationDaysCards = document.getElementById('vacationDaysCards');
const workingDaysInfo = document.getElementById('workingDaysInfo');
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');

// Initialize the app
function init() {
    checkAuth();
}

// Check authentication
function checkAuth() {
    const isAuthenticated = sessionStorage.getItem(PASSWORD_KEY) === 'true';
    if (isAuthenticated) {
        showMainApp();
    } else {
        loginScreen.style.display = 'flex';
        mainApp.style.display = 'none';
    }
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    const password = passwordInput.value;

    if (password === CORRECT_PASSWORD) {
        sessionStorage.setItem(PASSWORD_KEY, 'true');
        showMainApp();
    } else {
        loginError.textContent = 'Falsches Passwort. Bitte versuchen Sie es erneut.';
        passwordInput.value = '';
        passwordInput.focus();
    }
}

// Show main app
function showMainApp() {
    loginScreen.style.display = 'none';
    mainApp.style.display = 'block';
    loadVacations();
    populateMemberSelects();
    renderLegend();
    renderVacationDaysCards();
    renderYearlyCalendar();
    renderVacationList();
    attachEventListeners();
}

// Load vacations from localStorage
function loadVacations() {
    const stored = localStorage.getItem('vacations');
    vacations = stored ? JSON.parse(stored) : [];
}

// Save vacations to localStorage
function saveVacations() {
    localStorage.setItem('vacations', JSON.stringify(vacations));
}

// Populate member select dropdowns
function populateMemberSelects() {
    // Filter select
    memberSelect.innerHTML = '<option value="">Alle Teammitglieder</option>';
    TEAM_MEMBERS.forEach(member => {
        const option = document.createElement('option');
        option.value = member.id;
        option.textContent = member.name;
        memberSelect.appendChild(option);
    });

    // Form select
    memberNameSelect.innerHTML = '<option value="">Wählen Sie...</option>';
    TEAM_MEMBERS.forEach(member => {
        const option = document.createElement('option');
        option.value = member.id;
        option.textContent = member.name;
        memberNameSelect.appendChild(option);
    });
}

// Render legend
function renderLegend() {
    legendItemsDiv.innerHTML = '';
    TEAM_MEMBERS.forEach(member => {
        const item = document.createElement('div');
        item.className = 'legend-item';

        const colorBox = document.createElement('div');
        colorBox.className = 'legend-color';
        colorBox.style.backgroundColor = member.color;

        const name = document.createElement('span');
        name.className = 'legend-name';
        name.textContent = member.name;

        item.appendChild(colorBox);
        item.appendChild(name);
        legendItemsDiv.appendChild(item);
    });
}

// Get member by ID
function getMemberById(id) {
    return TEAM_MEMBERS.find(m => m.id === parseInt(id));
}

// Check if date is a weekend
function isWeekend(date) {
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday or Saturday
}

// Check if date is a public holiday
function isHoliday(date) {
    const dateStr = formatDateISO(date);
    return HOLIDAYS_2026.some(holiday => holiday.date === dateStr);
}

// Check if date is a special day (24.12 or 31.12)
function isSpecialDay(date) {
    const dateStr = formatDateISO(date);
    return SPECIAL_DAYS.includes(dateStr);
}

// Format date to ISO string (YYYY-MM-DD)
function formatDateISO(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Calculate working days between dates (excluding weekends, holidays, and special days)
function calculateWorkingDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let workingDays = 0;

    const current = new Date(start);
    while (current <= end) {
        if (!isWeekend(current) && !isHoliday(current) && !isSpecialDay(current)) {
            workingDays++;
        }
        current.setDate(current.getDate() + 1);
    }

    return workingDays;
}

// Calculate total vacation days used by a member
function getUsedVacationDays(memberId) {
    return vacations
        .filter(v => v.memberId === memberId)
        .reduce((total, vacation) => {
            return total + calculateWorkingDays(vacation.startDate, vacation.endDate);
        }, 0);
}

// Get vacations for a specific date
function getVacationsForDate(date) {
    const selectedMemberId = memberSelect.value;

    return vacations.filter(vacation => {
        const startDate = new Date(vacation.startDate);
        const endDate = new Date(vacation.endDate);
        const checkDate = new Date(date);

        // Check if date is within vacation range
        const isInRange = checkDate >= startDate && checkDate <= endDate;

        // Filter by selected member if any
        const matchesMember = !selectedMemberId || vacation.memberId == selectedMemberId;

        return isInRange && matchesMember;
    });
}

// Render vacation days cards
function renderVacationDaysCards() {
    vacationDaysCards.innerHTML = '';

    TEAM_MEMBERS.forEach(member => {
        const usedDays = getUsedVacationDays(member.id);
        const remainingDays = MAX_VACATION_DAYS - usedDays;
        const percentage = (usedDays / MAX_VACATION_DAYS) * 100;

        const card = document.createElement('div');
        card.className = 'vacation-day-card';
        card.style.borderLeftColor = member.color;

        const name = document.createElement('div');
        name.className = 'vacation-day-card-name';
        name.textContent = member.name;

        const stats = document.createElement('div');
        stats.className = 'vacation-day-card-stats';

        const usedStat = document.createElement('div');
        usedStat.className = 'vacation-day-stat used';
        usedStat.innerHTML = `
            <span class="vacation-day-stat-value">${usedDays}</span>
            <span class="vacation-day-stat-label">Genommen</span>
        `;

        const remainingStat = document.createElement('div');
        remainingStat.className = 'vacation-day-stat remaining';
        remainingStat.innerHTML = `
            <span class="vacation-day-stat-value">${remainingDays}</span>
            <span class="vacation-day-stat-label">Übrig</span>
        `;

        stats.appendChild(usedStat);
        stats.appendChild(remainingStat);

        const progress = document.createElement('div');
        progress.className = 'vacation-day-progress';

        const progressBar = document.createElement('div');
        progressBar.className = 'vacation-day-progress-bar';

        const progressFill = document.createElement('div');
        progressFill.className = 'vacation-day-progress-fill';
        progressFill.style.width = `${Math.min(percentage, 100)}%`;
        progressFill.style.backgroundColor = member.color;

        progressBar.appendChild(progressFill);
        progress.appendChild(progressBar);

        card.appendChild(name);
        card.appendChild(stats);
        card.appendChild(progress);

        vacationDaysCards.appendChild(card);
    });
}

// Render yearly calendar (all 12 months)
function renderYearlyCalendar() {
    yearlyCalendarDiv.innerHTML = '';

    const monthNames = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
                       'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

    for (let month = 0; month < 12; month++) {
        const monthContainer = document.createElement('div');
        monthContainer.className = 'month-container';

        const monthTitle = document.createElement('div');
        monthTitle.className = 'month-title';
        monthTitle.textContent = monthNames[month];

        const monthCalendar = document.createElement('div');
        monthCalendar.className = 'month-calendar';

        // Day headers
        const dayNames = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
        dayNames.forEach(day => {
            const header = document.createElement('div');
            header.className = 'calendar-day-header';
            header.textContent = day;
            monthCalendar.appendChild(header);
        });

        // Get first day of month (adjusted for Monday start)
        const firstDay = new Date(2026, month, 1);
        let firstDayOfWeek = firstDay.getDay();
        firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

        // Get last day of month
        const lastDay = new Date(2026, month + 1, 0);
        const daysInMonth = lastDay.getDate();

        // Previous month days
        const prevMonthLastDay = new Date(2026, month, 0);
        const prevMonthDays = prevMonthLastDay.getDate();

        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
            const day = prevMonthDays - i;
            const dayDiv = createDayElement(day, true);
            monthCalendar.appendChild(dayDiv);
        }

        // Current month days
        const today = new Date();
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(2026, month, day);
            const isToday = date.toDateString() === today.toDateString();
            const dayDiv = createDayElement(day, false, date, isToday);
            monthCalendar.appendChild(dayDiv);
        }

        // Next month days
        const totalCells = monthCalendar.children.length - 7; // Subtract header row
        const remainingCells = 42 - totalCells - 7; // 6 rows * 7 days - header

        for (let day = 1; day <= remainingCells; day++) {
            const dayDiv = createDayElement(day, true);
            monthCalendar.appendChild(dayDiv);
        }

        monthContainer.appendChild(monthTitle);
        monthContainer.appendChild(monthCalendar);
        yearlyCalendarDiv.appendChild(monthContainer);
    }
}

// Create day element
function createDayElement(day, isOtherMonth, date = null, isToday = false) {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'calendar-day';

    if (isOtherMonth) {
        dayDiv.classList.add('other-month');
    }

    if (isToday) {
        dayDiv.classList.add('today');
    }

    // Add special styling for weekends, holidays, and special days
    if (date && !isOtherMonth) {
        if (isWeekend(date)) {
            dayDiv.classList.add('weekend');
        }
        if (isHoliday(date)) {
            dayDiv.classList.add('holiday');
            const holiday = HOLIDAYS_2026.find(h => h.date === formatDateISO(date));
            if (holiday) {
                dayDiv.title = holiday.name;
            }
        }
        if (isSpecialDay(date)) {
            dayDiv.classList.add('special-day');
            dayDiv.title = 'Kein Urlaubstag';
        }
    }

    const dayNumber = document.createElement('div');
    dayNumber.className = 'day-number';
    dayNumber.textContent = day;
    dayDiv.appendChild(dayNumber);

    // Add vacation markers if date is provided
    if (date && !isOtherMonth) {
        const dayVacations = document.createElement('div');
        dayVacations.className = 'day-vacations';

        const vacationsForDay = getVacationsForDate(date);
        vacationsForDay.forEach(vacation => {
            const member = getMemberById(vacation.memberId);
            if (member) {
                const marker = document.createElement('div');
                marker.className = 'vacation-marker';
                marker.style.backgroundColor = member.color;
                marker.style.color = 'white';
                marker.textContent = member.name.split(' ')[0]; // First name only
                marker.title = `${member.name}: ${formatDate(vacation.startDate)} - ${formatDate(vacation.endDate)}`;
                marker.onclick = () => editVacation(vacation.id);
                dayVacations.appendChild(marker);
            }
        });

        dayDiv.appendChild(dayVacations);
    }

    return dayDiv;
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// Calculate total calendar days
function calculateTotalDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
}

// Update working days info when dates change
function updateWorkingDaysInfo() {
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;
    const memberId = parseInt(memberNameSelect.value);

    if (!startDate || !endDate || !memberId) {
        workingDaysInfo.classList.remove('show');
        return;
    }

    if (new Date(startDate) > new Date(endDate)) {
        workingDaysInfo.classList.remove('show');
        return;
    }

    const workingDays = calculateWorkingDays(startDate, endDate);
    const totalDays = calculateTotalDays(startDate, endDate);
    const usedDays = getUsedVacationDays(memberId);
    const currentVacationDays = editingVacationId ?
        calculateWorkingDays(vacations.find(v => v.id === editingVacationId).startDate,
                           vacations.find(v => v.id === editingVacationId).endDate) : 0;
    const newUsedDays = usedDays - currentVacationDays + workingDays;
    const remainingDays = MAX_VACATION_DAYS - newUsedDays;

    workingDaysInfo.innerHTML = '';
    workingDaysInfo.classList.add('show');
    workingDaysInfo.classList.remove('warning', 'error');

    const infoText = document.createElement('div');
    infoText.className = 'working-days-info-text';
    infoText.textContent = `Arbeitstage: ${workingDays} von ${totalDays} Tagen`;

    const infoDetail = document.createElement('div');
    infoDetail.className = 'working-days-info-detail';
    infoDetail.textContent = `Nach dieser Buchung: ${newUsedDays} von ${MAX_VACATION_DAYS} Tagen genutzt (${remainingDays} übrig)`;

    workingDaysInfo.appendChild(infoText);
    workingDaysInfo.appendChild(infoDetail);

    if (newUsedDays > MAX_VACATION_DAYS) {
        workingDaysInfo.classList.add('error');
        const errorText = document.createElement('div');
        errorText.className = 'working-days-info-text';
        errorText.textContent = `⚠️ Überschreitung um ${newUsedDays - MAX_VACATION_DAYS} Tage!`;
        workingDaysInfo.appendChild(errorText);
    } else if (remainingDays < 5) {
        workingDaysInfo.classList.add('warning');
    }
}

// Render vacation list
function renderVacationList() {
    vacationListContent.innerHTML = '';

    const selectedMemberId = memberSelect.value;
    const filteredVacations = selectedMemberId
        ? vacations.filter(v => v.memberId == selectedMemberId)
        : vacations;

    if (filteredVacations.length === 0) {
        vacationListContent.innerHTML = '<div class="empty-state"><p>Keine Urlaube geplant</p></div>';
        return;
    }

    // Sort by start date
    filteredVacations.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

    filteredVacations.forEach(vacation => {
        const member = getMemberById(vacation.memberId);
        if (!member) return;

        const item = document.createElement('div');
        item.className = 'vacation-item';

        const info = document.createElement('div');
        info.className = 'vacation-info';

        const memberDiv = document.createElement('div');
        memberDiv.className = 'vacation-member';
        memberDiv.style.backgroundColor = member.color;
        memberDiv.textContent = member.name;

        const datesDiv = document.createElement('div');
        datesDiv.className = 'vacation-dates';
        datesDiv.textContent = `${formatDate(vacation.startDate)} - ${formatDate(vacation.endDate)}`;

        const durationDiv = document.createElement('div');
        durationDiv.className = 'vacation-duration';
        const workingDays = calculateWorkingDays(vacation.startDate, vacation.endDate);
        const totalDays = calculateTotalDays(vacation.startDate, vacation.endDate);
        durationDiv.textContent = `(${workingDays} Arbeitstage von ${totalDays} Tagen)`;

        info.appendChild(memberDiv);
        info.appendChild(datesDiv);
        info.appendChild(durationDiv);

        const actions = document.createElement('div');
        actions.className = 'vacation-actions';

        const editBtn = document.createElement('button');
        editBtn.className = 'btn btn-primary btn-small';
        editBtn.textContent = 'Bearbeiten';
        editBtn.onclick = () => editVacation(vacation.id);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-danger btn-small';
        deleteBtn.textContent = 'Löschen';
        deleteBtn.onclick = () => deleteVacation(vacation.id);

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        item.appendChild(info);
        item.appendChild(actions);

        vacationListContent.appendChild(item);
    });
}

// Open modal for adding vacation
function openModal() {
    editingVacationId = null;
    vacationForm.reset();
    workingDaysInfo.classList.remove('show');
    modal.style.display = 'block';
}

// Close modal
function closeModal() {
    editingVacationId = null;
    vacationForm.reset();
    workingDaysInfo.classList.remove('show');
    modal.style.display = 'none';
}

// Edit vacation
function editVacation(id) {
    const vacation = vacations.find(v => v.id === id);
    if (!vacation) return;

    editingVacationId = id;
    memberNameSelect.value = vacation.memberId;
    startDateInput.value = vacation.startDate;
    endDateInput.value = vacation.endDate;

    updateWorkingDaysInfo();
    modal.style.display = 'block';
}

// Delete vacation
function deleteVacation(id) {
    if (confirm('Möchten Sie diesen Urlaub wirklich löschen?')) {
        vacations = vacations.filter(v => v.id !== id);
        saveVacations();
        renderVacationDaysCards();
        renderYearlyCalendar();
        renderVacationList();
    }
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();

    const memberId = parseInt(memberNameSelect.value);
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;

    // Validate dates
    if (new Date(startDate) > new Date(endDate)) {
        alert('Das Enddatum muss nach dem Startdatum liegen!');
        return;
    }

    // Calculate working days
    const workingDays = calculateWorkingDays(startDate, endDate);
    const usedDays = getUsedVacationDays(memberId);
    const currentVacationDays = editingVacationId ?
        calculateWorkingDays(vacations.find(v => v.id === editingVacationId).startDate,
                           vacations.find(v => v.id === editingVacationId).endDate) : 0;
    const newUsedDays = usedDays - currentVacationDays + workingDays;

    // Check vacation limit
    if (newUsedDays > MAX_VACATION_DAYS) {
        const member = getMemberById(memberId);
        alert(`${member.name} hat nur noch ${MAX_VACATION_DAYS - usedDays + currentVacationDays} Urlaubstage übrig. Diese Buchung würde ${workingDays} Arbeitstage benötigen.`);
        return;
    }

    if (editingVacationId) {
        // Update existing vacation
        const vacation = vacations.find(v => v.id === editingVacationId);
        vacation.memberId = memberId;
        vacation.startDate = startDate;
        vacation.endDate = endDate;
    } else {
        // Add new vacation
        const newVacation = {
            id: Date.now(),
            memberId,
            startDate,
            endDate
        };
        vacations.push(newVacation);
    }

    saveVacations();
    closeModal();
    renderVacationDaysCards();
    renderYearlyCalendar();
    renderVacationList();
}

// Handle member filter change
function handleMemberFilterChange() {
    renderYearlyCalendar();
    renderVacationList();
}

// Attach event listeners
function attachEventListeners() {
    addVacationBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    vacationForm.addEventListener('submit', handleFormSubmit);
    memberSelect.addEventListener('change', handleMemberFilterChange);

    // Update working days info when dates or member changes
    startDateInput.addEventListener('change', updateWorkingDaysInfo);
    endDateInput.addEventListener('change', updateWorkingDaysInfo);
    memberNameSelect.addEventListener('change', updateWorkingDaysInfo);

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Attach login form listener
    loginForm.addEventListener('submit', handleLogin);

    // Initialize app
    init();
});
