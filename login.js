const puppeteer = require('puppeteer');

module.exports = async (req, res) => {
    const { cookies } = req.body;
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
        const cookiesArr = cookies.split(';').map(cookie => {
            const [name, value] = cookie.trim().split('=');
            return { name, value, domain: '.instagram.com' };
        });
        await page.setCookie(...cookiesArr);
        await page.goto('https://www.instagram.com/', { waitUntil: 'networkidle2' });

        // Cek login dan ambil username
        const username = await page.evaluate(() => {
            const el = document.querySelector('a[href^="/accounts/edit/"]');
            return el ? el.getAttribute('href').split('/')[2] : null;
        });

        await browser.close();

        if (username) {
            res.json({ status: 'success', username });
        } else {
            res.json({ status: 'failed' });
        }
    } catch (e) {
        await browser.close();
        res.json({ status: 'failed', error: e.toString() });
    }
};
