import { welcomeUser, rootUrl} from "./tasks.js";

welcomeUser();

const taskId = new URLSearchParams(window.location.search).get('id');
const appDiv = document.getElementById('app');
handleSingleTask(taskId);

/**
 *
 * @param taskId int
 * @returns {Promise<any>}
 */

async function fetchBytaskId(taskId) {
    try {
        const res = await fetch(rootUrl + `/${taskId}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'GET'
        });

        if (!res.ok) {
            const errorMsg = `Erreur ${res.status} : ${res.statusText}`;
            console.error(errorMsg);
            alert("Impossible de récupérer la tâche demandée. Veuillez réessayer plus tard.");
            return null;
        }
        
        let json = await res.json();
        console.log(json);
        return json;
        
    } catch (error) {
        console.error('Erreur lors de la récupération de la tâche :', error);
        return null;
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
 * Build full task
 * @param {JSON} task
 * @returns {HTMLDivElement}
 */
function loadSingleTask(task) {
    const tile = document.createElement('div');
    tile.className = 'task-tile col-lg-6';
    tile.setAttribute('task-id', task.id);

    const header = createHeader(task);
    const title = createTitle(task);
    const date = createDate(task);
    const footer = createFooter(task);

    tile.appendChild(header);
    tile.appendChild(title);
    tile.appendChild(date);
    tile.appendChild(footer);

    return tile;
}

/**
 * Build taskHeader
 * @param {JSON} task 
 * @returns 
 */
function createHeader(task) {
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

    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-danger';

    const trashIcon = document.createElement('i');
    trashIcon.className = 'fa-solid fa-trash-can';
    deleteButton.appendChild(trashIcon);

    deleteButton.addEventListener('click', () => {
        loadValidationModal(task.id);
    });

    header.appendChild(tagsContainer);
    header.appendChild(deleteButton);

    return header;
}

/**
 * Build task Title
 * @param {JSON} task 
 * @returns 
 */
function createTitle(task) {
    const title = document.createElement('h3');
    title.className = 'task-title mb-2';
    title.textContent = task.text;
    return title;
}

/**
 * Build date element
 * @param {JSON} task 
 * @returns 
 */
function createDate(task) {
    const date = document.createElement('div');
    date.className = 'task-date text-muted mb-4';
    const createdDate = new Date(task.created_at);
    date.textContent = `Créée le : ${createdDate.toLocaleDateString()}`;
    return date;
}

/**
 * Build footer
 * @param {JSON} task 
 * @returns 
 */
function createFooter(task) {
    const footer = document.createElement('div');
    footer.style.display = 'flex';
    footer.style.justifyContent = 'space-between';

    const status = document.createElement('div');
    status.className = 'status fw-bold';
    status.textContent = task.is_complete ? 'Terminée' : 'À faire';

    const statusBtnContainer = document.createElement('div');
    statusBtnContainer.className = 'd-flex justify-content-end';

    const toggleButton = document.createElement('button');
    toggleButton.className = task.is_complete ? 'btn btn-secondary' : 'btn btn-success';
    toggleButton.classList.add('btn-toggle');
    toggleButton.textContent = task.is_complete ? 'Marquer comme À faire' : 'Marquer comme Terminée';

    toggleButton.addEventListener('click', () => toggleTaskStatus(task.id));

    statusBtnContainer.appendChild(toggleButton);

    footer.appendChild(statusBtnContainer);
    footer.appendChild(status);

    return footer;
}

/**
 * Apply styles on status button click
 * @param {int} taskId 
 * @returns 
 */
function toggleTaskStatus(taskId) {
    const taskTile = document.querySelector(`[task-id="${taskId}"]`);
    
    if (!taskTile) {
        console.error('Tâche introuvable!');
        return;
    }

    const statusElement = taskTile.querySelector('.status');
    const buttonElement = taskTile.querySelector('.btn-toggle');

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

    updateTaskStatus(taskId, newStatus);
}

/**
 * Update status
 * @param {int} taskId 
 * @param {string} newStatus 
 */
async function updateTaskStatus(taskId, newStatus) {
    const data = {
        is_complete: newStatus.toLowerCase() === 'terminée'
    };

    try {
        const response = await fetch(`${rootUrl}/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error(`Erreur API : ${errText}`);
            alert(`Impossible de mettre à jour le statut de la tâche ${taskId}`);
            return;
        }

        console.log(`Statut de la tâche ${taskId} mis à jour avec succès`);
    } catch (error) {
        console.error(`Erreur de connexion à l'API :`, error);
        alert("Erreur de communication avec le serveur.");
    }
}

/**
 * Delete task
 * @param {int} taskId 
 */
async function deleteTask(taskId) {
    try {
        const response = await fetch(`${rootUrl}/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error(`Erreur API : ${errText}`);
            alert(`Impossible de supprimer la tâche ${taskId}`);
            return;
        }

        console.log(`Tâche ${taskId} supprimée avec succès`);
        window.location.href = './tasks.html';
    } catch (error) {
        console.error(`Erreur de connexion à l'API :`, error);
        alert("Erreur de communication avec le serveur.");
    }
}

/**
 * Build full modal
 * @param {int} taskId 
 */
function loadValidationModal(taskId) {
    const modalOverlay = createModalOverlay();
    const modalBox = createModalBox();
    const message = createModalMessage();
    const buttons = createModalButtons(taskId, modalOverlay, modalBox);

    modalBox.appendChild(message);
    modalBox.appendChild(buttons);
    modalOverlay.appendChild(modalBox);
    document.body.appendChild(modalOverlay);

    // Animation
    setTimeout(() => {
        modalOverlay.style.opacity = 1;
        modalBox.style.transform = 'scale(1)';
    }, 10);
}

/**
 * Build modal overlay
 * @returns {HTMLDivElement}
 */
function createModalOverlay() {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '1000';
    overlay.style.opacity = 0;
    overlay.style.transition = 'opacity 0.3s ease';
    return overlay;
}

/**
 * Build modal body
 * @returns {HTMLDivElement}
 */
function createModalBox() {
    const box = document.createElement('div');
    box.style.backgroundColor = 'white';
    box.style.padding = '30px';
    box.style.borderRadius = '8px';
    box.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
    box.style.textAlign = 'center';
    box.style.width = '300px';
    box.style.transform = 'scale(0.8)';
    box.style.transition = 'transform 0.3s ease';
    return box;
}

/**
 * Build modal message
 * @returns {HTMLDivElement}
 */
function createModalMessage() {
    const message = document.createElement('p');
    message.textContent = 'Êtes-vous sûr de vouloir supprimer cette tâche ?';
    message.style.marginBottom = '20px';
    return message;
}

/**
 * Build modal buttons & assign events
 * @param {int} taskId 
 * @param {HTMLDivElement} modalOverlay 
 * @param {HTMLDivElement} modalBox 
 * @returns {HTMLDivElement}
 */
function createModalButtons(taskId, modalOverlay, modalBox) {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.justifyContent = 'space-around';

    const confirmButton = document.createElement('button');
    confirmButton.textContent = 'Confirmer';
    confirmButton.className = 'btn btn-danger';
    confirmButton.addEventListener('click', () => {
        deleteTask(taskId);
        closeModal(modalOverlay, modalBox);
    });

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Annuler';
    cancelButton.className = 'btn btn-secondary';
    cancelButton.addEventListener('click', () => {
        closeModal(modalOverlay, modalBox);
    });

    container.appendChild(confirmButton);
    container.appendChild(cancelButton);
    return container;
}

/**
 * Modal soft appear
 * @param {HTMLDivElement} modalOverlay 
 * @param {HTMLDivElement} modalBox 
 */
function closeModal(modalOverlay, modalBox) {
    modalOverlay.style.opacity = 0;
    modalBox.style.transform = 'scale(0.8)';
    setTimeout(() => {
        if (modalOverlay && modalOverlay.parentNode) {
            document.body.removeChild(modalOverlay);
        }
    }, 300);
}