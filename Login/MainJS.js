import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    GithubAuthProvider
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { updateProfile } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";


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
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", () => {
    // Function to toggle between Login and Sign-Up views
    function toggleView() {
        const loginForm = document.querySelector(".login");
        const signUpForm = document.querySelector(".sign-up");
        loginForm.classList.toggle("hidden");
        signUpForm.classList.toggle("hidden");
    }

    function handleLogin(user) {
        const userData = {
            email: user.email,
            displayName: user.displayName || "Guest",
            uid: user.uid,
        };

        localStorage.setItem("loggedInUser", JSON.stringify(userData));
        window.location.href = "/index.html"; // Redirect to home page
    }

    // Login with Email and Password
    document.querySelector(".login button[type='submit']").addEventListener("click", async (event) => {
        event.preventDefault(); // Prevent form submission
        const email = document.querySelector("#username").value;
        const password = document.querySelector("#password").value;

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            handleLogin(userCredential.user);
        } catch (error) {
            alert("Login failed: " + error.message);
        }
    });

    // Sign-Up with Email and Password
    document.querySelector("#signupButton").addEventListener("click", async (event) => {
        event.preventDefault(); // Prevent form submission
        const email = document.querySelector("#signupEmail").value;
        const password = document.querySelector("#signupPassword").value;
        const username = document.querySelector("#signupUsername").value;


        if (username.includes(" ") || password.includes(" ")) { // Makes sure no spaces in password
            alert("Username and Password cannot contain spaces!");
            return;
        }


        if (username.length > 18) { // Makes sure username is not too long (<18 characters)
            alert("Username cannot be longer than 18 characters!");
            return;
        }


        const validEmailDomains = [
            "gmail.com", "hotmail.com", "yahoo.com", "outlook.com", "aol.com", "icloud.com",
            "live.com", "msn.com", "comcast.net", "mail.com", "zoho.com", "protonmail.com",
            "yandex.com", "mail.ru", "fastmail.com", "gmx.com", "tutanota.com", "hushmail.com"
        ];
        const emailDomain = email.split('@')[1]; // Gets the part after '@'

        if (!validEmailDomains.includes(emailDomain)) { // Makes sure email is valid
            alert("Please use a valid email address (e.g., gmail.com, hotmail.com, yahoo.com)!");
            return;
        }

        try {
            // Create the user
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // Update the user's profile to include the username
            await updateProfile(userCredential.user, {
                displayName: username, // Set the displayName
            });

            // Save the username in localStorage and redirect
            const userData = {
                email: userCredential.user.email,
                displayName: username, // Store the custom username
                uid: userCredential.user.uid,
            };
            localStorage.setItem("loggedInUser", JSON.stringify(userData));
            window.location.href = "https://elias4044.netlify.app"; // Redirect to home page
        } catch (error) {
            alert("Sign-Up failed: " + error.message);
        }
    });



    // Google Login
    document.querySelector(".googleSignIn").addEventListener("click", async (event) => {
        event.preventDefault(); // Prevent form submission
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            handleLogin(result.user);
        } catch (error) {
            alert("Google Sign-In failed: " + error.message);
        }
    });

    // Google SignUp
    document.querySelector(".googleSignUp").addEventListener("click", async (event) => {
        event.preventDefault(); // Prevent form submission
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            handleLogin(result.user);
        } catch (error) {
            alert("Google Sign-In failed: " + error.message);
        }
    });

    // GitHub Login
    document.querySelector(".githubSignIn").addEventListener("click", async (event) => {
        event.preventDefault(); // Prevent form submission
        const provider = new GithubAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            handleLogin(result.user);
        } catch (error) {
            alert("GitHub Sign-In failed: " + error.message);
        }
    });

        // GitHub SignUp
        document.querySelector(".githubSignUp").addEventListener("click", async (event) => {
            event.preventDefault(); // Prevent form submission
            const provider = new GithubAuthProvider();
            try {
                const result = await signInWithPopup(auth, provider);
                handleLogin(result.user);
            } catch (error) {
                alert("GitHub Sign-In failed: " + error.message);
            }
        });

    // Bind toggleView to buttons for switching between views
    const toggleViewSignup = document.querySelector(".sign-up .backToLogin");
    const toggleViewLogin = document.querySelector(".login .backToSignup");
    toggleViewLogin.addEventListener("click", toggleView);
    toggleViewSignup.addEventListener("click", toggleView);
});
