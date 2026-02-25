const monthTitle = document.getElementById('monthTitle');
const weekdayRow = document.getElementById('weekdayRow');
const calendarGrid = document.getElementById('calendarGrid');
const prevMonthBtn = document.getElementById('prevMonthBtn');
const nextMonthBtn = document.getElementById('nextMonthBtn');

const todayDateEl = document.getElementById('todayDate');
const todoInput = document.getElementById('todoInput');
const addTodoBtn = document.getElementById('addTodoBtn');
const todoListEl = document.getElementById('todoList');
const emptyStateEl = document.getElementById('emptyState');
const pageSelect = document.getElementById('pageSelect');
const goPageBtn = document.getElementById('goPageBtn');

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const now = new Date();
const todayKey = formatDateKey(now);
let viewDate = new Date(now.getFullYear(), now.getMonth(), 1);

function formatDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getMonthYearLabel(date) {
    return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}

function renderWeekdays() {
weekdayRow.innerHTML = '';
	weekdays.forEach((weekday) => {
		const cell = document.createElement('div');
		cell.className = 'weekday';
		cell.textContent = weekday;
		weekdayRow.appendChild(cell);
	});
}

function renderCalendar() {
	const year = viewDate.getFullYear();
	const month = viewDate.getMonth();
	const firstDay = new Date(year, month, 1);
	const startDayOfWeek = firstDay.getDay();
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	const prevMonthDays = new Date(year, month, 0).getDate();

	monthTitle.textContent = getMonthYearLabel(viewDate);
	calendarGrid.innerHTML = '';

	for (let i = 0; i < 42; i += 1) {
		const cell = document.createElement('div');
		cell.className = 'day-cell';
		let dayNum;
		let cellDate;

		if (i < startDayOfWeek) {
		dayNum = prevMonthDays - startDayOfWeek + i + 1;
		cellDate = new Date(year, month - 1, dayNum);
		cell.classList.add('day-outside');
		} else if (i >= startDayOfWeek + daysInMonth) {
		dayNum = i - (startDayOfWeek + daysInMonth) + 1;
		cellDate = new Date(year, month + 1, dayNum);
		cell.classList.add('day-outside');
		} else {
		dayNum = i - startDayOfWeek + 1;
		cellDate = new Date(year, month, dayNum);
		}

		if (formatDateKey(cellDate) === todayKey) {
		cell.classList.add('day-today');
		}

		cell.textContent = String(dayNum);
		calendarGrid.appendChild(cell);
	}
}

function loadTodos() {
	try {
		return JSON.parse(localStorage.getItem('plannerTodos') || '{}');
	} catch {
		return {};
	}
}

function saveTodos(store) {
	localStorage.setItem('plannerTodos', JSON.stringify(store));
}

function getTodayTodos() {
	const store = loadTodos();
	return Array.isArray(store[todayKey]) ? store[todayKey] : [];
}

function setTodayTodos(todos) {
	const store = loadTodos();
	store[todayKey] = todos;
	saveTodos(store);
}

function renderTodos() {
	const todos = getTodayTodos();
	todoListEl.innerHTML = '';

	emptyStateEl.style.display = todos.length > 0 ? 'none' : 'block';

	todos.forEach((todo, index) => {
    const li = document.createElement('li');
    li.className = 'todo-item';

    const left = document.createElement('div');
    left.className = 'todo-left';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = Boolean(todo.done);
    checkbox.addEventListener('change', () => {
		const next = getTodayTodos();
		next[index].done = checkbox.checked;
		setTodayTodos(next);
		renderTodos();
    });

    const text = document.createElement('span');
    text.className = `todo-text${todo.done ? ' todo-done' : ''}`;
    text.textContent = todo.text;

    left.appendChild(checkbox);
    left.appendChild(text);

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => {
		const next = getTodayTodos().filter((_, i) => i !== index);
		setTodayTodos(next);
		renderTodos();
    });

    li.appendChild(left);
    li.appendChild(deleteBtn);
    todoListEl.appendChild(li);
	});
}

function addTodo() {
	const text = todoInput.value.trim();
	if (!text) return;

	const todos = getTodayTodos();
	todos.push({ text, done: false });
	setTodayTodos(todos);
	todoInput.value = '';
	renderTodos();
}

prevMonthBtn?.addEventListener('click', () => {
	viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
	renderCalendar();
});

nextMonthBtn?.addEventListener('click', () => {
	viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
	renderCalendar();
});

addTodoBtn?.addEventListener('click', addTodo);
todoInput?.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') addTodo();
});

todayDateEl.textContent = now.toLocaleDateString(undefined, {
	weekday: 'long',
	month: 'long',
	day: 'numeric',
	year: 'numeric',
});

renderWeekdays();
renderCalendar();
renderTodos();

function goToSelectedPage() {
	const selected = pageSelect?.value;
	if (!selected) return;
	window.location.href = selected;
}

if (pageSelect) {
	pageSelect.value = 'index.html';
}

goPageBtn?.addEventListener('click', goToSelectedPage);
pageSelect?.addEventListener('change', goToSelectedPage);
