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

    const Course = require("../models/Course");
    const courseCount = await Course.countDocuments();
    if (courseCount === 0) {
      const teacher = await User.findOne({ role: 'teacher' });
      if (teacher) {
        await Course.create([
          {
            title: "Complete Web Development Bootcamp 2026",
            description: "Learn HTML, CSS, JavaScript, React, Node.js, and MongoDB from scratch to build modern full-stack applications.",
            shortDescription: "Become a full-stack web developer with this comprehensive guide.",
            teacher: teacher._id,
            category: "Web Development",
            tags: ["React", "Node.js", "Web Dev", "Full-Stack"],
            level: "beginner",
            price: 99.99,
            discountPrice: 19.99,
            isPublished: true,
            isApproved: true,
            thumbnail: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=80",
            rating: { average: 4.8, count: 1250 },
          },
          {
            title: "Advanced Data Science with Python",
            description: "Master Data Analysis, Machine Learning, Deep Learning, and visualization techniques using Python, Pandas, and TensorFlow.",
            shortDescription: "A practical approach to solving complex data science problems.",
            teacher: teacher._id,
            category: "Data Science",
            tags: ["Python", "Machine Learning", "Data Analysis", "AI"],
            level: "advanced",
            price: 129.99,
            discountPrice: 29.99,
            isPublished: true,
            isApproved: true,
            thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
            rating: { average: 4.9, count: 830 },
          },
          {
            title: "Cybersecurity Ethical Hacking Masterclass",
            description: "Learn penetration testing, network security, and vulnerability assessment to become a certified ethical hacker.",
            shortDescription: "Defend systems against threats by learning how hackers attack.",
            teacher: teacher._id,
            category: "Cybersecurity",
            tags: ["Security", "Hacking", "Network", "Pentesting"],
            level: "intermediate",
            price: 149.99,
            discountPrice: 39.99,
            isPublished: true,
            isApproved: true,
            thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80",
            rating: { average: 4.7, count: 540 },
          },
          {
            title: "Mobile App Development with React Native",
            description: "Build native cross-platform apps for iOS and Android using React Native and Expo.",
            shortDescription: "Create powerful mobile applications using JavaScript.",
            teacher: teacher._id,
            category: "Mobile Dev",
            tags: ["React Native", "iOS", "Android", "JavaScript"],
            level: "intermediate",
            price: 89.99,
            discountPrice: 14.99,
            isPublished: true,
            isApproved: true,
            thumbnail: "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=800&q=80",
            rating: { average: 4.6, count: 320 },
          }
        ]);
        console.log('✅ Seeded 4 demo software courses');
      }
    }

  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
