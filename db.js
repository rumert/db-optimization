require('dotenv').config();
const mongoose = require('mongoose');

async function connectWithRetry(connectFunc, retries = 5, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      await connectFunc();
      console.log('Mongo connection successful!');
      return;
    } catch (error) {
      console.error(`Connection failed. Attempt ${i + 1} of ${retries}:`, error.message);
      await new Promise(res => setTimeout(res, delay));
    }
  }
  console.error('Max retries for connecting mongo reached. Exiting...');
  process.exit(1);
}
  
async function connectToMongoDB() {
  await connectWithRetry(async () => {
    await mongoose.connect(process.env.MONGO_URL, {
      maxPoolSize: 10
    });
  });
}
  
connectToMongoDB()

module.exports = mongoose;