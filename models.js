const mongoose = require('./db');

const DataSchema = new mongoose.Schema({
    name: String,
    value: Number,
    category: String,
    createdAt: { type: Date, default: Date.now }
});

const ArchivedDataSchema = new mongoose.Schema({
    name: String,
    value: Number,
    category: String,
    createdAt: { type: Date, default: Date.now }
});
  
DataSchema.index({ name: "text", category: "text" });
DataSchema.index({ value: 1 });
DataSchema.index({ createdAt: 1 });
    
const Data = mongoose.model('Data', DataSchema);
const ArchivedData = mongoose.model('ArchivedData', ArchivedDataSchema);

module.exports = {
    Data,
    ArchivedData
}