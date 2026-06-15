const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/auth");
const submissionRoutes = require("./routes/submissions");

dotenv.config();

// Database Connection
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SRIHER IQAC Portal API Running"
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/submissions", submissionRoutes);

// 404 Route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found"
  });
});

// Server Start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});