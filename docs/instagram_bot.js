const puppeteer = require('puppeteer');
const idb = require('idb');

async function loginWithCookies() {
    const db = await idb.openDB('instagramDB', 1);
    const cookies = await db.get('cookies', 'cookies');
    
    if (!cookies) {
        console.log("Cookies tidak ditemukan");
        return;
    }

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    
    await page.setCookie({ name: 'sessionid', value: cookies });
    await page.goto('https://www.instagram.com');
    await page.waitForNavigation();

    const isLoggedIn = await page.evaluate(() => !!document.querySelector("nav"));
    if (isLoggedIn) {
        console.log("Login berhasil");
    } else {
        console.log("Login gagal");
    }

    await browser.close();
}

async function autolike(totalLike, minInterval, maxInterval) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('https://www.instagram.com');
    let likeCount = 0;

    const interval = setInterval(async () => {
        if (likeCount >= totalLike || likeCount >= 120) {
            clearInterval(interval);
            console.log("Autolike selesai");
            await browser.close();
        } else {
            console.log(`Like ke-${likeCount + 1}`);
            likeCount++;
        }
    }, Math.random() * (maxInterval - minInterval) + minInterval);
}

async function autoFollow(username, type, interval) {
    console.log(`Memulai follow ${type} dari ${username}`);

    let followCount = 0;
    const intervalFollow = setInterval(() => {
        if (followCount >= 50) {
            clearInterval(intervalFollow);
            console.log("Auto-follow selesai");
        } else {
            console.log(`Follow akun ke-${followCount + 1}`);
            followCount++;
        }
    }, interval * 1000);
}

async function autoUnfollow(interval) {
    console.log("Memulai proses unfollow...");

    let unfollowCount = 0;
    const intervalUnfollow = setInterval(() => {
        if (unfollowCount >= 50) {
            clearInterval(intervalUnfollow);
            console.log("Auto-unfollow selesai");
        } else {
            console.log(`Unfollow akun ke-${unfollowCount + 1}`);
            unfollowCount++;
        }
    }, interval * 1000);
}

module.exports = { loginWithCookies, autolike, autoFollow, autoUnfollow };
      
