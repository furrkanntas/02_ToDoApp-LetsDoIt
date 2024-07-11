const addForm = document.querySelector('.add');
const list = document.querySelector('.todos');
const search = document.querySelector('.search input');
const completedList = document.querySelector('.completed');
const updateTodoCount = () => {
    const todoCount = document.querySelectorAll('.todos .cardFt').length;
    const doneCount = document.querySelectorAll('.completed .cardFt').length;
    
    document.querySelector('.doTaskFt').textContent = todoCount;
    document.querySelector('.doneTaskFt').textContent = doneCount;
};

// Seçilen rengi saklamak için bir değişken tanımla
let selectedColor = 'bg-white/30';

// Todo'ları local storage'a kaydet
const saveTodos = todos => {
    localStorage.setItem('todos', JSON.stringify(todos));
};

// Local storage'dan todo'ları al ve sırala
const getTodos = () => {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    // To Do listesi için Added At saatine göre en güncel olan en alta
    const todoList = todos.filter(todo => !todo.completedAt);
    todoList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Completed listesi için Done At saatine göre en güncel olan en alta
    const completedList = todos.filter(todo => todo.completedAt);
    completedList.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

    return [...todoList, ...completedList];
};

const generateTemplate = (todoText, createdAt, completedAt = null, backgroundColor = 'bg-white/30') => {
    const completedClass = completedAt ? 'completed-task' : '';
    const doneAtText = completedAt ? `Done At: ${completedAt}` : '';
    const doneAtDisplay = completedAt ? 'block' : 'none';
    const xIconDisplay = completedAt ? 'block' : 'none';
    const checkIconDisplay = completedAt ? 'none' : 'block';

    const html = `
        <div class="cardFt w-full ${backgroundColor} backdrop-blur-md ring ring-green-700/50 rounded-2xl shadow-lg mb-4">
            <div class="grid grid-cols-12">
                <div class="col-span-11">
                    <div class="flex flex-col">
                        <p class="p-2 ${completedClass}"><span><i class="fa-regular fa-star text-orange-700/50 pr-1"></i></span>${todoText}</p>
                        <div class="flex flex-row justify-between items-center gap-2 pb-1 pl-2">
                            <div class="flex gap-1">
                                <span class="text-xs font-semibold bg-blue-300/50 px-1.5 rounded-xl shadow-md addedAt">Added At: ${createdAt}</span>
                                <span class="text-xs font-semibold bg-green-300/50 px-1.5 rounded-xl shadow-md doneAt" style="display: ${doneAtDisplay};">${doneAtText}</span>
                            </div>
                            <div class="flex gap-3">
                                <div class="doDefFt w-4 h-4 cursor-pointer bg-white/50 border border-green-700 rounded-full shadow-sm"></div>
                                <div class="doRedFt w-4 h-4 cursor-pointer bg-red-300/50 border border-green-700 rounded-full shadow-sm"></div>
                                <div class="doBlueFt w-4 h-4 cursor-pointer bg-blue-300/50 border border-green-700 rounded-full shadow-sm"></div>
                                <div class="doGreenFt w-4 h-4 cursor-pointer bg-green-300/50 border border-green-700 rounded-full shadow-sm"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-span-1">
                    <div class="flex h-full flex-col justify-center items-center gap-4">
                        <i class="fa-solid fa-check complete cursor-pointer" style="display: ${checkIconDisplay};"></i>
                        <i class="fa-solid fa-x xMark cursor-pointer" style="display: ${xIconDisplay};"></i>
                        <i class="far fa-trash-alt delete cursor-pointer"></i>
                    </div>
                </div>
            </div>
        </div>
    `;

    if (completedAt) {
        completedList.insertAdjacentHTML('beforeend', html);
    } else {
        list.insertAdjacentHTML('beforeend', html);
    }

    // Renk değiştirme olayları
    const lastAddedTodo = (completedAt ? completedList : list).lastElementChild;

    const updateColor = (colorClass) => {
        lastAddedTodo.classList.remove('bg-white/30', 'bg-red-200/30', 'bg-blue-200/30', 'bg-green-200/30');
        lastAddedTodo.classList.add(colorClass);

        // Local storage güncelleme
        const todos = getTodos();
        const todo = todos.find(t => t.text === todoText);
        todo.backgroundColor = colorClass;
        saveTodos(todos);
    };

    lastAddedTodo.querySelector('.doDefFt').addEventListener('click', () => updateColor('bg-white/30'));
    lastAddedTodo.querySelector('.doRedFt').addEventListener('click', () => updateColor('bg-red-200/30'));
    lastAddedTodo.querySelector('.doBlueFt').addEventListener('click', () => updateColor('bg-blue-200/30'));
    lastAddedTodo.querySelector('.doGreenFt').addEventListener('click', () => updateColor('bg-green-200/30'));
};

// Todo ekleme
addForm.addEventListener('submit', e => {
    e.preventDefault();
    const todoText = addForm.add.value.trim();
    const createdAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    let finalColor = selectedColor.includes('focus:bg-yellow-200/20') ? 'bg-white/30' :
                    selectedColor.includes('bg-red-300/50') ? 'bg-red-200/30' :
                    selectedColor.includes('bg-blue-300/50') ? 'bg-blue-200/30' :
                    selectedColor.includes('bg-green-300/50') ? 'bg-green-200/30' : selectedColor;

    if (todoText.length) {
        generateTemplate(todoText, createdAt, null, finalColor);
        const todos = getTodos();
        todos.push({ text: todoText, createdAt: createdAt, completedAt: null, backgroundColor: finalColor });
        saveTodos(todos);
        addForm.reset();
        updateTodoCount(); // Görev sayısını güncelle
    }
});

// Renklerin tıklama olayları // backDefault olarak güncelle
document.querySelectorAll('.backDefFt, .backRedFt, .backBlueFt, .backGreenFt').forEach(colorButton => {
    colorButton.addEventListener('click', () => {
        const inputElement = document.querySelector('input[name="add"]');
        selectedColor = colorButton.classList.contains('backRedFt') ? 'bg-red-300/50' :
                        colorButton.classList.contains('backBlueFt') ? 'bg-blue-300/50' :
                        colorButton.classList.contains('backGreenFt') ? 'bg-green-300/50' : 
                        colorButton.classList.contains('backDefFt') ? 'focus:bg-yellow-200/20' : '';

        // Eski focus:bg sınıfını temizle ve yeni sınıfı ekle
        inputElement.classList.remove('bg-red-300/50', 'bg-blue-300/50', 'bg-green-300/50', 'focus:bg-yellow-200/20');
        inputElement.classList.add(`${selectedColor}`);
    });
});

// Sayfa yüklendiğinde todo'ları yükle
document.addEventListener('DOMContentLoaded', () => {
    const todos = getTodos();
    todos.forEach(todo => {
        generateTemplate(todo.text, todo.createdAt, todo.completedAt, todo.backgroundColor);
    });

    updateTodoCount(); // Görev sayısını güncelle
});

// Todo tamamlama ve geri alma
document.addEventListener('click', e => {
    if (e.target.classList.contains('complete') || e.target.classList.contains('xMark')) {
        const todoElement = e.target.closest('.w-full');
        const todoTextElement = todoElement.querySelector('p');
        const todoText = todoTextElement.textContent.trim();
        const todos = getTodos();
        const todo = todos.find(t => t.text === todoText); // id vereceğiz !!!!

        if (e.target.classList.contains('complete')) {
            // Tamamlama işlemi
            todo.completedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            todoElement.querySelector('.doneAt').textContent = `Done At: ${todo.completedAt}`;
            todoElement.querySelector('.doneAt').style.display = 'block';
            todoTextElement.classList.add('completed-task');
            e.target.style.display = 'none';
            todoElement.querySelector('.xMark').style.display = 'block';
            completedList.appendChild(todoElement);
        } else {
            // Geri alma işlemi
            todo.completedAt = null;
            todo.createdAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            todoElement.querySelector('.doneAt').textContent = '';
            todoElement.querySelector('.doneAt').style.display = 'none';
            todoTextElement.classList.remove('completed-task');
            e.target.style.display = 'none';
            todoElement.querySelector('.complete').style.display = 'block';
            todoElement.querySelector('.addedAt').textContent = `Added At: ${todo.createdAt}`;
            list.appendChild(todoElement);
        }

        saveTodos(todos);
        updateTodoCount(); // Görev sayısını güncelle
    }

    // Görev silme
    if (e.target.classList.contains('delete')) {
        const todoElement = e.target.closest('.w-full');
        const todoText = todoElement.querySelector('p').textContent.trim();
        let todos = getTodos();
        todos = todos.filter(todo => todo.text !== todoText);
        saveTodos(todos);
        todoElement.remove();
        updateTodoCount(); // Görev sayısını güncelle
    }
});

const filterTodos = term => {
    // To Do listesini filtrele
    Array.from(list.children)
        .filter(todo => !todo.textContent.toLowerCase().includes(term))
        .forEach(todo => todo.classList.add('filtered'));

    Array.from(list.children)
        .filter(todo => todo.textContent.toLowerCase().includes(term))
        .forEach(todo => todo.classList.remove('filtered'));

    // Tamamlanmış görevler listesini filtrele
    Array.from(completedList.children)
        .filter(todo => !todo.textContent.toLowerCase().includes(term))
        .forEach(todo => todo.classList.add('filtered'));

    Array.from(completedList.children)
        .filter(todo => todo.textContent.toLowerCase().includes(term))
        .forEach(todo => todo.classList.remove('filtered'));
};

// Arama çubuğuna her yazıldığında filtre uygula
search.addEventListener('keyup', () => {
    const term = search.value.trim().toLowerCase();
    filterTodos(term);
});

// Tarih ve Saat bilgilerini ayarlama
function updateDateTime() {
    const now = new Date();
    const formattedDate = dateFns.format(now, 'MMMM d - EEEE');
    const formattedTime = dateFns.format(now, 'HH:mm:ss');
    const formattedYear = dateFns.format(now, 'yyyy');

    // Date, Time ve Year elementlerini seç
    const dateElement = document.querySelector('.date-text');
    const timeElement = document.querySelector('.time-text');
    const yearElement = document.querySelector('.yearft');

    // Güncel tarih, saat ve yılı elementlere ekle
    dateElement.textContent = formattedDate;
    timeElement.textContent = formattedTime;
    yearElement.textContent = formattedYear;
}

// Başlangıçta bir kez çalıştır
updateDateTime();

// Her saniye tarih ve saati güncelle
setInterval(updateDateTime, 1000);