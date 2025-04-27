import { welcomeUser, handleAllTasks, appDiv } from "./tasks.js";

welcomeUser();
handleStats();

async function handleStats() {
    const allTasks = await handleAllTasks();
    
    const totalContainer = document.createElement("div");
    totalContainer.innerText = "Nombre total de tâches : " + allTasks.length;
    totalContainer.style.fontWeight = "bold";
    totalContainer.style.marginBottom = "20px";
    totalContainer.style.fontSize = "1.2rem";
    appDiv.appendChild(totalContainer);

    let toDo = 0;
    let done = 0;

    allTasks.forEach(task => {
        task.is_complete === true ? done++ : toDo++;
    });

    const statusContainer = document.createElement("div");
    statusContainer.style.display = "flex";
    statusContainer.style.flexDirection = "column";
    statusContainer.style.gap = "10px";

    const toDoContainer = createStatusLine("En cours : " + toDo, "orange");
    const doneContainer = createStatusLine("Terminées : " + done, "green");

    statusContainer.append(toDoContainer, doneContainer);
    appDiv.appendChild(statusContainer);
}

function createStatusLine(text, color) {
    const line = document.createElement("div");
    line.style.display = "flex";
    line.style.alignItems = "center";
    line.style.gap = "10px";
    line.style.fontSize = "1rem";

    const circle = document.createElement("span");
    circle.style.display = "inline-block";
    circle.style.width = "12px";
    circle.style.height = "12px";
    circle.style.borderRadius = "50%";
    circle.style.backgroundColor = color;
    circle.style.animation = "pulse 2s infinite";

    const label = document.createElement("p");
    label.innerText = text;
    label.style.margin = "0";

    line.appendChild(circle);
    line.appendChild(label);

    return line;
}

// Ajout dynamique de l'animation CSS dans la page
const style = document.createElement("style");
style.innerHTML = `
@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.3); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
}
`;
document.head.appendChild(style);