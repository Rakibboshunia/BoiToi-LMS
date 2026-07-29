const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const User = require("../models/User");

const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI;
    
    // Check if localhost is used and we want to fall back to in-memory for testing
    if (uri.includes("localhost") || uri.includes("127.0.0.1")) {
      console.log("⚠️ Local MongoDB detected. Using mongodb-memory-server for testing...");
      const mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
    }

    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Auto-seed some test users if they don't exist
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    if (!adminExists) {
      await User.create([
        { name: 'Test Admin', email: 'admin@example.com', password: 'password123', role: 'admin' },
        { name: 'Test Teacher', email: 'teacher@example.com', password: 'password123', role: 'teacher' },
        { name: 'Test Student', email: 'student@example.com', password: 'password123', role: 'student' }
      ]);
      console.log('✅ Seeded test users: admin, teacher, student (Password: password123)');
    }

  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
