const dbName = 'instagramBotDB';
const storeName = 'cookiesStore';

async function openDB() {
    return idb.openDB(dbName, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName, { keyPath: 'username' });
            }
        }
    });
}

async function saveCookies(username, cookies) {
    const db = await openDB();
    await db.put(storeName, { username, cookies });
    await loadUsernames();
}

async function loadUsernames() {
    const db = await openDB();
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const allCookies = await store.getAll();

    const dropdown = document.getElementById('usernameDropdown');
    dropdown.innerHTML = '<option value="">Pilih Username</option>';
    allCookies.forEach(item => {
        const option = document.createElement('option');
        option.value = item.username;
        option.textContent = item.username;
        dropdown.appendChild(option);
    });
}

async function getCookiesByUsername(username) {
    const db = await openDB();
    return await db.get(storeName, username);
}

document.getElementById('loginBtn').onclick = async () => {
    const cookies = document.getElementById('cookies').value;
    const username = prompt("Masukkan Username Akun:"); // Bisa pakai parsing dari cookies kalau mau otomatis
    if (cookies && username) {
        await saveCookies(username, cookies);
        alert('Cookies tersimpan untuk ' + username);
    }
};

document.getElementById('startAutolike').onclick = async () => {
    const username = document.getElementById('usernameDropdown').value;
    const total = document.getElementById('totalLike').value;
    const min = document.getElementById('minIntervalLike').value;
    const max = document.getElementById('maxIntervalLike').value;
    if (username) {
        await triggerGitHubWorkflow('autolike', { username, total, min, max });
    }
};

document.getElementById('startFollowTarget').onclick = async () => {
    const username = document.getElementById('usernameDropdown').value;
    const target = document.getElementById('targetUsername').value;
    const type = document.getElementById('followType').value;
    const interval = document.getElementById('intervalFollowUsername').value;
    if (username) {
        await triggerGitHubWorkflow('autofollowtargetbyusername', { username, target, type, interval });
    }
};

document.getElementById('startUnfollow').onclick = async () => {
    const username = document.getElementById('usernameDropdown').value;
    const interval = document.getElementById('intervalUnfollow').value;
    if (username) {
        await triggerGitHubWorkflow('autounfollow', { username, interval });
    }
};

document.getElementById('startFollowByLink').onclick = async () => {
    const username = document.getElementById('usernameDropdown').value;
    const link = document.getElementById('postLink').value;
    const interval = document.getElementById('intervalFollowPost').value;
    if (username) {
        await triggerGitHubWorkflow('autofollowlinknpost', { username, lin
};

// Fungsi pemicu GitHub Workflow (API repo privat/secret)
async function triggerGitHubWorkflow(task, data) {
    const repo = 'username/Instagram-bot'; // Ganti username dengan GitHub username kamu
    const url = `https://api.github.com/repos/${repo}/actions/workflows/${task}.yml/dispatches`;

    await fetch(url, {
        method: 'POST',
        headers: 
            'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({
            ref: 'main',
            inputs: data
        })
    });

    alert('Task ' + task + ' dikirim ke backend');
}

window.onload = loadUsernames;
