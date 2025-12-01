document.addEventListener('DOMContentLoaded', () => {
    let tasks = []; // Inicializa o array de tarefas

    const columns = ['todo', 'in-progress', 'done'];

    // 1. FUNÇÃO DE CARREGAMENTO E INICIALIZAÇÃO DE DADOS
    const loadTasks = () => {
        const storedTasks = localStorage.getItem('kanbanTasks');
        if (storedTasks) {
            tasks = JSON.parse(storedTasks);
        } else {
            // Dados simulados se não houver nada no localStorage (apenas para a primeira vez)
            tasks = [
                { id: 1, title: "Revisar Módulo 1: HTML/CSS", type: "estudo", dueDate: "2025-11-30", status: "in-progress" },
                { id: 2, title: "Projeto: Layout Kanban", type: "projeto", dueDate: "2025-12-05", status: "in-progress" },
                { id: 3, title: "Pagar Boleto da Faculdade", type: "tarefa", dueDate: "2025-11-28", status: "todo" },
                { id: 4, title: "Ler Artigo sobre JavaScript Assíncrono", type: "estudo", dueDate: "2025-12-10", status: "todo" },
                { id: 5, title: "Completar Desafio de Lógica", type: "projeto", dueDate: "2025-11-20", status: "done" },
            ];
            // Salva os dados simulados para a próxima visita
            localStorage.setItem('kanbanTasks', JSON.stringify(tasks));
        }
    };

    // 2. FUNÇÃO AUXILIAR: CRIA O CARTÃO HTML (AGORA COM BOTÃO DE EXCLUSÃO)
    const createCard = (task) => {
        const card = document.createElement('div');
        card.classList.add('kanban-card', `card-tipo-${task.type}`);
        card.setAttribute('draggable', true);
        card.dataset.taskId = task.id;

        const date = new Date(task.dueDate);
        const formattedDate = date.toLocaleDateString('pt-BR');

        card.innerHTML = `
            <div class="card-title">${task.title}</div>
            <div class="card-meta">
                <span>Tipo: <strong>${task.type.charAt(0).toUpperCase() + task.type.slice(1)}</strong></span>
                <span>Prazo: ${formattedDate}</span>
            </div>
            <button class="btn-delete" data-task-id="${task.id}">🗑️</button>
        `;

        // Eventos de Drag
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragend', handleDragEnd);

        // Evento de Exclusão (adicionado diretamente ao botão)
        const deleteButton = card.querySelector('.btn-delete');
        deleteButton.addEventListener('click', () => {
            if (confirm(`Tem certeza que deseja excluir a tarefa: "${task.title}"?`)) {
                deleteTask(task.id);
            }
        });

        return card;
    };

    // 3. FUNÇÃO: RENDERIZA TODAS AS TAREFAS NAS COLUNAS CORRETAS
    const renderTasks = () => {
        loadTasks(); // Carrega os dados mais recentes antes de renderizar

        // Limpa as listas
        columns.forEach(status => {
            const list = document.getElementById(`list-${status}`);
            if (list) list.innerHTML = '';
        });

        // Preenche as listas e atualiza a contagem
        columns.forEach(status => {
            const statusTasks = tasks.filter(t => t.status === status);
            const list = document.getElementById(`list-${status}`);
            const countElement = document.getElementById(`count-${status}`);

            statusTasks.forEach(task => {
                if (list) list.appendChild(createCard(task));
            });

            if (countElement) {
                countElement.textContent = statusTasks.length;
            }
        });
        
        // Exibe mensagem de lista vazia se necessário
        columns.forEach(status => {
            const list = document.getElementById(`list-${status}`);
            if (list && list.children.length === 0) {
                list.innerHTML = '<p class="empty-list-msg">Nenhuma tarefa aqui!</p>';
            }
        });

        // Atualiza a contagem de Pendentes no header
        const pendingCount = tasks.filter(t => t.status !== 'done').length;
        const pendingTasksCountElement = document.getElementById('pendingTasksCount');
        if(pendingTasksCountElement) {
            pendingTasksCountElement.textContent = pendingCount;
        }
    };

    // 4. FUNÇÃO DE EXCLUSÃO (NOVA)
    function deleteTask(taskId) {
        // Filtra o array, mantendo apenas as tarefas cujo ID não corresponde ao ID a ser excluído
        tasks = tasks.filter(t => t.id !== taskId);
        
        // Salva o novo array no localStorage
        localStorage.setItem('kanbanTasks', JSON.stringify(tasks));
        
        // Re-renderiza o quadro para remover o cartão
        renderTasks();
    }


    // --- 5. FUNÇÕES DE DRAG AND DROP (MANTIDAS) ---

    let draggedItem = null;

    function handleDragStart(e) {
        draggedItem = this;
        setTimeout(() => this.classList.add('dragging'), 0); 
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', this.dataset.taskId); 
    }

    function handleDragEnd() {
        this.classList.remove('dragging');
        draggedItem = null;
    }

    function handleDragOver(e) {
        e.preventDefault(); 
    }

    function handleDrop(e) {
        e.preventDefault();
        const taskId = parseInt(e.dataTransfer.getData('text/plain'));
        const targetList = this.closest('.task-list'); 

        if (targetList) {
            const newStatus = targetList.parentElement.dataset.status;
            
            // 1. Atualiza o status no array de dados
            const taskIndex = tasks.findIndex(t => t.id === taskId);
            if (taskIndex > -1 && tasks[taskIndex].status !== newStatus) {
                tasks[taskIndex].status = newStatus;
                
                // 2. Salva as mudanças no localStorage
                localStorage.setItem('kanbanTasks', JSON.stringify(tasks));
                
                // 3. Re-renderiza
                renderTasks();
            }
        }
    }

    // 6. Adiciona os Event Listeners para as colunas
    const taskLists = document.querySelectorAll('.task-list');
    taskLists.forEach(list => {
        list.addEventListener('dragover', handleDragOver);
        list.addEventListener('drop', handleDrop);
    });

    // 7. INÍCIO: Renderiza as tarefas ao carregar a página
    renderTasks();
});