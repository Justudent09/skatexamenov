// Добавьте в начало
const overlay = document.getElementById('overlay');

// Модифицируйте функции управления меню
function toggleMenu(isOpen) {
    if (isOpen) {
        sidebar.classList.remove('closed');
        overlay.classList.add('active');
    } else {
        sidebar.classList.add('closed');
        overlay.classList.remove('active');
    }
}

openSidebarBtn.addEventListener('click', () => toggleMenu(true));
closeSidebarBtn.addEventListener('click', () => toggleMenu(false));
overlay.addEventListener('click', () => toggleMenu(false));

// Улучшенный рендеринг страницы
function renderPage(pageNum) {
    pdfDoc.getPage(pageNum).then(function(page) {
        // Вычисляем масштаб так, чтобы PDF всегда был по ширине контейнера
        const viewportDefault = page.getViewport({ scale: 1 });
        const containerWidth = pdfContainer.clientWidth - 20; // отступы
        const scale = containerWidth / viewportDefault.width;
        
        // Ограничиваем четкость для мобильных (2.0 достаточно)
        const outputScale = window.devicePixelRatio || 1;
        const viewport = page.getViewport({ scale: scale });

        pdfCanvas.width = Math.floor(viewport.width * outputScale);
        pdfCanvas.height = Math.floor(viewport.height * outputScale);
        pdfCanvas.style.width = Math.floor(viewport.width) + "px";
        pdfCanvas.style.height = Math.floor(viewport.height) + "px";

        const transform = outputScale !== 1 
            ? [outputScale, 0, 0, outputScale, 0, 0] 
            : null;

        const renderContext = {
            canvasContext: pdfCanvas.getContext('2d'),
            transform: transform,
            viewport: viewport
        };
        
        page.render(renderContext);
        pageNumInfo.textContent = `${pageNum} / ${totalPages}`;
        
        // Скроллим вверх при переключении страницы
        pdfContainer.scrollTo(0, 0);
    });
}

// В функции renderQuestions добавьте закрытие меню
function renderQuestions(index) {
    // ... ваш код создания элементов ...
    div.onclick = () => {
        openPdf(q.page);
        toggleMenu(false); // Закрываем меню на любых экранах после выбора
    };
}
