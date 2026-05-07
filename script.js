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
];

const sidebar = document.getElementById('sidebar');
const openSidebarBtn = document.getElementById('openSidebarBtn');
const closeSidebarBtn = document.getElementById('closeSidebarBtn');
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

const PDF_URL = "ChM.pdf";

// Управление сайдбаром
openSidebarBtn.addEventListener('click', () => {
    sidebar.classList.remove('closed');
});

closeSidebarBtn.addEventListener('click', () => {
    sidebar.classList.add('closed');
});

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
        div.onclick = () => {
            openPdf(q.page);
            // На мобильных автоматически скрываем меню после выбора
            if (window.innerWidth <= 768) {
                sidebar.classList.add('closed');
            }
        };
        questionsContainer.appendChild(div);
    });
}

function openPdf(pageNum) {
    placeholder.style.display = 'none';
    pdfContainer.style.display = 'flex';
    
    pdfjsLib.getDocument(PDF_URL).promise.then(function(doc) {
        pdfDoc = doc;
        totalPages = doc.numPages;
        currentPage = pageNum;
        
        updatePageButtons();
        renderPage(currentPage);
    }).catch(function(error) {
        console.error("Ошибка:", error);
        pdfContainer.innerHTML = `<div style="color: red; padding: 20px; text-align: center;">
            ❌ Ошибка: не найден файл "${PDF_URL}"<br>
            Убедитесь, что он в той же папке
        </div>`;
    });
}

function renderPage(pageNum) {
    pdfDoc.getPage(pageNum).then(function(page) {
        // Автомасштабирование под ширину экрана
        const container = pdfContainer;
        const scale = (container.clientWidth - 40) / page.getViewport({ scale: 1 }).width;
        const viewport = page.getViewport({ scale: Math.min(scale, 2.5) });
        
        pdfCanvas.width = viewport.width;
        pdfCanvas.height = viewport.height;
        
        page.render({
            canvasContext: pdfCanvas.getContext('2d'),
            viewport: viewport
        });
        
        pageNumInfo.textContent = `${pageNum} / ${totalPages}`;
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

// При изменении размера окна перерисовываем страницу
window.addEventListener('resize', () => {
    if (pdfDoc && currentPage) {
        renderPage(currentPage);
    }
});