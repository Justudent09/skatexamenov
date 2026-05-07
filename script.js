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

// Элементы DOM
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay'); // Не забудь добавить <div id="overlay" class="overlay"></div> в HTML
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

// --- УПРАВЛЕНИЕ МЕНЮ ---

function toggleMenu(isOpen) {
    if (isOpen) {
        sidebar.classList.remove('closed');
        if (overlay) overlay.classList.add('active');
    } else {
        sidebar.classList.add('closed');
        if (overlay) overlay.classList.remove('active');
    }
}

openSidebarBtn.addEventListener('click', () => toggleMenu(true));
closeSidebarBtn.addEventListener('click', () => toggleMenu(false));
if (overlay) overlay.addEventListener('click', () => toggleMenu(false));

// --- РАБОТА С ДАННЫМИ ---

// Заполняем селект темами
data.forEach((topic, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = `${index + 1}. ${topic.title}`;
    topicSelect.appendChild(option);
});

topicSelect.addEventListener('change', (e) => {
    const topicIndex = e.target.value;
    if (topicIndex !== "") renderQuestions(parseInt(topicIndex));
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
            toggleMenu(false); // Закрываем меню после выбора (важно для мобилок)
        };
        questionsContainer.appendChild(div);
    });
}

// --- РАБОТА С PDF ---

async function openPdf(pageNum) {
    placeholder.style.display = 'none';
    pdfContainer.style.display = 'flex';
    
    try {
        if (!pdfDoc) {
            pdfDoc = await pdfjsLib.getDocument(PDF_URL).promise;
            totalPages = pdfDoc.numPages;
        }
        currentPage = pageNum;
        renderPage(currentPage);
    } catch (error) {
        console.error("Ошибка загрузки PDF:", error);
        pdfContainer.innerHTML = `<div style="color: #ef4444; padding: 20px; text-align: center;">
            ❌ Ошибка: файл "${PDF_URL}" не найден.
        </div>`;
    }
}

async function renderPage(pageNum) {
    if (!pdfDoc) return;

    const page = await pdfDoc.getPage(pageNum);
    const context = pdfCanvas.getContext('2d');
    
    // Расчет масштаба под ширину экрана
    const containerWidth = pdfContainer.clientWidth - 20;
    const viewportDefault = page.getViewport({ scale: 1 });
    const scale = containerWidth / viewportDefault.width;
    const viewport = page.getViewport({ scale: scale });

    // Улучшение четкости (HiDPI / Retina)
    const outputScale = window.devicePixelRatio || 1;
    pdfCanvas.width = Math.floor(viewport.width * outputScale);
    pdfCanvas.height = Math.floor(viewport.height * outputScale);
    pdfCanvas.style.width = Math.floor(viewport.width) + "px";
    pdfCanvas.style.height = Math.floor(viewport.height) + "px";

    const renderContext = {
        canvasContext: context,
        transform: outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null,
        viewport: viewport
    };
    
    await page.render(renderContext).promise;
    
    pageNumInfo.textContent = `${pageNum} / ${totalPages}`;
    pdfContainer.scrollTo(0, 0); // Скролл вверх при смене страницы
}

// Навигация кнопками
prevPageBtn.onclick = () => {
    if (currentPage > 1) {
        currentPage--;
        renderPage(currentPage);
    }
};

nextPageBtn.onclick = () => {
    if (currentPage < totalPages) {
        currentPage++;
        renderPage(currentPage);
    }
};

// Перерисовка при изменении размера окна (адаптивность)
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (pdfDoc) renderPage(currentPage);
    }, 200);
});
