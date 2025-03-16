const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const taskList = JSON.parse(fs.readFileSync('task.json', 'utf-8'));

    for (const task of taskList.filter(t => t.task === "autounfollow")) {
        const cookies = JSON.parse(task.cookies);
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        await page.setCookie(...cookies);
        await page.goto(`https://www.instagram.com/${task.username}/following/`, { waitUntil: 'networkidle2' });

        console.log(`Login as ${task.username}, unfollowing...`);

        let unfollowed = 0;
        while (unfollowed < task.totalUnfollow) {
            try {
                const buttons = await page.$$('button');

                for (const btn of buttons) {
                    const label = await page.evaluate(el => el.innerText, btn);
                    if (label === 'Following') {
                        await btn.click();
                        await page.waitForSelector('button:has-text("Unfollow")');
                        await page.click('button:has-text("Unfollow")');
                        unfollowed++;
                        console.log(`Unfollowed ${unfollowed}/${task.totalUnfollow}`);
                        const delay = Math.floor(Math.random() * (task.maxInterval - task.minInterval + 1) + task.minInterval) * 1000;
                        await page.waitForTimeout(delay);
                        if (unfollowed >= task.totalUnfollow) break;
                    }
                }

                await page.evaluate(() => window.scrollBy(0, 500)); // scroll down untuk load lebih banyak
                await page.waitForTimeout(2000);
            } catch (err) {
                console.log('Error:', err.message);
            }
        }

        await browser.close();
    }
})();
