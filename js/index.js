const userNameInput = document.getElementById('prenom');
const submitButton = document.getElementById("btn-submit");

submitButton.addEventListener('click', () => {
    handleFormNameError();
})

isUserNameInputFilled = () => {
    return userNameInput.value === '' ? false : true;
}

handleFormNameError = () => {
    if(!isUserNameInputFilled()) {
        userNameInput.classList.add("is-invalid");
    } else {
        let userName = userNameInput.value;
        localStorage.setItem("username", userName);
    }
}