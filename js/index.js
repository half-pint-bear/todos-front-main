const userNameInput = document.getElementById('prenom');
const submitButton = document.getElementById('btn-submit');

const handleFormNameError = () => {
    if (!isUserNameInputFilled()) {
        userNameInput.classList.add('is-invalid');
        displayErrorMessage();
    } else {
        localStorage.setItem('username', userNameInput.value);
        window.location.href = './tasks.html';
    }
};

const isUserNameInputFilled = () => {
    return userNameInput.value.trim() !== '';
};

const displayErrorMessage = () => {
    // Prevents error message duplication
    if (!document.querySelector('.form-group span')) {
        const errorSpan = document.createElement('span');
        errorSpan.textContent = 'Veuillez saisir un nom';
        errorSpan.style.color = 'red';
        document.querySelector('.form-group').appendChild(errorSpan);
    }
};

submitButton.addEventListener('click', (e) => {
    e.preventDefault();
    handleFormNameError();
});