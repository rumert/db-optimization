const cron = require("node-cron");
const archiveData = require("./scripts/archive")
const purgeOldArchivedData = require("./scripts/purge")

cron.schedule('* * * * *', async () => {
    await archiveData();
    await purgeOldArchivedData();
});