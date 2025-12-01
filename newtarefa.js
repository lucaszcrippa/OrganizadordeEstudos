// Arquivo: nova-tarefa.js

document.addEventListener('DOMContentLoaded', () => {
    const newTaskForm = document.getElementById('newTaskForm');

    newTaskForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // 1. Capturar os dados do formulário
        // NOTA: É CRUCIAL que o campo 'taskDescription' exista no seu HTML
        const title = document.getElementById('taskDescription').value;
        // Se 'taskMateria' no HTML for o 'Tipo' (ex: Estudo, Tarefa, Projeto)
        const type = document.getElementById('taskMateria').value; 
        const dueDate = document.getElementById('taskDueDate').value;
        const priority = document.getElementById('taskPriority').value;

        // 2. Criar o objeto Tarefa
        const newTask = {
            id: Date.now(), 
            title: title,       // Título (visível no card)
            type: type,         // Tipo (para colorir o card: estudo, tarefa, projeto)
            dueDate: dueDate,   // Prazo
            priority: priority, // Prioridade (se quiser usar depois)
            
            // >> AQUI ESTÁ A CHAVE: Define o status inicial como 'todo' <<
            status: 'todo'      
        };

        // 3. Carregar, Adicionar e Salvar no localStorage
        // Usando a CHAVE 'kanbanTasks' para sincronizar com o painel principal
        const tasks = JSON.parse(localStorage.getItem('kanbanTasks')) || [];
        tasks.push(newTask);
        localStorage.setItem('kanbanTasks', JSON.stringify(tasks));
        
        // 4. Redirecionar para o dashboard
        window.location.href = 'gestao.html';
    });
});