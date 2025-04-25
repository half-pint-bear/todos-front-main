//Global vars
const rootUrl = 'http://localhost:3000/todos';
const appDiv = document.getElementById("app");
const containerDiv = document.getElementsByClassName("container");

init();

/**
 * Load page
 * @param null
 * @returns void
 */
async function init() {
    let allTasks = await handleAllTasks();
    renderTasks(allTasks);
}

/** 
* API call
* @param null
* @returns {JSON}
*/
async function fetchAll() {
   let res = await fetch(rootUrl, {
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
 * @param null
 * @returns {JSON}
 */
async function handleAllTasks() {
   return fetchAll().then(data => {return data});
}

/**
 * Display element in DOM
 * @param Array tasks
 * @returns void
 */
function renderTasks(tasks) {
   appDiv.innerHTML = '';

   //Check if tasklist is empty
   if(!Array.isArray(tasks) || tasks.length === 0) {
       appDiv.innerHTML = '<p>Aucune tâche à afficher.</p>';
       return;
   }

   if(Array.isArray(tasks)) {
       tasks.forEach( task => {
           const tile = this.loadTile(task);
           appDiv.appendChild(tile);
       });
   } 

   bindShowMoreBtnEvent();
   loadAddTaskBtn();
}


/**
 * Prepare HTML task elements
 * @param Array task 
 * @returns {HTMLDivElement}
 */
function loadTile(task) {
   const tile = document.createElement('div');
   tile.className = 'task-tile col-lg-3';
   tile.setAttribute('task-id', task.id);

   //data-id={$task.id} in button as routing anticipation
   tile.innerHTML = `
       <h3>Tâche #${task.id}</h3>
       <p>${escapeHTML(task.text)}</p>
       <p><strong>Statut :</strong> ${task.is_complete ? 'Terminée' : 'À faire'}</p>
       <button class="btn btn-primary" data-id=${task.id}>Voir plus</button>
   `;

   return tile;
}

/**
 * Item ID page redirection
 * @param null
 * @returns 
 */
function bindShowMoreBtnEvent() {
    const showMoreButtons = document.querySelectorAll('.btn-primary');

    showMoreButtons.forEach( function(btn) {
        btn.addEventListener('click', () => {
            //JS inner Object element.dataset : access to all HTML "data-" attributes (l.38 => button data-id)
            const taskId = btn.dataset.id;
            if(taskId)  {
                //Pass taskID through to url
                window.location.href= `./item.html?id=${taskId}`;
            }
        })
    })
}

function loadAddTaskBtn() {
    const addTaskBtn = document.createElement("button");
    addTaskBtn.innerText = "Ajouter une tâche";
    addTaskBtn.className = "btn btn-primary";
    
    containerDiv[2].insertBefore(addTaskBtn, appDiv);

    addTaskBtn.addEventListener('click', () => {
        const form = loadTaskForm();
        const modal = loadModal(form);
        document.body.appendChild(modal);
    })
}

function loadModal(element) {
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
            <div class="modal-footer"><span></span></div>
        </div>
    `;

    modal.querySelector('.modal-body').appendChild(element);

    modal.querySelector('#close').addEventListener('click', () => {
        modal.style.display = "none";
    });

    return modal;
}

function loadTaskForm() {
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
    let taskCount = document.getElementsByClassName('task-tile').length;

    //Handling post
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        this.postTask(taskCount, inputName.value);
    })

    return form;
}

//Post JSON data through to API
async function postTask(taskCount, inputName) {
    const postDate = new Date();

    const data = {
        id: taskCount + 1,
        text: inputName,
        created_at: postDate,
        Tags: [
            "Test", 
            "Post"
        ],
        is_complete: false
    };
    console.log(data);

    try {
        const res = await fetch(rootUrl, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        } );

        if(!res.ok)
            throw new Error("Erreur connexion API");
        console.log("task creation success");

    } catch (error) {
        console.error(error);
    }

}

//Prevents HTML injections
function escapeHTML(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}