// AFFPRESS Visual Editor Client Script
// Injetado no iframe para permitir edição Point & Click

(function () {
    console.log('AFFPRESS Editor: Initializing...');

    let activeElement = null;
    let originalOutline = '';

    // Estilos do Editor
    const style = document.createElement('style');
    style.innerHTML = `
        .affpress-hover {
            outline: 2px dashed #8B5CF6 !important;
            cursor: pointer !important;
        }
        .affpress-selected {
            outline: 2px solid #06B6D4 !important;
            cursor: text !important;
        }
        .affpress-toolbar {
            position: fixed;
            background: #1E1E2E;
            border: 1px solid #2E2E3E;
            border-radius: 8px;
            padding: 8px;
            display: flex;
            gap: 8px;
            z-index: 999999;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5);
            color: white;
            font-family: sans-serif;
            font-size: 14px;
        }
        .affpress-btn {
            background: #2E2E3E;
            border: none;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            cursor: pointer;
        }
        .affpress-btn:hover {
            background: #8B5CF6;
        }
    `;
    document.head.appendChild(style);

    // Bloquear navegação de links
    document.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            // TODO: Abrir editor de link
        }
    }, true);

    // Hover Effect
    document.addEventListener('mouseover', (e) => {
        if (activeElement) return; // Se já tem algo selecionado, não muda

        const el = e.target;
        if (el === document.body || el === document.documentElement) return;

        // Ignorar toolbar
        if (el.closest('.affpress-toolbar')) return;

        el.classList.add('affpress-hover');
    });

    document.addEventListener('mouseout', (e) => {
        if (activeElement) return;
        const el = e.target;
        el.classList.remove('affpress-hover');
    });

    // Selection & Editing
    document.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const el = e.target;

        // Ignorar toolbar
        if (el.closest('.affpress-toolbar')) return;

        // Se clicar fora, deselecionar anterior
        if (activeElement && activeElement !== el) {
            activeElement.contentEditable = 'false';
            activeElement.classList.remove('affpress-selected');
            activeElement = null;
            notifyChange();
        }

        // Selecionar novo
        if (el.innerText && el.tagName !== 'IMG' && el.tagName !== 'BODY') {
            activeElement = el;
            el.contentEditable = 'true';
            el.classList.remove('affpress-hover');
            el.classList.add('affpress-selected');
            el.focus();
        } else if (el.tagName === 'IMG') {
            const newSrc = prompt('Nova URL da imagem:', el.src);
            if (newSrc) {
                el.src = newSrc;
                notifyChange();
            }
        }
    });

    // Detectar mudanças no texto
    document.addEventListener('input', (e) => {
        if (activeElement) {
            // Debounce poderia ser adicionado aqui
        }
    });

    // Salvar ao perder foco ou pressionar algo específico?
    // Melhor enviar o HTML completo periodicamente ou no blur

    function notifyChange() {
        // Remover classes de edição antes de enviar
        const cleanHtml = document.documentElement.outerHTML;
        // Enviar para o pai
        window.parent.postMessage({ type: 'AFFPRESS_UPDATE', html: cleanHtml }, '*');
    }

    // Observer para mudanças no DOM (mais robusto que input)
    const observer = new MutationObserver(() => {
        // notifyChange(); // Cuidado com loop infinito e performance
    });

    observer.observe(document.body, { subtree: true, childList: true, characterData: true });

})();
