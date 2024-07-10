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

// Завантаження шаблонів
async function loadTemplates() {
    const data = await loadJSON('templates.json');
    if (!data) return;
    templates = data.templates;
    console.log('Завантажені шаблони:', templates);
    populateTemplateSelect();
}

// Завантаження структури
async function loadStructure() {
    const data = await loadJSON('structure.json');
    if (!data) return;
    const structureCheckboxes = document.getElementById('structure-checkboxes');
    console.log('Завантажені елементи структури:', data.elements);

    data.elements.forEach(element => {
        const checkbox = document.createElement('div');
        checkbox.classList.add('form-check');
        checkbox.innerHTML = `
            <input class="form-check-input" type="checkbox" value="${element}" id="${element}">
            <label class="form-check-label" for="${element}">${element}</label>
        `;
        structureCheckboxes.appendChild(checkbox);
    });
}

// Завантаження речень
async function loadSentences() {
    const data = await loadJSON('sentences.json');
    if (!data) return;
    sentences = data.sentences;
    console.log('Завантажені речення:', sentences);
    populateSentenceSelect();
}

// Заповнення вибіркових елементів
function populateTemplateSelect() {
    const templateSelect = document.getElementById('template-select');
    templateSelect.innerHTML = '';

    templates.forEach(template => {
        const option = document.createElement('option');
        option.value = template;
        option.textContent = template;
        templateSelect.appendChild(option);
    });
    console.log('Заповнені шаблони:', templateSelect.innerHTML);
}

// Заповнення речень у випадаючому списку
function populateSentenceSelect() {
    const sentenceSelect = document.getElementById('content-select');
    sentenceSelect.innerHTML = '';

    sentences.forEach((sentence, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = sentence;
        sentenceSelect.appendChild(option);
    });
}

// Вибір шаблону
function chooseTemplate() {
    const templateSelect = document.getElementById('template-select');
    const selectedTemplate = templateSelect.value;

    if (selectedTemplate) {
        document.getElementById('template-form').style.display = 'none';
        document.getElementById('structure-form').style.display = 'block';
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
    const selectedSentence = sentenceSelect.options[sentenceSelect.selectedIndex].textContent;

    if (!structure[currentStep].content) {
        structure[currentStep] = { title: structure[currentStep], content: [] };
    }
    structure[currentStep].content.push(selectedSentence);

    if (structure[currentStep].content.length >= 3) { // наприклад, 3 речення на елемент
        currentStep++;
        showCurrentElement();
    }
}

// Оновлення шаблону документа
function updateDocumentTemplate() {
    const documentTemplate = document.getElementById('document-template');
    documentTemplate.innerHTML = '';

    structure.forEach(section => {
        const sectionElement = document.createElement('div');
        const titleElement = document.createElement('h3');
        titleElement.textContent = section.title;
        sectionElement.appendChild(titleElement);

        section.content.forEach(sentence => {
            const sentenceElement = document.createElement('p');
            sentenceElement.textContent = sentence;
            sectionElement.appendChild(sentenceElement);
        });

        documentTemplate.appendChild(sectionElement);
    });
}

// Експорт документа (в простий текстовий формат для початку)
function exportDocument() {
    let documentContent = '';

    structure.forEach(section => {
        documentContent += section.title + '\n';
        section.content.forEach(sentence => {
            documentContent += '  - ' + sentence + '\n';
        });
        documentContent += '\n';
    });

    const blob = new Blob([documentContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'document.txt';
    link.click();
}

// Виклик функцій при завантаженні сторінки
window.onload = () => {
    loadTemplates();
    loadStructure();
    document.getElementById('template-form').style.display = 'block';
};
