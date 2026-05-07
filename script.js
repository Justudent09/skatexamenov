// Данные лекций (твои обновленные данные)
const data = [
    {
        title: "Численные методы алгебры",
        questions: [
            { text: "1. Метод квадратного корня (Холецкого)", page: 11 },
            { text: "2. Примеры одношаговых итерационных методов (Якоби, Зейделя, Релаксации)", page: 17 },
            { text: "3. Критерий сходимости одношагового стационарного итерационного метода", page: 19 },
            { text: "4. Попеременно-треугольный итерационный метод", page: 1 },
            { text: "5. Чебышевский набор итерационных параметров", page: 1 },
            { text: "6. Методы вариационного типа", page: 1 },
            { text: "7. Метод вращений поиска собственных значений", page: 1 },
            { text: "8. Степенной метод поиска собственных значений", page: 1 }
        ]
    },
    {
        title: "Решение нелинейных уравнений",
        questions: [
            { text: "1. Методы разделения корней", page: 66 },
            { text: "6. Метод Ньютона для решения систем нелинейных уравнений", page: 77 }
        ]
    },
    {
        title: "Интерполирование и приближение функций",
        questions: [
            { text: "1. Интерполирование алгебраическими многочленами", page: 83 },
            { text: "2. Интерполирование сплайнами", page: 87 },
            { text: "3. Наилучшее приближение в гильбертовом пространстве", page: 94 }
        ]
    },
    {
        title: "Численное интегрирование ОДУ",
        questions: [
            { text: "1. Методы Рунге-Кутта", page: 102 },
            { text: "2. Двухэтапные методы Рунге-Кутта второго порядка аппроксимации", page: 105 },
            { text: "3. Методы Адамса и Гира", page: 111 },
            { text: "4. Многошаговые методы", page: 1 },
            { text: "5. Интегро-интерполяционный метод на примере линейного дифференциального уравнения второго порядка", page: 121 },
            { text: "6. Порядок аппроксимации разностной схемы, определение", page: 126 }
        ]
    },
    {
        title: "Разностные методы",
        questions: [
            { text: "1. Явная и неявная схемы для уравнения теплопроводности", page: 132 },
            { text: "2. Схема с весами для уравнения теплопроводности", page: 143 },
            { text: "3. Задача на собственные значения для оператора второй разностной производной", page: 1 },
            { text: "4. Задача на собственные значения для пятиточечного разностного оператора Лапласа", page: 1 },
            { text: "5. Асимптотическая устойчивость", page: 1 },
            { text: "6. Недостатки обычных методов для решения 2-мерного уравнения теплопроводности", page: 1 }
        ]
    }
];

const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
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
let isRendering = false; // Флаг для предотвращения наложения рендеров
let renderPending = null; // Очередь для рендеринга
const PDF_URL = "ChM.pdf";

// --- МЕНЮ ---
function toggleMenu(isOpen) {
    sidebar.classList.toggle('closed', !isOpen);
    if (overlay) overlay.classList.toggle('active', isOpen);
}

openSidebarBtn.onclick = () => toggleMenu(true);
closeSidebarBtn.onclick = () => toggleMenu(false);
if (overlay) overlay.onclick = () => toggleMenu(false);

// --- ДАННЫЕ ---
data.forEach((topic, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = `${index + 1}. ${topic.title}`;
    topicSelect.appendChild(option);
});

topicSelect.onchange = (e) => {
    const idx = e.target.value;
    if (idx !== "") renderQuestionsList(parseInt(idx));
};

function renderQuestionsList(index) {
    questionsContainer.innerHTML = '';
    const topic = data[index];
    topic.questions.forEach(q => {
        const div = document.createElement('div');
        div.className = 'question-item';
        div.innerText = q.text;
        div.onclick = () => {
            openPdf(q.page);
            toggleMenu(false);
        };
        questionsContainer.appendChild(div);
    });
}

// --- PDF КОРЕ-ЛОГИКА ---
async function openPdf(pageNum) {
    placeholder.style.display = 'none';
    pdfContainer.style.display = 'flex';

    try {
        if (!pdfDoc) {
            // Инициализация PDFJS (если библиотека еще не настроена)
            const loadingTask = pdfjsLib.getDocument(PDF_URL);
            pdfDoc = await loadingTask.promise;
            totalPages = pdfDoc.numPages;
        }
        currentPage = pageNum;
        queueRenderPage(currentPage);
    } catch (error) {
        console.error("PDF Error:", error);
        pdfContainer.innerHTML = `<div style="color:red; padding:20px;">Ошибка: убедитесь, что файл ChM.pdf лежит в папке с сайтом.</div>`;
    }
}

function queueRenderPage(num) {
    if (isRendering) {
        renderPending = num;
    } else {
        renderPage(num);
    }
}

async function renderPage(pageNum) {
    isRendering = true;
    const page = await pdfDoc.getPage(pageNum);
    const context = pdfCanvas.getContext('2d');

    // Настройка масштаба
    const viewportWidth = pdfContainer.clientWidth - 30;
    const initialViewport = page.getViewport({ scale: 1 });
    const scale = viewportWidth / initialViewport.width;
    const viewport = page.getViewport({ scale: scale });

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
    isRendering = false;

    // Если во время рендера прилетел запрос на новую страницу - рисуем её
    if (renderPending !== null) {
        renderPage(renderPending);
        renderPending = null;
    }

    pageNumInfo.textContent = `${pageNum} / ${totalPages}`;
    pdfContainer.scrollTo(0, 0);
}

// Навигация
prevPageBtn.onclick = () => {
    if (currentPage <= 1) return;
    currentPage--;
    queueRenderPage(currentPage);
};

nextPageBtn.onclick = () => {
    if (currentPage >= totalPages) return;
    currentPage++;
    queueRenderPage(currentPage);
};

window.onresize = () => {
    if (pdfDoc) queueRenderPage(currentPage);
};
