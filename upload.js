const BASE_URL = 'http://Cloud-file-manager-env.eba-xeqamcxh.ap-south-1.elasticbeanstalk.com';
const token = localStorage.getItem('token');

if (!token) {
    alert('Please login first');
    window.location.href = 'login.html';
}

const uploadBtn = document.getElementById('uploadBtn');
if (uploadBtn) {
    uploadBtn.addEventListener('click', uploadFile);
}

async function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const status = document.getElementById('status');
    const file = fileInput.files[0];

    if (!file) {
        status.style.color = 'red';
        status.innerText = 'Please choose a file first';
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        status.style.color = 'cyan';
        status.innerText = 'Uploading...';

        // Fix: Now correctly uses BASE_URL
        const res = await fetch(`${BASE_URL}/upload`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        });

        const data = await res.json();

        if (!res.ok) {
            status.style.color = 'red';
            status.innerText = data.message || 'Upload failed';
            return;
        }

        // --- SUCCESS EFFECTS ---
        if (typeof confetti !== 'undefined') {
            confetti({
                particleCount: 250,
                spread: 100,
                ticks: 300,
                gravity: 0.6,
                scalar: 1.2,
                origin: { y: 0.7 },
                colors: ['#58a6ff', '#a371f7', '#ffffff', '#2ea043'] 
            });
        }
        
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: 'Success!',
                text: 'File uploaded to the cloud.',
                icon: 'success',
                background: '#161b22',
                color: '#ffffff',
                confirmButtonColor: '#58a6ff'
            });
        }

        status.style.color = '#2ea043';
        status.innerText = 'File uploaded successfully';
        fileInput.value = '';
        
        loadFiles();

    } catch (err) {
        console.error(err);
        status.style.color = 'red';
        status.innerText = 'Could not connect to server';
    }
}

async function loadFiles() {
    const fileList = document.getElementById('fileList');
    if (!fileList) return;

    try {
        // Fix: Now correctly uses BASE_URL instead of localhost:5000
        const res = await fetch(`${BASE_URL}/files`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        const data = await res.json();
        fileList.innerHTML = '';

        if (!res.ok) {
            fileList.innerHTML = '<li>Unable to load files</li>';
            return;
        }

        if (!data || data.length === 0) {
            fileList.innerHTML = '<li style="list-style:none; color:#8b949e;">No uploaded files yet</li>';
            return;
        }

        data.forEach(file => {
            const li = document.createElement('li');
            li.style.listStyle = "none";
            li.innerHTML = `<a href="${file.url}" target="_blank" class="file-link">📄 ${file.filename}</a>`;
            fileList.appendChild(li);
        });
    } catch (err) {
        console.error(err);
        fileList.innerHTML = '<li>Server connection error</li>';
    }
}

loadFiles();