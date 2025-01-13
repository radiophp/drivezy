const mongoose = require('mongoose');
const timestampsPlugin = require('mongoose-timestamp');
const Schema = mongoose.Schema;

const LogsSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  activity: { type: String, enum: ['create', 'update', 'delete'], required: true },
  modelName: { type: String, required: true },
  modelId: { type: mongoose.Schema.Types.ObjectId, required: true },
  changes: { type: Map, of: String },
});

LogsSchema.plugin(timestampsPlugin);

module.exports = mongoose.model('Logs', LogsSchema);