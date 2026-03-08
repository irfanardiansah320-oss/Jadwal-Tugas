const tasksContainer = document.getElementById('tasksContainer');
const newTaskInput = document.getElementById('newTaskInput');
const taskDateInput = document.getElementById('taskDate');
const addTaskBtn = document.getElementById('addTaskBtn');

let tasks = [];

// Set default date input ke hari ini (format YYYY-MM-DD)
function setDefaultDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    taskDateInput.value = `${yyyy}-${mm}-${dd}`;
}

function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        // Pastikan setiap task punya properti 'date', jika tidak beri tanggal hari ini
        tasks = tasks.map(task => {
            if (!task.date) {
                task.date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
            }
            return task;
        });
    } else {
        // Contoh tasks dengan tanggal berbeda
        const today = new Date().toISOString().split('T')[0];
        const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
        tasks = [
            { id: Date.now(), text: 'Belajar HTML', completed: false, color: '#333333', date: today },
            { id: Date.now() + 1, text: 'Belajar CSS', completed: false, color: '#333333', date: today },
            { id: Date.now() + 2, text: 'Belajar JavaScript', completed: false, color: '#333333', date: tomorrow }
        ];
    }
    renderTasks();
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Format tanggal menjadi "Hari, Tanggal Bulan Tahun" (Indonesia)
function formatDateHeader(dateStr) {
    const date = new Date(dateStr + 'T00:00:00'); // Hindari timezone shift
    return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function renderTasks() {
    // Kelompokkan tasks berdasarkan tanggal
    const grouped = tasks.reduce((acc, task) => {
        if (!acc[task.date]) acc[task.date] = [];
        acc[task.date].push(task);
        return acc;
    }, {});

    // Urutkan tanggal dari yang paling awal ke terbaru
    const sortedDates = Object.keys(grouped).sort((a, b) => a.localeCompare(b));

    tasksContainer.innerHTML = '';

    sortedDates.forEach(date => {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'date-group';

        // Header tanggal
        const header = document.createElement('div');
        header.className = 'date-header';
        header.textContent = formatDateHeader(date);
        groupDiv.appendChild(header);

        // Daftar tugas
        const list = document.createElement('ul');
        list.className = 'tasks-list';

        // Urutkan tugas dalam grup (misal berdasarkan id, atau bisa ditambah properti urutan)
        grouped[date].sort((a, b) => a.id - b.id).forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            li.dataset.id = task.id;

            // Checkbox
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'task-checkbox';
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', () => toggleTask(task.id));

            // Teks
            const textSpan = document.createElement('span');
            textSpan.className = 'task-text';
            textSpan.textContent = task.text;
            textSpan.style.color = task.color || '#333333';
            textSpan.addEventListener('dblclick', () => editTaskText(task.id));

            // Tombol edit
            const editBtn = document.createElement('button');
            editBtn.className = 'task-edit-btn';
            editBtn.innerHTML = '<i class="fas fa-pencil-alt"></i>';
            editBtn.addEventListener('click', () => editTaskText(task.id));

            // Tombol warna
            const colorBtn = document.createElement('button');
            colorBtn.className = 'task-color-btn';
            colorBtn.innerHTML = '<i class="fas fa-palette"></i>';
            const colorPicker = document.createElement('input');
            colorPicker.type = 'color';
            colorPicker.className = 'color-picker';
            colorPicker.value = task.color || '#333333';
            colorPicker.addEventListener('input', (e) => changeTaskColor(task.id, e.target.value));
            colorBtn.addEventListener('click', () => colorPicker.click());

            // Tombol hapus
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'task-delete-btn';
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            deleteBtn.addEventListener('click', () => deleteTask(task.id));

            li.appendChild(checkbox);
            li.appendChild(textSpan);
            li.appendChild(editBtn);
            li.appendChild(colorBtn);
            li.appendChild(colorPicker);
            li.appendChild(deleteBtn);

            list.appendChild(li);
        });

        groupDiv.appendChild(list);
        tasksContainer.appendChild(groupDiv);
    });
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

function editTaskText(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        const newText = prompt('Edit kegiatan:', task.text);
        if (newText !== null && newText.trim() !== '') {
            task.text = newText.trim();
            saveTasks();
            renderTasks();
        }
    }
}

function changeTaskColor(id, newColor) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.color = newColor;
        saveTasks();
        renderTasks();
    }
}

function deleteTask(id) {
    const taskElement = document.querySelector(`.task-item[data-id="${id}"]`);
    if (taskElement) {
        taskElement.classList.add('removing');
        setTimeout(() => {
            tasks = tasks.filter(t => t.id !== id);
            saveTasks();
            renderTasks();
        }, 300);
    } else {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderTasks();
    }
}

function addNewTask() {
    const text = newTaskInput.value.trim();
    if (text === '') {
        alert('Masukkan kegiatan!');
        return;
    }
    let date = taskDateInput.value;
    if (!date) {
        // Jika tidak ada tanggal, gunakan hari ini
        const today = new Date().toISOString().split('T')[0];
        date = today;
    }
    const newTask = {
        id: Date.now(),
        text: text,
        completed: false,
        color: '#333333',
        date: date
    };
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    newTaskInput.value = '';
    setDefaultDate(); // kembalikan ke hari ini setelah tambah
}

addTaskBtn.addEventListener('click', addNewTask);
newTaskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addNewTask();
});

setDefaultDate();
loadTasks();