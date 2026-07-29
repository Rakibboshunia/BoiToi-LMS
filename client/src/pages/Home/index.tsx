import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-primary mb-4">Welcome to LMS Platform</h1>
      <p className="text-muted-foreground mb-8 text-center max-w-lg">
        A comprehensive learning management system with student and teacher dashboards, live classes, quizzes, and more.
      </p>
      
      <div className="flex gap-4">
        <Link 
          to="/login" 
          className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition"
        >
          Login
        </Link>
        <Link 
          to="/register" 
          className="px-6 py-2 border border-input rounded-md hover:bg-accent transition"
        >
          Register
        </Link>
      </div>
    </div>
  );
};

export default Home;
