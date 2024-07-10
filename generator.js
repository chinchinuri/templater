let templates, structures, content;

// Перевірка, чи вже оголошені змінні
if (typeof templates === 'undefined') {
    var templates;
}
if (typeof structures === 'undefined') {
    var structures;
}
if (typeof content === 'undefined') {
    var content;
}

// Завантаження даних
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        templates = data.templates;
        structures = data.structures;
        content = data.content;
        initializeTemplateSelect();
    });

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');

    fetch('data.json')
        .then(response => {
            console.log('Fetch response received');
            return response.json();
        })
        .then(data => {
            console.log('Data parsed:', data);
            templates = data.templates;
            structures = data.structures;
            content = data.content;
            console.log('Data assigned to variables');
            initializeTemplateSelect();
        })
        .catch(error => {
            console.error('Error loading data:', error);
            alert('Помилка завантаження даних. Будь ласка, спробуйте оновити сторінку.');
        });
});

function initializeTemplateSelect() {
    console.log('Initializing template select');
    const select = document.getElementById('templateSelect');
    console.log('Select element:', select);
    select.innerHTML = ''; // Очищаємо попередні опції, якщо вони є
    const defaultOption = document.createElement('option');
    defaultOption.text = 'Виберіть шаблон';
    defaultOption.value = '';
    select.appendChild(defaultOption);

    templates.forEach((template, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = template.name;
        select.appendChild(option);
    });
    select.addEventListener('change', onTemplateSelect);
}

function onTemplateSelect() {
    const templateIndex = document.getElementById('templateSelect').value;
    if (!templateIndex) return; // Якщо вибрано пустий варіант, нічого не робимо

    const template = templates[templateIndex];
    if (!template) {
        console.error('Template not found');
        alert('Помилка: шаблон не знайдено');
        return;
    }
       
    const structureElements = document.getElementById('structureElements');
    structureElements.innerHTML = '';
    template.structure.forEach(element => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = element;
        checkbox.classList.add('form-check-input');
        
        const label = document.createElement('label');
        label.htmlFor = element;
        label.textContent = element;
        label.classList.add('form-check-label');
        
        const div = document.createElement('div');
        div.classList.add('form-check');
        div.appendChild(checkbox);
        div.appendChild(label);
        
        structureElements.appendChild(div);
    });
    
    document.getElementById('step2').style.display = 'block';
    document.getElementById('generateBtn').style.display = 'block';
    document.getElementById('generateBtn').addEventListener('click', onGenerate);
}

function onGenerate() {
    const contentElements = document.getElementById('contentElements');
    contentElements.innerHTML = '';
    
    const checkedElements = Array.from(document.querySelectorAll('#structureElements input:checked'))
        .map(input => input.id);
    
    checkedElements.forEach(element => {
        const select = document.createElement('select');
        select.id = `content-${element}`;
        select.classList.add('form-select', 'mb-2');
        
        const optionPlaceholder = document.createElement('option');
        optionPlaceholder.textContent = `Виберіть вміст для ${element}`;
        select.appendChild(optionPlaceholder);
        
        content[element].forEach((item, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = item;
            select.appendChild(option);
        });
        
        const label = document.createElement('label');
        label.htmlFor = `content-${element}`;
        label.textContent = element;
        label.classList.add('form-label');
        
        contentElements.appendChild(label);
        contentElements.appendChild(select);
    });
    
    document.getElementById('step3').style.display = 'block';
    document.getElementById('exportBtn').style.display = 'block';
    document.getElementById('exportBtn').addEventListener('click', onExport);
}

function onExport() {
    const templateIndex = document.getElementById('templateSelect').value;
    const template = templates[templateIndex];
    
    let document = template.content;
    
    const contentSelects = document.querySelectorAll('#contentElements select');
    contentSelects.forEach(select => {
        const element = select.id.replace('content-', '');
        const contentIndex = select.value;
        const contentText = content[element][contentIndex];
        
        document = document.replace(`{${element}}`, contentText);
    });
    
    // Тут можна додати логіку для експорту в ODT або Markdown
    console.log(document);  // Тимчасово виводимо в консоль
}
