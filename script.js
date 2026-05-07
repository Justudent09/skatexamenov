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
    // И так далее для 4 и 5 темы...
];

const topicSelect = document.getElementById('topicSelect');
const questionsContainer = document.getElementById('questionsContainer');
const pdfViewer = document.getElementById('pdfViewer');
const placeholder = document.getElementById('placeholder');

const PDF_NAME = "Лекции по ЧМ (3курс, 2 поток).pdf";

topicSelect.addEventListener('change', (e) => {
    const topicIndex = e.target.value;
    renderQuestions(topicIndex);
});

function renderQuestions(index) {
    questionsContainer.innerHTML = '';
    const questions = data[index].questions;

    questions.forEach(q => {
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
    // Добавляем параметр страницы к пути PDF
    pdfViewer.src = `${encodeURIComponent(PDF_NAME)}#page=${page}`;
}
