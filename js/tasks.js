//Init
welcomeUser();

handleData();



/**
 * Add user name in fixed navbar
 * @param null
 */
function welcomeUser() {
    const container = document.getElementsByClassName('container');
    const userGreetings = document.createElement("h6");
    
    userGreetings.innerText = "Bonjour et bienvenue " + localStorage.getItem("username");
    userGreetings.style.color = "#FFF";
    container[0].appendChild(userGreetings);
}

/**
 * Fetch list items
 * @param null
 * @return JSON array if successful
 */
async function fetchAll() {
    let res = await fetch('http://127.0.0.1:3000/todos', {
        headers: {
            'Accept': 'applicaiton/json',
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
 * Manage data from promise
 * @param null
 */
async function handleData() {
    let allTasks = await fetchAll().then( data => {return data});
    //console.log(allTasks);
    const taskRenderer = new TaskRenderer("app");
    taskRenderer.renderTasks(allTasks);
}

