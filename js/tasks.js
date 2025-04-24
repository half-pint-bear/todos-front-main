init();

/**
 * Manage data from promise
 * @param null
 */
async function init() {
    const taskRenderer = new TaskRenderer();
    let allTasks = await taskRenderer.handleAllTasks();
    taskRenderer.renderTasks(allTasks);
}