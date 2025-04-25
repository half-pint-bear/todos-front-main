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
            'Accept': 'applicaiton/json',
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
 *
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

    tile.innerHTML = `
            <h3>Tâche #${task.id}</h3>
            <p>${task.text}</p>
            <p><strong>Statut :</strong> ${task.is_complete ? 'Terminée' : 'À faire'}</p>
            <h1 class="btn btn-warning">MODIFIER STATUT ICI</h1>
        `;

    return tile;
}
