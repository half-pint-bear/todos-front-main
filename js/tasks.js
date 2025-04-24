init();

/**
 * Manage data from promise
 * @param null
 */
async function init() {
    const taskRenderer = new TaskRenderer("app");
    taskRenderer.welcomeUser();
    let allTasks = await taskRenderer.handleAllTasks();
    taskRenderer.renderTasks(allTasks);
}