const taskId = new URLSearchParams(window.location.search).get('id');
const appDiv = document.getElementById('app');
handleSingleTask(taskId);

/**
 *
 * @param taskId int
 * @returns {Promise<any>}
 */

async function fetchBytaskId(taskId) {
    let res = await fetch(`http://127.0.0.1:3000/todos/${taskId}`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'GET'
    });

    if(res.ok) {
        let json = await res.json();
        console.log(json);
        return json;
    }
}

/**
 * Manage data from promise
 * @param null
 */
async function handleSingleTask(taskId) {
    let task = await fetchBytaskId(taskId).then( data => {return data});
    //console.log(task);
    renderTask(task);
}


/**
 * Render task element in DOM
 * @param task
 * @returns void
 */
function renderTask(task) {
    appDiv.innerHTML = '';

    //Alert if task is empty
    if(!task) {
        appDiv.innerHTML = '<p>Aucune tâche à afficher.</p>';
        return;
    }

    const singleTask = loadSingleTask(task);
    appDiv.appendChild(singleTask);
}

/**
 *
 * @param task JSON Object
 * @returns {HTMLDivElement}
 */
function loadSingleTask(task) {
    const tile = document.createElement('div');
    tile.className = 'task-tile col-lg-6';
    tile.setAttribute('task-id', task.id);

    // Status management
    const statusText = task.is_complete ? 'Terminée' : 'À faire';
    const buttonText = task.is_complete ? 'Marquer comme À faire' : 'Marquer comme Terminée';
    const buttonClass = task.is_complete ? 'btn btn-secondary' : 'btn btn-success';

    const header = document.createElement('div');
    header.className = 'd-flex justify-content-between align-items-center mb-2';

    const tagsContainer = document.createElement('div');
    tagsContainer.className = 'tags';
    if (task.Tags && task.Tags.length > 0) {
        task.Tags.forEach(tag => {
            const tagBadge = document.createElement('span');
            tagBadge.className = 'badge bg-primary me-1';
            tagBadge.textContent = tag;
            tagsContainer.appendChild(tagBadge);
        });
    }

    const status = document.createElement('div');
    status.className = 'status fw-bold';
    status.textContent = statusText;

    header.appendChild(tagsContainer);
    header.appendChild(status);

    const title = document.createElement('h3');
    title.className = 'task-title mb-2';
    title.textContent = task.text;

    const date = document.createElement('div');
    date.className = 'task-date text-muted mb-4';
    const createdDate = new Date(task.created_at);
    date.textContent = `Créée le : ${createdDate.toLocaleDateString()}`;

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'd-flex justify-content-end';

    const toggleButton = document.createElement('button');
    toggleButton.className = buttonClass;
    toggleButton.textContent = buttonText;
    toggleButton.addEventListener('click', () => toggleTaskStatus(task.id));

    buttonContainer.appendChild(toggleButton);

    //Build
    tile.appendChild(header);
    tile.appendChild(title);
    tile.appendChild(date);
    tile.appendChild(buttonContainer);

    return tile;
}

function toggleTaskStatus(taskId) {
    const taskTile = document.querySelector(`[task-id="${taskId}"]`);
    
    if (!taskTile) {
        console.error('Tâche introuvable!');
        return;
    }

    const statusElement = taskTile.querySelector('.status');
    const buttonElement = taskTile.querySelector('button');

    const isComplete = statusElement.textContent === 'Terminée';

    const transitionDuration = 300;

    const newStatus = isComplete ? 'À faire' : 'Terminée';
    const newButtonText = isComplete ? 'Marquer comme Terminée' : 'Marquer comme À faire';
    const newColor = isComplete ? '#6c757d' : '#28a745'; //button color
    const newStatusColor = isComplete ? '#dc3545' : '#28a745'; //status color

    buttonElement.style.transition = `background-color ${transitionDuration}ms, color ${transitionDuration}ms`;
    statusElement.style.transition = `color ${transitionDuration}ms, font-size ${transitionDuration}ms`;

    statusElement.textContent = newStatus;
    buttonElement.textContent = newButtonText;
    buttonElement.style.backgroundColor = newColor;
    buttonElement.style.color = 'white';
    statusElement.style.color = newStatusColor;
    statusElement.style.fontSize = '1.2em';

    updateTaskStatusInAPI(taskId, newStatus);
}

/**
 * Update status
 * @param {int} taskId 
 * @param {string} newStatus 
 */
function updateTaskStatusInAPI(taskId, newStatus) {

    const data = {
        is_complete: newStatus.toLowerCase() === 'terminée'
    };

    fetch(`http://127.0.0.1:3000/todos/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            console.log(`Statut de la tâche ${taskId} mis à jour avec succès`);
        } else {
            console.error(`Erreur lors de la mise à jour du statut de la tâche ${taskId}`);
            response.text().then(errText => console.error('Erreur API:', errText));
        }
    })
    .catch(error => {
        console.error(`Erreur de connexion à l'API: ${error}`);
    });
}