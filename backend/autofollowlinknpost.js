const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const taskList = JSON.parse(fs.readFileSync('task.json', 'utf-8'));

    for (const task of taskList.filter(t => t.task === "autofollowlinknpost")) {
        const cookies = JSON.parse(task.cookies);
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        await page.setCookie(...cookies);
        await page.goto(task.postLink, { waitUntil: 'networkidle2' });

        console.log(`Login as ${task.username}, following people from post ${task.postLink}`);

        // Klik list like/komen
        await page.click('a[href$="/liked_by/"]'); // buka daftar like (sesuaikan selector bila beda)
        await page.waitForSelector('button');

        let followed = 0;
        while (followed < task.totalFollow) {
            try {
                const buttons = await page.$$('button');

                for (const btn of buttons) {
                    const label = await page.evaluate(el => el.innerText, btn);
                    if (label === 'Follow') {
                        await btn.click();
                        followed++;
                        console.log(`Followed ${followed}/${task.totalFollow}`);
                        const delay = Math.floor(Math.random() * (task.maxInterval - task.minInterval + 1) + task.minInterval) * 1000;
                        await page.waitForTimeout(delay);
                        if (followed >= task.totalFollow) break;
                    }
                }

                await page.evaluate(() => window.scrollBy(0, 500)); // scroll load lagi
                await page.waitForTimeout(2000);
            } catch (err) {
                console.log('Error:', err.message);
            }
        }

        await browser.close();
    }
})();
