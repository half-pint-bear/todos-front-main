//Global vars
const rootUrl = 'http://localhost:3000/todos';
export const appDiv = document.getElementById("app");
const containerDiv = document.getElementsByClassName("container");

if(window.location.pathname.includes('tasks.html'))
    init();

/**
 * Launch
 * @returns {Promise<void>}
 */
async function init() {
    let allTasks = await handleAllTasks();
    renderTasks(allTasks);
    welcomeUser();
    loadAddTaskBtn();
}

export function welcomeUser() {
    const userGreetings = document.createElement("h6");
    userGreetings.innerText = "Bonjour et bienvenue " + localStorage.getItem("username");
    userGreetings.style.color = "#FFF";

    containerDiv[1].appendChild(userGreetings);
}
/**
 * Call API root endpoint
 * @returns {Promise<*>}
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
 * Handle promise data
 * @returns {Promise<*>}
 */
export async function handleAllTasks() {
   return fetchAll().then(data => {return data});
}

/**
 * Build HTML and assign events
 * @param tasks Array
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
           const tile = loadTile(task);
           appDiv.appendChild(tile);
       });
   }

   bindShowMoreBtnEvent();
}


/**
 * Prepare HTML task elements
 * @param task Array
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
 * Add button to task-tile elements
 * Assign task.id to each button
 * Relocates on tasks/{id} endpoint
 * @returns void
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

/**
 * Add button element in DOM for task put method anticipation
 * @returns void
 */
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

/**
 * Create modal body
 * @param element  = form to be inserted
 * @returns {HTMLDivElement}
 */
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

/**
 * Create & stylize form
 * @returns {HTMLFormElement}
 */
function loadTaskForm() {
    const form = document.createElement("form");
    form.id = "task-form";
    form.classList.add("task-form");

    //Task name 
    const nameGroup = document.createElement("div");
    nameGroup.classList.add("form-group");

    const nameLabel = document.createElement("label");
    nameLabel.setAttribute("for", "taskname");
    nameLabel.textContent = "Libellé court :";
    nameLabel.classList.add("form-label");

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.name = "taskname";
    nameInput.required = true;
    nameInput.classList.add("form-input");

    nameGroup.append(nameLabel, nameInput);
    form.appendChild(nameGroup);

    // Tag container
    const tagContainer = document.createElement("div");
    tagContainer.id = "tag-container";
    form.appendChild(tagContainer);

    //Create tag input
    let tagCount = 1;
    const createTagField = (index, required = false) => {
        const tagGroup = document.createElement("div");
        tagGroup.classList.add("form-group");

        const tagLabel = document.createElement("label");
        tagLabel.setAttribute("for", `tag${index}`);
        tagLabel.textContent = `Tag ${index} ${index === 1 ? "(obligatoire)" : ""}`;
        tagLabel.classList.add("form-label");

        const tagInput = document.createElement("input");
        tagInput.type = "text";
        tagInput.name = `tag${index}`;
        tagInput.required = required;
        tagInput.classList.add("form-input");

        tagGroup.append(tagLabel, tagInput);
        return tagGroup;
    };

    tagContainer.appendChild(createTagField(tagCount, true));

    //Add tag button
    const addTagBtn = document.createElement("button");
    addTagBtn.type = "button";
    addTagBtn.className = "btn btn-secondary";
    addTagBtn.textContent = "Ajouter un tag";

    addTagBtn.addEventListener("click", () => {
        tagCount++;
        tagContainer.appendChild(createTagField(tagCount));
    });

    form.appendChild(addTagBtn);

    //Submit button
    const submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.className = "btn btn-success";
    submitBtn.textContent = "Ajouter";
    form.appendChild(submitBtn);

    //Form submit
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const taskCount = document.getElementsByClassName("task-tile").length;
        const taskName = nameInput.value.trim();
        const tags = [];

        for (let i = 1; i <= tagCount; i++) {
            const tagInput = form.querySelector(`[name="tag${i}"]`);
            if (tagInput && tagInput.value.trim() !== "") {
                tags.push(tagInput.value.trim());
            }
        }

        //Reload
        await postTask(taskCount, taskName, tags);
        document.querySelector(".modal").remove();
        renderTasks(await handleAllTasks());
    });

    return form;
}

/**
 * Post JSON data through to API
 * @param taskCount
 * @param inputName
 * @returns {Promise<void>}
 */
async function postTask(taskCount, inputName, tags) {
    const postDate = new Date();

    const data = {
        id: taskCount + 1,
        text: inputName,
        created_at: postDate,
        Tags: tags,
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

/**
 * Prevents HTML injections
 * @param str
 * @returns {string}
 */
function escapeHTML(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
