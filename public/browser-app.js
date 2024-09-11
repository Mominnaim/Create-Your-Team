//This is the button that takes you to the login page
const login = document.querySelector('.login-button')

// 

login.addEventListener("click", goToLoginPage)

// This function will take us to the login page
function goToLoginPage() {
    console.log("Trying to Log in")
    window.location.href = "login.html";
}