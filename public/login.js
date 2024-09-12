// Setting up variables to reference the login and create account forms
const loginForm = document.querySelector("#login");
const createAccountForm = document.querySelector("#createAccount");
const inputUsername = document.querySelector('.form__input-username');
const inputPassword = document.querySelector('.form__input-password');
const userConfirmPassword = document.querySelector('#confirmPassword')
const userEmail = document.querySelector('#Email');
const userUsername = document.querySelector('#signupUsername')
const userPassword = document.querySelector('#password')


console.log('Here I am')

function setFormMessage(formElement, type, message) {
    const messageElement = formElement.querySelector(".form__message");
    messageElement.textContent = message;
    messageElement.classList.remove("form__message--success", "form__message--error");
    messageElement.classList.add(`form__message--${type}`);
}

function setInputError(inputElement,message) {
    inputElement.classList.add("form__input--error");
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = message;
}

function clearInputError(inputElement) {
    inputElement.classList.add("form__input--error");
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = "";
}


// This event handler will execute once the DOM has fully loaded
document.addEventListener("DOMContentLoaded", () => {


    // Event listener for "Create Account" link
    // When the user clicks "Create Account", hide the login form and show the create account form
    document.querySelector("#linkCreateAccount").addEventListener("click", e => {
        e.preventDefault(); // Prevent default behavior of the link
        loginForm.classList.add("form--hidden"); // Hide the login form
        createAccountForm.classList.remove("form--hidden"); // Show the create account form
    });

    // Event listener for "Login" link
    // When the user clicks "Login", hide the create account form and show the login form
    document.querySelector("#linkLogin").addEventListener("click", e => {
        e.preventDefault(); // Prevent default behavior of the link
        createAccountForm.classList.add("form--hidden"); // Hide the create account form
        loginForm.classList.remove("form--hidden"); // Show the login form
    });

    // Event listener for login form submission
    loginForm.addEventListener("submit", e => {
        e.preventDefault(); // Prevent the form from submitting normally
        
        // Perform AJAX login here (to be implemented)

        // Display an error message for invalid login
        setFormMessage(loginForm, "error", "Invalid username or password combination");
    });

    // Add validation checks for each input field in the form
    document.querySelectorAll(".form__input").forEach(inputElement => {
        // Event listener for when an input field loses focus (blur event)
        inputElement.addEventListener("blur", e => {
            // If the input is the signup username and its length is between 0 and 5, show an error message
            if (e.target.id === "signupUsername" && e.target.value.length > 0 && e.target.value.length < 5) {
                setInputError(inputElement, "Username must be at least 5 characters in length");
            }
        });

        // Event listener for when the input field changes (input event)
        inputElement.addEventListener("input", e => {
            // Clear any existing error messages
            clearInputError(inputElement);
        });
    });
});

loginForm.addEventListener('click', async (e) => {
    console.log("I have been clicked")
    e.preventDefault()

    const username = inputUsername.value;
    const password = inputPassword.value;

    try {
        await axios.post('/user/signin', {username, password})
    } catch(error) {
        console.log("It did not work, please try again")
    }
});

createAccountForm.addEventListener('submit', async (e) => {
    console.log("I have been clicked create account")
    e.preventDefault();
    const username = userUsername.value;
    const password = userPassword.value;
    const email = userEmail.value;
    const confirmPassword = userConfirmPassword.value;

    if (password === confirmPassword) {
        try{
            await axios.post('/user/signup', {username, email, password, confirmPassword})
        } catch (error) {
            console.log(error)
        }
    } else {
        console.log(confirmPassword)
        console.log(password)
        console.log(email)
        console.log(username)
        console.log("Your passwords do not match")
    }
})


