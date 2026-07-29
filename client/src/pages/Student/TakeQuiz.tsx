import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Clock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock data for demo purposes since we aren't hooking it to a real backend in this scaffold
const mockQuiz = {
  title: "React Fundamentals",
  timeLimit: 30, // minutes
  questions: [
    {
      id: 1,
      text: "What is a React Hook?",
      options: ["A function that lets you hook into React state", "A fishing tool", "A class component", "An HTML element"],
    },
    {
      id: 2,
      text: "Which hook is used for side effects?",
      options: ["useState", "useEffect", "useReducer", "useContext"],
    }
  ]
};

const TakeQuiz: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSelectOption = (questionId: number, option: string) => {
    setAnswers({ ...answers, [questionId]: option });
  };

  const handleNext = () => {
    if (currentQuestion < mockQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    // Mock grading logic
    let earned = 0;
    if (answers[1] === mockQuiz.questions[0].options[0]) earned += 50;
    if (answers[2] === mockQuiz.questions[1].options[1]) earned += 50;
    
    setScore(earned);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-background border border-border rounded-xl p-12 shadow-sm text-center"
        >
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Quiz Completed!</h2>
          <p className="text-muted-foreground mb-8">You have successfully submitted your assessment.</p>
          
          <div className="inline-block bg-secondary/50 rounded-lg p-6 mb-8">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Your Score</p>
            <p className="text-5xl font-bold text-primary">{score}%</p>
            <p className={`text-sm font-medium mt-2 ${score >= 70 ? 'text-green-600' : 'text-destructive'}`}>
              {score >= 70 ? 'Passed' : 'Failed'}
            </p>
          </div>
          
          <div>
            <button onClick={() => navigate('/student/dashboard')} className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition w-full sm:w-auto">
              Return to Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const question = mockQuiz.questions[currentQuestion];

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{mockQuiz.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">Question {currentQuestion + 1} of {mockQuiz.questions.length}</p>
        </div>
        <div className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-lg font-mono text-lg font-bold text-primary">
          <Clock size={20} />
          29:59
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-secondary rounded-full mb-8 overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${((currentQuestion + 1) / mockQuiz.questions.length) * 100}%` }}
        />
      </div>

      <div className="bg-background border border-border rounded-xl p-8 shadow-sm mb-6 min-h-[300px]">
        <h2 className="text-xl font-medium text-foreground mb-6">{question.text}</h2>
        
        <div className="space-y-3">
          {question.options.map((option, idx) => {
            const isSelected = answers[question.id] === option;
            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(question.id, option)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  isSelected 
                    ? 'border-primary bg-primary/5 text-foreground font-medium' 
                    : 'border-border hover:bg-secondary/30 text-muted-foreground'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                    isSelected ? 'border-primary' : 'border-input'
                  }`}>
                    {isSelected && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={handlePrev}
          disabled={currentQuestion === 0}
          className="px-6 py-2 border border-input rounded-md font-medium text-foreground hover:bg-secondary transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        {currentQuestion === mockQuiz.questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={!answers[question.id]}
            className="px-8 py-2 bg-primary text-primary-foreground rounded-md font-bold hover:opacity-90 transition disabled:opacity-50"
          >
            Submit Quiz
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={!answers[question.id]}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default TakeQuiz;
