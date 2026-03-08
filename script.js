const tasksList = document.getElementById('tasksList');
const newTaskInput = document.getElementById('newTaskInput');
const addTaskBtn = document.getElementById('addTaskBtn');

let tasks = [];

function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    } else {
        tasks = [
            { id: Date.now(), text: 'Belajar HTML', completed: false, color: '#333333' },
            { id: Date.now() + 1, text: 'Belajar CSS', completed: false, color: '#333333' },
            { id: Date.now() + 2, text: 'Belajar JavaScript', completed: false, color: '#333333' }
        ];
    }
    renderTasks();
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    tasksList.innerHTML = '';
    tasks.forEach(task => {
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

        tasksList.appendChild(li);
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
    const newTask = {
        id: Date.now(),
        text: text,
        completed: false,
        color: '#333333'
    };
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    newTaskInput.value = '';
}

addTaskBtn.addEventListener('click', addNewTask);
newTaskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addNewTask();
    }
});

loadTasks();