const { ArchivedData } = require('../models');

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

module.exports = purgeOldArchivedData;