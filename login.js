const BASE_URL = 'http://Cloud-file-manager-env.eba-xeqamcxh.ap-south-1.elasticbeanstalk.com';

async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const loginMessage = document.getElementById('loginMessage');

    if (!email || !password) {
        loginMessage.style.color = "red";
        loginMessage.innerText = "Please enter both email and password.";
        return;
    }

    try {
        const res = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem('token', data.token);
            loginMessage.style.color = "green";
            loginMessage.innerText = "Login successful! Redirecting...";
            
            setTimeout(() => { window.location.href = 'upload.html'; }, 1000);
        } else {
            loginMessage.style.color = "red";
            loginMessage.innerText = data.message || "Login failed.";
        }
    } catch (error) {
        console.error("Login Error:", error);
        loginMessage.style.color = "red";
        loginMessage.innerText = "Error: Backend server is not reachable!";
    }
}