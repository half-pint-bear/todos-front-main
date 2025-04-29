const userNameInput = document.getElementById('prenom');
const submitButton = document.getElementById('btn-submit');

//Authorized name pattern
const VALID_NAME_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ\- ]+$/;

/**
 * Prevents void submission
 * @returns void
 */
const handleFormNameError = () => {
    clearErrorMessage();

    const rawValue = userNameInput.value.trim();

    if (!rawValue) {
        showValidationError('Veuillez saisir un nom.');
    } else if (!VALID_NAME_REGEX.test(rawValue)) {
        showValidationError("Caractères spéciaux non autorisés");
    } else {
        localStorage.setItem('username', rawValue);
        window.location.href = './tasks.html';
    }
};

/**
 * Turns red in case of error
 * @param {string} message
 * @returns void
 */
const showValidationError = (message) => {
    userNameInput.classList.add('is-invalid');

    const errorSpan = document.createElement('span');
    errorSpan.textContent = message;
    errorSpan.style.color = 'red';
    errorSpan.style.fontSize = '0.9rem';
    errorSpan.classList.add('validation-error');

    const formGroup = userNameInput.closest('.form-group');
    if (formGroup && !formGroup.querySelector('.validation-error')) {
        formGroup.appendChild(errorSpan);
    }
};

/**
 * Remove error message when form is valid
 * @returns void
 */
const clearErrorMessage = () => {
    userNameInput.classList.remove('is-invalid');

    const existingError = document.querySelector('.validation-error');
    if (existingError) {
        existingError.remove();
    }
};

submitButton.addEventListener('click', (e) => {
    e.preventDefault();
    handleFormNameError();
});