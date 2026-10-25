const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;

// Cached connection for Serverless environments
let isConnected = false;

async function connectToDatabase() {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(MONGO_URI, {
      bufferCommands: false, // Disable Mongoose buffering for serverless
    });
    isConnected = db.connections[0].readyState === 1;
    console.log('Connected to MongoDB Atlas!');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
}

// Define Schema pointing to your 'daily_attendance' collection
const attendanceSchema = new mongoose.Schema({
  studentId: String,
  studentName: String,
  subjectName: String,
  section: String,
  attendance: Array
}, { collection: 'daily_attendance' });

const Attendance = mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema);

// API Endpoint to fetch attendance records
app.get('/api/attendance', async (req, res) => {
  try {
    await connectToDatabase();
    const records = await Attendance.find();
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;