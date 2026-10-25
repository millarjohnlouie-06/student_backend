const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 1. Updated connection string with your exact database name: LabAttendanceDB_Millar
const MONGO_URI = 'mongodb+srv://millarjohnlouie_db_user:MillaR11062002@cluster0.e0kitq9.mongodb.net/LabAttendanceDB_Millar?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB Atlas!'))
  .catch(err => console.error('MongoDB connection error:', err));

// 2. Updated schema pointing directly to your 'daily_attendance' collection
const attendanceSchema = new mongoose.Schema({
  studentId: String,
  studentName: String,
  subjectName: String,
  section: String,
  attendance: Array
}, { collection: 'daily_attendance' });

const Attendance = mongoose.model('Attendance', attendanceSchema);

// API Endpoint
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