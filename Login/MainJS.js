// Toggle between login and sign-up views
function toggleView() {
    const loginForm = document.querySelector('.login');
    const signUpForm = document.querySelector('.sign-up');

    // Toggle visibility by switching the hidden class
    loginForm.classList.toggle('hidden');
    signUpForm.classList.toggle('hidden');

    console.log(loginForm);
    console.log(signUpForm);
}

// Function that handles the sign-in action
function signIn() {
    let username = document.querySelector('input[type="text"]').value;
    let password = document.querySelector('input[type="password"]').value;

    if (username === '' || password === '') {
        alert('Please enter both username and password.');
        return;
    }

    const storedUsername = localStorage.getItem('username'); // Retrieve saved username
    const storedPassword = localStorage.getItem('password'); // Retrieve saved password

    if (username === storedUsername && password === storedPassword) {
        alert('Login successful!');
        window.location.href = "https://elias4044.netlify.app/index.html";  // Redirect to home page
    } else {
        alert('Invalid username or password. Please try again.');
    }
}

// Add an event listener to the "Sign in" button to trigger the signIn function
document.querySelector('form.login button[type="submit"]').addEventListener('click', function(e) {
    e.preventDefault();
    signIn();
});

// Function to handle sign-up action
document.getElementById('signupButton').addEventListener('click', function(e) {
    e.preventDefault();
    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;

    if (username && password) {
        localStorage.setItem('username', username); // Save username in localStorage
        localStorage.setItem('password', password); // Save password in localStorage
        alert('Sign up successful! You can now log in.');
        toggleView();  // Go back to the login view
    } else {
        alert('Please fill in all fields.');
    }
});
