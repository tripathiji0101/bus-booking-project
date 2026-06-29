const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const path = require('path');

const connectDB = require('./config/db');
const createSuperAdmin = require('./config/createSuperAdmin');
const {
  notFound,
  errorHandler
} = require('./middlewares/errorHandler');

// Load environment variables
dotenv.config({
  path: path.resolve(__dirname, '../.env')
});

const app = express();


// Middleware


// Security:
// Limit JSON body size to reduce DoS attacks
app.use(express.json({
  limit: '400kb'
}));

app.use(cors());
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}


// Routes


const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const busRoutes = require('./routes/busRoutes');
const driverRoutes = require('./routes/driverRoutes');
const routeRoutes = require('./routes/routeRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/upload', uploadRoutes);


// Static Files


app.use(
  '/uploads',
  express.static(path.join(__dirname, '../uploads'))
);


// Home Route


app.get('/', (req, res) => {
  res.send('Bus Booking SaaS API is running...');
});

// Error Handling


app.use(notFound);
app.use(errorHandler);


// Start Server

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {

    // Connect to MongoDB
    await connectDB();

    // Create Super Admin if it doesn't exist
    await createSuperAdmin();

    // Start Express server
    app.listen(PORT, () => {
      console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
      );
    });

  } catch (error) {

    console.error('Server startup failed:', error.message);
    process.exit(1);

  }
};

startServer();