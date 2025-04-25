class TaskRenderer {

    constructor() {
        this.rootUrl = "http://127.0.0.1:3000/todos";
        this.appDiv = document.getElementById("app");
        this.containerDiv = document.getElementsByClassName("container");
        //this.welcomeUser();
        this.setAddTaskBtn();
    }

    //Display user name after login
    welcomeUser() {
        const userGreetings = document.createElement("h6");
        userGreetings.innerText = "Bonjour et bienvenue " + localStorage.getItem("username");
        userGreetings.style.color = "#FFF";

        this.containerDiv[0].appendChild(userGreetings);
    }
    
    /**
     * API call
     * @returns json
     */
    async fetchAll() {
        let res = await fetch(this.rootUrl, {
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

    setAddTaskBtn() {
        const addTaskBtn = document.createElement("button");
        addTaskBtn.innerText = "Ajouter une tâche";
        addTaskBtn.className = "btn btn-primary";
        
        this.containerDiv[2].insertBefore(addTaskBtn, this.appDiv);

        addTaskBtn.addEventListener('click', () => {
            const form = this.loadTaskForm();
            const modal = this.loadModal(form);
            document.body.appendChild(modal);
        })
    }

    loadModal(element) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';

        //Preparing modal HTML skeleton with naked body
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Ajouter une tâche</h2>
                    <span id="close" class="modal-close">&times;</span>
                </div>
                <div class="modal-body"></div>
            </div>
        `;

        modal.querySelector('.modal-body').appendChild(element);

        modal.querySelector('#close').addEventListener('click', () => {
            modal.style.display = "none";
        });

        return modal;
    }

    loadTaskForm() {
        //Form elements creation
        const form = document.createElement("form");
        form.id = "task-form";

        const labelName = document.createElement("label");
        labelName.setAttribute("for", "taskname");
        labelName.textContent = "Intitulé";

        const inputName = document.createElement("input");
        inputName.type = "text";
        inputName.name = "taskname";
        inputName.required = true;

        const submitBtn = document.createElement("button");
        submitBtn.type = "submit";
        submitBtn.className = "btn btn-success";
        submitBtn.textContent = "Ajouter";

        //Compiling form
        form.append(labelName, inputName, submitBtn);

        //Preparing auto post vars
        let taskCount = this.handleAllTasks().length;

        //Handling post
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            this.postTask(taskCount, inputName.value);
        })

        return form;
    }

    //Post JSON data through to API
    async postTask(taskCount, inputName) {
        const postDate = new Date();

        const data = {
            id: Number(taskCount) + 1,
            text: inputName,
            created_at: postDate,
            Tags: [
                "Test", 
                "Post"
            ],
            is_complete: false
        };

        try {
            const res = await fetch(this.rootUrl, {
                method: "POST",
                headers: {"Content-Type": "applicaiton/json"},
                body: JSON.stringify(data)
            } );

            if(!res.ok)
                throw new Error("Erreur connexion API");
            console.log("task creation success");

        } catch (error) {
            console.error(error);
        }

        return res;
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