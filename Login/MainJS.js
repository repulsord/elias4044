// Function that handles the sign-in action
function signIn() {
    let username = document.querySelector('input[type="text"]').value;
    let password = document.querySelector('input[type="password"]').value;

    if (username === '' || password === '') {
        alert('Please enter both username and password.');
        return;
    }

    if (username === 'admin' && password === '1234') {
        localStorage.setItem('username', username);
    window.location.href = "https://elias4044.netlify.app/";
    } else {
        alert('Invalid username or password. Please try again.');
        username = "";
        password = "";
    }
}

// Add an event listener to the "Sign in" button to trigger the signIn function
document.querySelector('input[type="sumbit"]').addEventListener('click', function (e) {
    e.preventDefault();
    signIn();
});
