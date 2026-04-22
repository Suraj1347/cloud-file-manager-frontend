const BASE_URL = 'http://Cloud-file-manager-env.eba-xeqamcxh.ap-south-1.elasticbeanstalk.com';

async function signup() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const statusMessage = document.getElementById('statusMessage');

    try {
        const res = await fetch(`${BASE_URL}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();

        if (res.ok) {
            statusMessage.style.color = "green";
            statusMessage.innerText = "Signup successful! Redirecting to login...";
            setTimeout(() => { window.location.href = 'login.html'; }, 1500); 
        } else {
            statusMessage.style.color = "red";
            statusMessage.innerText = data.message || "Signup failed.";
        }
    } catch (error) {
        console.error("Signup Error:", error);
        statusMessage.style.color = "red";
        statusMessage.innerText = "Error: Backend server is not reachable!";
    }
}