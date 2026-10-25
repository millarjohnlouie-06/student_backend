const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas securely using environment variables
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB Atlas!'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define Schema pointing to your 'daily_attendance' collection
const attendanceSchema = new mongoose.Schema({
  studentId: String,
  studentName: String,
  subjectName: String,
  section: String,
  attendance: Array
}, { collection: 'daily_attendance' });

const Attendance = mongoose.model('Attendance', attendanceSchema);

// API Endpoint to fetch attendance records
app.get('/api/attendance', async (req, res) => {
  try {
    const records = await Attendance.find();
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});