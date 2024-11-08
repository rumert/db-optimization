const express = require('express');
const { faker } = require('@faker-js/faker');
const { Data } = require('./models');

const app = express();
app.use(express.json());

app.get('/data', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const data = await Data.find().lean().sort({ _id: -1 }).skip((page - 1) * limit).limit(limit);
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve data' });
  }
});

app.post('/data', async (req, res) => {
  try {
    const newData = new Data(req.body);
    const result = await newData.save();
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/data/:id', async (req, res) => {
  try {
    const updatedData = await Data.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/data/:id', async (req, res) => {
  try {
    await Data.findByIdAndDelete(req.params.id);
    res.status(200).json('OK');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/data/search', async (req, res) => {
  try {
    const { name, category } = req.query;

    let query = {};
    if (name || category) {
      query = { $text: { $search: `${name || ''} ${category || ''}` } };
    }

    const data = await Data.find(query).lean().select('name category');
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/data/range', async (req, res) => {
  try {
    const { minValue, maxValue } = req.query;

    let query = {};
    if (minValue) query.value = { ...query.value, $gte: parseInt(minValue) };
    if (maxValue) query.value = { ...query.value, $lte: parseInt(maxValue) };

    const data = await Data.find(query).lean();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/data/date', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let query = {};
    if (startDate) query.createdAt = { ...query.createdAt, $gte: new Date(startDate) };
    if (endDate) query.createdAt = { ...query.createdAt, $lte: new Date(endDate) };

    const data = await Data.find(query).lean();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/populate', async (req, res) => {
  try {
    let bulkData = [];
    for (let i = 0; i < 10000; i++) {
      bulkData.push({
        name: faker.commerce.product(),
        value: faker.commerce.price(),
        category: faker.commerce.department(),
        createdAt: faker.date.past({ years: 3 }),
      });
    }
    await Data.insertMany(bulkData);
    console.log('Database populated with mock data');
    res.status(200).json('OK');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});