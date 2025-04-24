class TaskRenderer {

    constructor() {
        this.appDiv = document.getElementById("app");
        this.containerDiv = document.getElementsByClassName("container");
        this.welcomeUser();
        this.setAddTaskBtn();
    }

    //Display user name after login
    welcomeUser() {
        const userGreetings = document.createElement("h6");
        userGreetings.innerText = "Bonjour et bienvenue " + localStorage.getItem("username");
        userGreetings.style.color = "#FFF";

        this.containerDiv[0].appendChild(userGreetings);
    }

    setAddTaskBtn() {
        const addTaskBtn = document.createElement("button");
        addTaskBtn.innerText = "Ajouter une tâche";
        addTaskBtn.className = "btn btn-primary";
        
        const taskForm = this.loadTaskFormModal();
        addTaskBtn.addEventListener('click', () => {
            taskForm.style.display = 'block';
        })
        this.containerDiv[2].insertBefore(addTaskBtn, this.appDiv);
    }
    
    /**
     * API call
     * @returns json
     */
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

    /**
     * Resolving promise
     * @returns json
     */
    async handleAllTasks() {
        return this.fetchAll().then(data => {return data});
    }

    //Display element in DOM
    renderTasks(tasks) {
        this.appDiv.innerHTML = '';

        //Check if tasklist is empty
        if(!tasks || (!Array.isArray(tasks) && tasks.length === 0)) {
            this.appDiv.innerHTML = '<p>Aucune tâche à afficher.</p>';
            return;
        }

        //Check type of tasks in order to know if > 1
        /**
         * TODO
         * Remove singleTask controls and methods
         * This will be separately managed in future item object
         */
        if(Array.isArray(tasks)) {
            tasks.forEach( task => {
                const tile = this.loadTile(task);
                this.appDiv.appendChild(tile);
            });
        } else if(typeof tasks === 'object') {
            const singleTask = this.loadSingleTask(tasks);
            this.appDiv.appendChild(singleTask);
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

    loadTaskFormModal() {
        const taskForm = document.createElement("div");
        taskForm.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                <span class="close">&times;</span>
                <h2>Modal Header</h2>
                </div>
                <div class="modal-body">
                <p>Some text in the Modal Body</p>
                <p>Some other text...</p>
                </div>
                <div class="modal-footer">
                <h3>Modal Footer</h3>
                </div>
            </div>
        `;
        taskForm.style.display = "none";
        this.containerDiv[2].insertBefore(taskForm, this.appDiv);

        return taskForm;
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