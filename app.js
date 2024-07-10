let structure = [];
let currentStep = 0;
let sentences = [];
let templates = [];

// Функція для завантаження JSON файлу
async function loadJSON(file) {
    const response = await fetch(file);
    if (!response.ok) {
        console.error('Помилка завантаження JSON файлу:', file);
        return null;
    }
    const data = await response.json();
    return data;
}

// Завантаження даних
async function loadData() {
    const data = await loadJSON('data.json');
    if (!data) return;
    templates = data.templates;
    const structures = data.structures;
    const content = data.content;

    // Заповнюємо вибіркові списки
    populateTemplateSelect();
    populateStructureCheckboxes(structures);
    populateSentenceSelect(content);
}

// Заповнення вибіркових елементів шаблонів
function populateTemplateSelect() {
    const templateSelect = document.getElementById('template-select');
    templateSelect.innerHTML = '';

    templates.forEach(template => {
        const option = document.createElement('option');
        option.value = template.name;
        option.textContent = template.name;
        templateSelect.appendChild(option);
    });
}

// Заповнення чекбоксів структури документа
function populateStructureCheckboxes(structures) {
    const structureCheckboxes = document.getElementById('structure-checkboxes');
    structureCheckboxes.innerHTML = '';

    Object.keys(structures).forEach(key => {
        const structureElements = structures[key];
        structureElements.forEach(element => {
            const checkbox = document.createElement('div');
            checkbox.classList.add('form-check');
            checkbox.innerHTML = `
                <input class="form-check-input" type="checkbox" value="${element}" id="${element}">
                <label class="form-check-label" for="${element}">${element}</label>
            `;
            structureCheckboxes.appendChild(checkbox);
        });
    });
}

// Заповнення речень у випадаючому списку
function populateSentenceSelect(content) {
    const sentenceSelect = document.getElementById('content-select');
    sentenceSelect.innerHTML = '';

    Object.keys(content).forEach(key => {
        content[key].forEach((sentence, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = sentence;
            sentenceSelect.appendChild(option);
        });
    });
}

// Вибір шаблону
function chooseTemplate() {
    const templateSelect = document.getElementById('template-select');
    const selectedTemplateName = templateSelect.value;

    const selectedTemplate = templates.find(template => template.name === selectedTemplateName);

    if (selectedTemplate) {
        document.getElementById('template-form').style.display = 'none';
        document.getElementById('structure-form').style.display = 'block';
        populateStructureCheckboxes(selectedTemplate.structure);
    } else {
        alert('Будь ласка, виберіть шаблон.');
    }
}

// Додавання структури документа
function addStructure() {
    const checkboxes = document.querySelectorAll('#structure-form input[type="checkbox"]:checked');
    structure = Array.from(checkboxes).map(checkbox => checkbox.value);

    if (structure.length > 0) {
        document.getElementById('structure-form').style.display = 'none';
        document.getElementById('content-form').style.display = 'block';
        loadSentences();
        showCurrentElement();
    } else {
        alert('Будь ласка, виберіть хоча б один елемент для структури.');
    }
}

// Завантаження речень
async function loadSentences() {
    const data = await loadJSON('data.json');
    if (!data) return;
    const content = data.content;
    sentences = [];

    Object.keys(content).forEach(key => {
        sentences = sentences.concat(content[key]);
    });
}

// Відображення поточного елемента
function showCurrentElement() {
    if (currentStep < structure.length) {
        document.getElementById('current-element').textContent = structure[currentStep];
    } else {
        document.getElementById('content-form').style.display = 'none';
        document.getElementById('preview-section').style.display = 'block';
        updateDocumentTemplate();
    }
}

// Додавання контенту до поточного елемента
function addContent() {
    const sentenceSelect = document.getElementById('content-select');
    const selectedSentenceIndex = parseInt(sentenceSelect.value);

    if (!isNaN(selectedSentenceIndex) && selectedSentenceIndex >= 0) {
        const selectedSentence = sentences[selectedSentenceIndex];
        const currentElement = structure[currentStep];
        const textarea = document.getElementById('document-content');
        textarea.value += `\n\n{${currentElement}}\n\n${selectedSentence}`;
        currentStep++;
        showCurrentElement();
    } else {
        alert('Будь ласка, виберіть речення для додавання до документу.');
    }
}

// Оновлення шаблону документа
function updateDocumentTemplate() {
    const templateSelect = document.getElementById('template-select');
    const selectedTemplateName = templateSelect.value;

    const selectedTemplate = templates.find(template => template.name === selectedTemplateName);

    if (selectedTemplate) {
        const documentContent = document.getElementById('document-content');
        documentContent.value = selectedTemplate.content;
    }
}

// Експорт документа
function exportDocument() {
    const documentContent = document.getElementById('document-content').value;

    // Ваш код для експорту документа, наприклад, в DOCX або ODT
    console.log('Експорт документа:\n', documentContent);
}

// Ініціалізація додатку
async function initializeApp() {
    await loadData();
}

// Запуск додатку
initializeApp();
