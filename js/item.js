const taskId = new URLSearchParams(window.location.search).get('id');

handleSingleTask(taskId);
/**
 * Fetch list items
 * @param null
 * @return JSON array if successful
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
    const taskRenderer = new TaskRenderer("app");
    taskRenderer.renderTasks(task);
}