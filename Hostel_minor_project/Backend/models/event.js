const mongoose = require('mongoose');
const { Schema } = mongoose;

const EventSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  venue: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Upcoming', 'Ongoing', 'Completed'],
    default: 'Upcoming'
  },
  participationCount: {
    type: Number,
    default: 0
  },
  liveUpdates: {
    type: String
  },
  winners: {
    type: String
  },
  achievements: {
    type: String
  },
  galleryPhotos: {
    type: [String],
    default: []
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
});

mongoose.pluralize(null);
module.exports = mongoose.models.event || mongoose.model('event', EventSchema);
