import { welcomeUser, handleAllTasks, appDiv } from "./tasks.js";

welcomeUser();
handleStats();

/**
 * Main function of stat page
 */
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
    statusContainer.style.marginBottom = "30px";

    const toDoContainer = loadStatusLine("En cours : " + toDo, "orange");
    const doneContainer = loadStatusLine("Terminées : " + done, "green");

    statusContainer.append(toDoContainer, doneContainer);
    appDiv.appendChild(statusContainer);

    loadDoughnutChart(toDo, done);
}

/**
 * Load stats text
 * @param {*} text 
 * @param {*} color 
 * @returns {HTMLElement}
 */
function loadStatusLine(text, color) {
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

    const label = document.createElement("p");
    label.innerText = text;
    label.style.margin = "0";

    line.appendChild(circle);
    line.appendChild(label);

    return line;
}

/**
 * Load doughnut chart
 * @param {int} toDo 
 * @param {int} done 
 */
function loadDoughnutChart(toDo, done) {
    const total = toDo + done;
    const donePercent = (done / total) * 100;
    const toDoPercent = 100 - donePercent;

    const container = document.createElement("div");
    container.style.position = "relative";
    container.style.width = "200px";
    container.style.height = "200px";
    container.style.margin = "0 auto";

    const circle = document.createElement("div");
    circle.style.width = "100%";
    circle.style.height = "100%";
    circle.style.borderRadius = "50%";
    circle.style.background = "conic-gradient(orange 0% 0%, green 0% 0%)";
    circle.style.transition = "background 1s ease-out";

    const innerCircle = document.createElement("div");
    innerCircle.style.position = "absolute";
    innerCircle.style.top = "25%";
    innerCircle.style.left = "25%";
    innerCircle.style.width = "50%";
    innerCircle.style.height = "50%";
    innerCircle.style.backgroundColor = "white";
    innerCircle.style.borderRadius = "50%";

    container.appendChild(circle);
    container.appendChild(innerCircle);
    appDiv.appendChild(container);

    // Prepare animation
    let currentDone = 0;
    let currentToDo = 0;
    const duration = 2; 
    const steps = 30;
    const intervalTime = duration / steps;
    const doneStep = donePercent / steps;
    const toDoStep = toDoPercent / steps;
    
    const interval = setInterval(() => {
        currentDone += doneStep;
        currentToDo += toDoStep;

        if (currentDone >= donePercent) {
            currentDone = donePercent;
            currentToDo = toDoPercent;
            clearInterval(interval);
        }

        circle.style.background = `conic-gradient(
            green 0% ${currentDone}%,
            orange ${currentDone}% 100%
        )`;
    }, intervalTime);

    // Add legend
    const legend = document.createElement("div");
    legend.style.display = "flex";
    legend.style.justifyContent = "center";
    legend.style.gap = "20px";
    legend.style.marginTop = "20px";

    const legendDone = createLegendItem("Terminées", "green");
    const legendToDo = createLegendItem("En cours", "orange");

    legend.appendChild(legendDone);
    legend.appendChild(legendToDo);
    appDiv.appendChild(legend);
}

/**
 * Create legend body & styles
 * @param {int} text 
 * @param {string} color 
 * @returns 
 */
function createLegendItem(text, color) {
    const item = document.createElement("div");
    item.style.display = "flex";
    item.style.alignItems = "center";
    item.style.gap = "8px";

    const colorBox = document.createElement("span");
    colorBox.style.display = "inline-block";
    colorBox.style.width = "12px";
    colorBox.style.height = "12px";
    colorBox.style.backgroundColor = color;
    colorBox.style.borderRadius = "3px";

    const label = document.createElement("span");
    label.innerText = text;
    label.style.fontSize = "0.9rem";

    item.appendChild(colorBox);
    item.appendChild(label);

    return item;
}