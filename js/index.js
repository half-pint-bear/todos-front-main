const userNameInput = document.getElementById('prenom');
const submitButton = document.getElementById("btn-submit");

submitButton.addEventListener('click', (e) => {
    e.preventDefault();
    handleFormNameError();
})

handleFormNameError = () => {
    if(!isUserNameInputFilled()) {
        userNameInput.classList.add("is-invalid");
        errorMessage();
    } else {
        localStorage.setItem("username", userNameInput.value);
        window.location.href = './tasks.html';
    }
}

isUserNameInputFilled = () => {
    return userNameInput.value === '' ? false : true;
}

errorMessage = () => {
    const errorSpan = document.createElement('span');
    errorSpan.innerHTML = 'Veuillez saisir un nom';
    errorSpan.style.color = 'red';
    document.querySelector('.form-group').appendChild(errorSpan);
}