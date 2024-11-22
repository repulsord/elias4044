// Import Firebase Auth
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";

const firebaseConfig = {
    apiKey: "AIzaSyDXnGMm9JwySRCc7dUbGMR0kNwudhxafvU",
    authDomain: "elias4044-b6.firebaseapp.com",
    projectId: "elias4044-b6",
    storageBucket: "elias4044-b6.firebasestorage.app",
    messagingSenderId: "272028804804",
    appId: "1:272028804804:web:493ad6e0a8b771d13b4b91",
    measurementId: "G-PDSSWJKL9M"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Initializes Firebase Auth

// DOMContentLoaded Listener
document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const loginBtn = document.querySelector('.login-btn');

    if (loggedInUser) {
        // Shows user's name and change button to logout
        loginBtn.textContent = `Logout (${loggedInUser.displayName || "Guest"})`;
        loginBtn.addEventListener('click', async () => {
            try {
                // Sign out and clear localStorage
                await signOut(auth);
                console.log('User signed out');
                localStorage.removeItem('loggedInUser');
                window.location.reload();
            } catch (error) {
                alert("Logout failed: " + error.message);
            }
        });
    } else {
        // Redirect to login page
        loginBtn.textContent = 'Login';
        loginBtn.addEventListener('click', () => {
            window.location.href = '/Login/MainWeb.html';
        });
    }
});
