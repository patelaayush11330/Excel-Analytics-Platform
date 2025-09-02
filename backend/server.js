const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

dotenv.config();
const app = express();

// ✅ Security Middleware
app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// ✅ CORS Setup - Allow both localhost and local IP access
app.use(cors({
  origin: ['http://localhost:3000', 'http://192.168.14.89:3000'],
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
}));

// ✅ Middlewares
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads')); // Serve static uploads

// ✅ Routes
const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/FileRouter');
const chartHistoryRoute = require('./routes/chartHistory');
const dashboardRoutes = require('./routes/Dashboard');
const aiRoutes = require('./routes/aiInsights');
const adminRoutes = require('./routes/admin');

app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/chart-history', chartHistoryRoute);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/files', aiRoutes); // Possibly merge with fileRoutes if related
app.use('/api/admin', adminRoutes);

// ✅ Test Route
app.get('/test', (req, res) => res.send('✅ Backend working'));

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
});

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('✅ Connected to MongoDB');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));
