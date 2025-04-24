class TaskRenderer {

    constructor(containerId) {
        this.container = document.getElementById(containerId);

        if(!this.container)
            throw new Error('Aucun élément correspondant à ${containerId}');
    }

    //Display user name after login
    welcomeUser() {
        const container = document.getElementsByClassName('container');
        const userGreetings = document.createElement("h6");
        
        userGreetings.innerText = "Bonjour et bienvenue " + localStorage.getItem("username");
        userGreetings.style.color = "#FFF";
        container[0].appendChild(userGreetings);
    }

    async fetchAll() {
        let res = await fetch('http://127.0.0.1:3000/todos', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'GET'
        });
    
        if(res.ok) {
            let json = await res.json();
            return json[0]["todolist"];
        }
    }

    async handleAllTasks() {
        return this.fetchAll().then(data => {return data});
    }

    //Display element in DOM
    renderTasks(tasks) {
        this.container.innerHTML = '';

        //Check if tasklist is empty
        if(!tasks || (!Array.isArray(tasks) && tasks.length === 0)) {
            this.container.innerHTML = '<p>Aucune tâche à afficher.</p>';
            return;
        }

        //Check type of tasks in order to know if > 1
        if(Array.isArray(tasks)) {
            tasks.forEach( task => {
                const tile = this.loadTile(task);
                this.container.appendChild(tile);
            });
        } else if(typeof tasks === 'object') {
            const singleTask = this.loadSingleTask(tasks);
            this.container.appendChild(singleTask);
        }

        this.bindShowMoreBtnEvent();
    }

    //DOM Manipulation
    loadTile(task) {
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

    loadSingleTask(task) {
        const tile = document.createElement('div');
        tile.className = 'task-tile col-lg-6';
        tile.setAttribute('task-id', task.id);

        tile.innerHTML = `
            <h3>Tâche #${task.id}</h3>
            <p>${this.escapeHTML(task.text)}</p>
            <p><strong>Statut :</strong> ${task.is_complete ? 'Terminée' : 'À faire'}</p>
            <h1 class="btn btn-primary">Pas de bouton, t'as vu frérot ?</h1>
        `;

        return tile;
    }
    
    //Item ID page redirection
    bindShowMoreBtnEvent() {
        const showMoreButtons = document.querySelectorAll('.btn-primary');

        showMoreButtons.forEach( function(btn) {
            btn.addEventListener('click', () => {
                //JS inner Object element.dataset : access to all HTML "data-" attributes (l.38 => button data-id)
                const taskId = btn.dataset.id;
                if(taskId) {
                    //Pass taskID through to url
                    window.location.href= `./item.html?id=${taskId}`;
                }
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