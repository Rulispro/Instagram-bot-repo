const GITHUB_USERNAME = 'Rulispro'; // Ganti username GitHub kamu
const REPO_NAME = 'Instagram-bot'; // Nama repo kamu
//const TOKEN = 'GITHUB_TOKEN_KAMU'; // Masukkan ke Secrets GitHub

const dbName = 'InstagramBot';
const storeName = 'cookiesStore';

// Buka DB
async function openDB() {
    return await idb.openDB(dbName, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName, { keyPath: 'username' });
            }
        }
    });
}

// Upload task login
async function uploadLoginTask(cookies) {
    const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/task.json`;

    const task = {
        type: 'login',
        cookies: cookies,
        status: 'active',
        created_at: new Date().toISOString()
    };

    const content = btoa(JSON.stringify(task, null, 2));

    const getRes = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
    const isExist = getRes.status === 200;
    const sha = isExist ? (await getRes.json()).sha : undefined;

    await fetch(url, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message: `Login task update`,
            content,
            sha
        })
    });
}

// Simpan cookies ke IndexedDB
async function saveAccount(username, cookies) {
    const db = await openDB();
    await db.put(storeName, { username, cookies });
    loadCookiesDropdown(); // Update dropdown
}

// Load dropdown akun
async function loadCookiesDropdown() {
    const db = await openDB();
    const allAccounts = await db.getAll(storeName);
    const dropdown = document.getElementById('usernameDropdown');
    dropdown.innerHTML = '<option value="">Pilih Akun</option>';
    allAccounts.forEach((item) => {
        dropdown.innerHTML += `<option value="${item.username}">${item.username}</option>`;
    });
}

// Tombol Login: kirim cookies ke task.json
async function login() {
    const cookies = document.getElementById('cookies').value.trim();
    if (!cookies) {
        alert('Masukkan cookies!');
        return;
    }

    await uploadLoginTask(cookies);
    alert('Login task terkirim, tunggu backend memproses login & update akun!');
}

// Upload task autolike
async function uploadAutoLikeTask(username, max, interval, reaction) {
    const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/task.json`;

    const task = {
        type: 'autolike',
        username: username,
        max: parseInt(max),
        interval: parseInt(interval),
        reaction: reaction,
        status: 'active',
        created_at: new Date().toISOString()
    };

    const content = btoa(JSON.stringify(task, null, 2));

    const getRes = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
    const isExist = getRes.status === 200;
    const sha = isExist ? (await getRes.json()).sha : undefined;

    await fetch(url, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message: `Auto Like task update`,
            content,
            sha
        })
    });
    alert('Task Auto Like dikirim!');
}

// Upload task autofollow target username
async function uploadAutoFollowTask(username, target, max, interval) {
    const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/task.json`;

    const task = {
        type: 'autofollowtargetbyusername',
        username: username,
        target: target,
        max: parseInt(max),
        interval: parseInt(interval),
        status: 'active',
        created_at: new Date().toISOString()
    };

    const content = btoa(JSON.stringify(task, null, 2));

    const getRes = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
    const isExist = getRes.status === 200;
    const sha = isExist ? (await getRes.json()).sha : undefined;

    await fetch(url, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message: `Auto Follow task update`,
            content,
            sha
        })
    });
    alert('Task Auto Follow dikirim!');
}

// Upload task auto unfollow
async function uploadAutoUnfollowTask(username, max, interval) {
    const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/task.json`;

    const task = {
        type: 'autounfollow',
        username: username,
        max: parseInt(max),
        interval: parseInt(interval),
        status: 'active',
        created_at: new Date().toISOString()
    };

    const content = btoa(JSON.stringify(task, null, 2));

    const getRes = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
    const isExist = getRes.status === 200;
    const sha = isExist ? (await getRes.json()).sha : undefined;

    await fetch(url, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message: `Auto Unfollow task update`,
            content,
            sha
        })
    });
    alert('Task Auto Unfollow dikirim!');
}

// Upload task auto follow dari link post
async function uploadAutoFollowFromPostTask(username, link, max, interval) {
    const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/task.json`;

    const task = {
        type: 'autofollowlinkpost',
        username: username,
        link: link,
        max: parseInt(max),
        interval: parseInt(interval),
        status: 'active',
        created_at: new Date().toISOString()
    };

    const content = btoa(JSON.stringify(task, null, 2));

    const getRes = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
    const isExist = getRes.status === 200;
    const sha = isExist ? (await getRes.json()).sha : undefined;

    await fetch(url, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message: `Auto Follow Link Post task update`,
            content,
            sha
        })
    });
    alert('Task Auto Follow dari Link Post dikirim!');
}

// Load otomatis saat buka halaman
window.onload = function () {
    loadCookiesDropdown();
};
