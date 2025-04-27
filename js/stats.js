import { welcomeUser, handleAllTasks, appDiv } from "./tasks.js";

welcomeUser();
handleStats();

async function handleStats() {
    const allTasks = await handleAllTasks();
    
    const totalContainer = document.createElement("div");
    totalContainer.innerText = "Nombre total de tâches : " + allTasks.length;
    appDiv.appendChild(totalContainer);

    let toDo = 0;
    let done = 0;

    allTasks.forEach( task => {
        task.is_complete === true ? done++ : toDo++;
    })

    const statusContainer = document.createElement("div");
    const toDoContainer = document.createElement("p");
    toDoContainer.innerText = "En cours : " + toDo;
    const doneContainer = document.createElement("p");
    doneContainer.innerText = "Terminées : " + done;

    statusContainer.append(toDoContainer, doneContainer);
    appDiv.appendChild(statusContainer);
}