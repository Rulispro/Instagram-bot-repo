const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const taskList = JSON.parse(fs.readFileSync('task.json', 'utf-8'));

    for (const task of taskList.filter(t => t.task === "autolike")) {
        const cookies = JSON.parse(task.cookies);
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        await page.setCookie(...cookies);
        await page.goto('https://www.instagram.com/', { waitUntil: 'networkidle2' });

        console.log(`Login as ${task.username}`);

        for (let i = 0; i < task.totalLike; i++) {
            try {
                // Contoh like (disesuaikan selector postingan di beranda)
                await page.click('svg[aria-label="Like"]');
                console.log(`Liked post ${i + 1}`);
                const delay = Math.floor(Math.random() * (task.maxInterval - task.minInterval + 1) + task.minInterval) * 1000;
                await page.waitForTimeout(delay);
            } catch (err) {
                console.log('Error liking post: ', err.message);
            }
        }

        await browser.close();
    }
})();
