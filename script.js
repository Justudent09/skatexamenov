// Данные лекций
const data = [
    {
        title: "Численные методы алгебры",
        questions: [
            { text: "1. Метод квадратного корня (Холецкого)", page: 5 },
            { text: "2. Одношаговые итерационные методы (Якоби, Зейделя)", page: 12 },
            { text: "3. Критерий сходимости стационарного метода", page: 18 },
            { text: "4. Попеременно-треугольный метод", page: 25 },
            { text: "7. Метод вращений поиска собств. значений", page: 40 }
        ]
    },
    {
        title: "Решение нелинейных уравнений",
        questions: [
            { text: "1. Методы разделения корней. Простая итерация. Ньютон", page: 55 },
            { text: "6. Метод Ньютона для систем", page: 62 }
        ]
    },
    {
        title: "Интерполяция и приближение функций",
        questions: [
            { text: "1. Полиномы Лагранжа и Эрмита", page: 70 },
            { text: "2. Интерполирование сплайнами", page: 85 }
        ]
    }
    // Добавьте 4 и 5 тему по такому же принципу
];

const topicSelect = document.getElementById('topicSelect');
const questionsContainer = document.getElementById('questionsContainer');
const placeholder = document.getElementById('placeholder');
const pdfContainer = document.getElementById('pdfContainer');
const pdfCanvas = document.getElementById('pdfCanvas');
const pageNumInfo = document.getElementById('pageNumInfo');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');

let pdfDoc = null;
let currentPage = 1;
let totalPages = 0;

// Имя PDF файла (положите ChM.pdf в ту же папку, что и index.html)
const PDF_URL = "ChM.pdf";

// Заполняем темы
data.forEach((topic, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = `${index + 1}. ${topic.title}`;
    topicSelect.appendChild(option);
});

topicSelect.addEventListener('change', (e) => {
    const topicIndex = e.target.value;
    if (topicIndex === "" || topicIndex === null) return;
    renderQuestions(parseInt(topicIndex));
});

function renderQuestions(index) {
    questionsContainer.innerHTML = '';
    const topic = data[index];
    if (!topic) return;

    topic.questions.forEach(q => {
        const div = document.createElement('div');
        div.className = 'question-item';
        div.innerText = q.text;
        div.onclick = () => openPdf(q.page);
        questionsContainer.appendChild(div);
    });
}

function openPdf(pageNum) {
    // Показываем контейнер с PDF, скрываем плейсхолдер
    placeholder.style.display = 'none';
    pdfContainer.style.display = 'flex';
    
    // Загружаем PDF
    pdfjsLib.getDocument(PDF_URL).promise.then(function(doc) {
        pdfDoc = doc;
        totalPages = doc.numPages;
        currentPage = pageNum;
        
        // Обновляем навигацию
        updatePageButtons();
        
        // Рендерим нужную страницу
        renderPage(currentPage);
    }).catch(function(error) {
        console.error("Ошибка загрузки PDF:", error);
        pdfContainer.innerHTML = `<div style="color: red; padding: 20px; text-align: center;">
            Ошибка загрузки PDF файла. Проверьте, что файл "${PDF_URL}" находится в той же папке.
        </div>`;
    });
}

function renderPage(pageNum) {
    pdfDoc.getPage(pageNum).then(function(page) {
        // Масштабируем под ширину окна
        const viewport = page.getViewport({ scale: 1.5 });
        const canvasContext = pdfCanvas.getContext('2d');
        
        pdfCanvas.width = viewport.width;
        pdfCanvas.height = viewport.height;
        
        page.render({
            canvasContext: canvasContext,
            viewport: viewport
        });
        
        pageNumInfo.textContent = `Страница ${pageNum} из ${totalPages}`;
    });
}

function updatePageButtons() {
    prevPageBtn.onclick = () => {
        if (currentPage <= 1) return;
        currentPage--;
        renderPage(currentPage);
    };
    
    nextPageBtn.onclick = () => {
        if (currentPage >= totalPages) return;
        currentPage++;
        renderPage(currentPage);
    };
}