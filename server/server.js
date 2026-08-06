require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/db");
const { initSocket } = require("./socket");
const errorHandler = require("./middleware/error");

// Connect to Database
connectDB();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = initSocket(server);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(helmet());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Make io accessible to routers
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Basic Route for testing
app.get("/", (req, res) => {
  res.send("LMS API is running...");
});

// API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/student", require("./routes/student"));
app.use("/api/courses", require("./routes/courses"));
app.use("/api/live", require("./routes/live"));
app.use("/api/quizzes", require("./routes/quizzes"));
app.use("/api/assignments", require("./routes/assignments"));
app.use("/api/certificates", require("./routes/certificates"));
app.use("/api/payments", require("./routes/payments"));
app.use("/api/notifications", require("./routes/notifications"));
app.use("/api/dashboard", require("./routes/dashboard"));

// Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
