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
    // Для тем 4 и 5 добавьте аналогичные данные
];

const topicSelect = document.getElementById('topicSelect');
const questionsContainer = document.getElementById('questionsContainer');
const pdfViewer = document.getElementById('pdfViewer');
const placeholder = document.getElementById('placeholder');

// ⚠️ Убедитесь, что файл находится в той же папке, что и HTML
// или укажите правильный путь (например, "pdf/Лекции по ЧМ.pdf")
const PDF_NAME = "ChM.pdf";

// Заполняем выпадающий список темами
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

function openPdf(page) {
    placeholder.style.display = 'none';
    pdfViewer.style.display = 'block';
    
    // Кодируем имя файла для URL и добавляем параметр страницы
    // Используем encodeURIComponent для корректной обработки русских символов и пробелов
    const encodedFileName = encodeURIComponent(PDF_NAME);
    pdfViewer.src = `${encodedFileName}#page=${page}`;
}