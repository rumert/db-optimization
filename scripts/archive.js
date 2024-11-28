const { Data, ArchivedData } = require('../models');

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

module.exports = archiveData;