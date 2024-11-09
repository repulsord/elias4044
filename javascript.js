// Detects if user is logged in! :D
document.addEventListener('DOMContentLoaded', function () {
    const username = localStorage.getItem('username');
    if (username) {
        document.querySelector('.login-btn').textContent = 'Logout';
        document.querySelector('.login-btn').addEventListener('click', function () {
            // Logout action
            localStorage.removeItem('username');
            localStorage.removeItem('password');
            document.querySelector(".login-btn").href = '#';
            window.location.reload(); // Refreshes page to update login status
        });
    } else {
        // Redirect to login if not logged in
        document.querySelector('.login-btn-text').textContent = 'Login';
        document.querySelector('.login-btn').href = '/Login/MainWeb.html';
    }
});
