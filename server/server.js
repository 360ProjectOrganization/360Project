require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB, closeDB } = require('./repository/connection');

// import route modules
const applicantRoutes = require('./controller/applicant.controller');
const authRoutes = require('./controller/auth.controller');

const app = express();
const PORT = process.env.PORT;

// enable cors for fronten
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

// parse json request bodies
app.use(express.json());

// parse urlencoded request bodies
app.use(express.urlencoded({ extended: true }));



// ROUTES

// health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// mount route modules (this is where we define the routes for the application)
app.use('/api/applicants', applicantRoutes);
app.use('/api/auth', authRoutes);

// start server
async function startServer() {
  try {
    await connectDB();
    console.log('Connected to database');

    // start listening
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nSHUTTING DOWN');
  await closeDB();
  process.exit(0);
});

startServer();

module.exports = app;
