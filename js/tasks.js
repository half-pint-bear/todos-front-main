const main = document.getElementById('app');

let userGreetings = document.createElement("h2");
userGreetings.innerText = "Bonjour et bienvenue " + localStorage.getItem("username");

main.appendChild(userGreetings);