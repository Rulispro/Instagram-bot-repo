const tasks = require('../task.json');

tasks.forEach(account => {
    if (account.task === 'autolike') require('./autolike')(account);
    if (account.task === 'autofollowtargetbyusername') require('./autofollowtargetbyusername')(account);
    if (account.task === 'autounfollow') require('./autounfollow')(account);
    if (account.task === 'autofollowlinknpost') require('./autofollowlinknpost')(account);
});
