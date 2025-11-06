// Team members with distinct colors
const TEAM_MEMBERS = [
    { id: 1, name: 'Alex Schmidt', color: '#FF6B6B' },
    { id: 2, name: 'Maria Müller', color: '#4ECDC4' },
    { id: 3, name: 'Thomas Weber', color: '#45B7D1' },
    { id: 4, name: 'Sarah Fischer', color: '#FFA07A' },
    { id: 5, name: 'Michael Becker', color: '#98D8C8' }
];

// Application state
let currentMonth = new Date(2026, 0, 1); // January 2026
let vacations = [];
let editingVacationId = null;

// DOM elements
const modal = document.getElementById('vacationModal');
const addVacationBtn = document.getElementById('addVacationBtn');
const closeBtn = document.querySelector('.close');
const cancelBtn = document.getElementById('cancelBtn');
const vacationForm = document.getElementById('vacationForm');
const memberSelect = document.getElementById('memberSelect');
const memberNameSelect = document.getElementById('memberName');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const calendarDiv = document.getElementById('calendar');
const currentMonthH2 = document.getElementById('currentMonth');
const legendItemsDiv = document.getElementById('legendItems');
const vacationListContent = document.getElementById('vacationListContent');

// Initialize the app
function init() {
    loadVacations();
    populateMemberSelects();
    renderLegend();
    renderCalendar();
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

// Render calendar
function renderCalendar() {
    calendarDiv.innerHTML = '';

    // Update month header
    const monthNames = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
                       'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
    currentMonthH2.textContent = `${monthNames[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`;

    // Day headers
    const dayNames = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
    dayNames.forEach(day => {
        const header = document.createElement('div');
        header.className = 'calendar-day-header';
        header.textContent = day;
        calendarDiv.appendChild(header);
    });

    // Get first day of month (adjusted for Monday start)
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    let firstDayOfWeek = firstDay.getDay();
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // Adjust for Monday start

    // Get last day of month
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Previous month days
    const prevMonthLastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0);
    const prevMonthDays = prevMonthLastDay.getDate();

    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const day = prevMonthDays - i;
        const dayDiv = createDayElement(day, true, -1);
        calendarDiv.appendChild(dayDiv);
    }

    // Current month days
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const isToday = date.toDateString() === today.toDateString();
        const dayDiv = createDayElement(day, false, 0, date, isToday);
        calendarDiv.appendChild(dayDiv);
    }

    // Next month days
    const totalCells = calendarDiv.children.length - 7; // Subtract header row
    const remainingCells = 42 - totalCells - 7; // 6 rows * 7 days - header

    for (let day = 1; day <= remainingCells; day++) {
        const dayDiv = createDayElement(day, true, 1);
        calendarDiv.appendChild(dayDiv);
    }
}

// Create day element
function createDayElement(day, isOtherMonth, monthOffset, date = null, isToday = false) {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'calendar-day';

    if (isOtherMonth) {
        dayDiv.classList.add('other-month');
    }

    if (isToday) {
        dayDiv.classList.add('today');
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

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// Calculate days between dates
function calculateDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
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
        const days = calculateDays(vacation.startDate, vacation.endDate);
        durationDiv.textContent = `(${days} Tag${days !== 1 ? 'e' : ''})`;

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
    modal.style.display = 'block';
}

// Close modal
function closeModal() {
    editingVacationId = null;
    vacationForm.reset();
    modal.style.display = 'none';
}

// Edit vacation
function editVacation(id) {
    const vacation = vacations.find(v => v.id === id);
    if (!vacation) return;

    editingVacationId = id;
    memberNameSelect.value = vacation.memberId;
    document.getElementById('startDate').value = vacation.startDate;
    document.getElementById('endDate').value = vacation.endDate;

    modal.style.display = 'block';
}

// Delete vacation
function deleteVacation(id) {
    if (confirm('Möchten Sie diesen Urlaub wirklich löschen?')) {
        vacations = vacations.filter(v => v.id !== id);
        saveVacations();
        renderCalendar();
        renderVacationList();
    }
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();

    const memberId = parseInt(memberNameSelect.value);
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    // Validate dates
    if (new Date(startDate) > new Date(endDate)) {
        alert('Das Enddatum muss nach dem Startdatum liegen!');
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
    renderCalendar();
    renderVacationList();
}

// Navigate to previous month
function prevMonth() {
    currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    renderCalendar();
}

// Navigate to next month
function nextMonth() {
    currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    renderCalendar();
}

// Handle member filter change
function handleMemberFilterChange() {
    renderCalendar();
    renderVacationList();
}

// Attach event listeners
function attachEventListeners() {
    addVacationBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    vacationForm.addEventListener('submit', handleFormSubmit);
    prevMonthBtn.addEventListener('click', prevMonth);
    nextMonthBtn.addEventListener('click', nextMonth);
    memberSelect.addEventListener('change', handleMemberFilterChange);

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
