const cron = require("node-cron");
const { Data, ArchivedData } = require('./models');

const archiveData = async () => {
  try {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const oldData = await Data.find({ createdAt: { $lt: oneYearAgo } });

    if (oldData.length > 0) {
      await ArchivedData.insertMany(oldData);
      await Data.deleteMany({ createdAt: { $lt: oneYearAgo } });
      console.log("Archiving completed for data older than one year.");
    } else {
      console.log("No data to archive for this month.");
    }
  } catch (error) {
    console.error("Error during archiving:", error);
  }
};

const purgeOldArchivedData = async () => {
  try {
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

    const result = await ArchivedData.deleteMany({ createdAt: { $lt: twoYearsAgo } });

    if (result.deletedCount > 0) {
      console.log(`Purging completed. Deleted ${result.deletedCount} old archived records.`);
    } else {
      console.log("No data to purge today.");
    }
  } catch (error) {
    console.error("Error during purging:", error);
  }
};

cron.schedule("0 0 1 * *", async () => {
  console.log("Starting monthly archiving task...");
  await archiveData();
});

cron.schedule("0 1 * * *", async () => {
  console.log("Starting daily purging task...");
  await purgeOldArchivedData();
});
