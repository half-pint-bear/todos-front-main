class TaskRenderer {

    constructor(containerId) {
        this.container = document.getElementById(containerId);

        if(!this.container)
            throw new Error('Aucun élément correspondant à ${containerId}');
    }

    //Display element in DOM
    renderTasks(tasks) {
        this.container.innerHTML = '';

        //Check if tasklist is empty
        if(!Array.isArray(tasks) || tasks.length === 0) {
            this.container.innerHTML = '<p>Aucune tâche à afficher.</p>';
            return;
        }

        tasks.forEach( task => {
            const tile = this.createTile(task);
            this.container.appendChild(tile);
        });

        this.bindEvents();
    }

    //DOM Manipulation
    createTile(task) {
        const tile = document.createElement('div');
        tile.className = 'task-tile col-lg-3';
        tile.setAttribute('task-id', task.id);

        tile.innerHTML = `
            <h3>Tâche #${task.id}</h3>
            <p>${this.escapeHTML(task.text)}</p>
            <p><strong>Statut :</strong> ${task.is_complete ? 'Terminée' : 'À faire'}</p>
            <button class="btn btn-primary" data-id=${task.id}>Voir plus</button>
        `;

        return tile;
    }

    bindEvents() {
        const showMoreButtons = document.querySelectorAll('.btn-primary');

        showMoreButtons.forEach( function(btn) {
            btn.addEventListener('click', () => {
                const taskId = btn.dataset.id;
                if(taskId)
                    window.location.href= `./item.html?id=${taskId}`;
            })
        })
    }

    //Prevents HTML injections
    escapeHTML(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
}