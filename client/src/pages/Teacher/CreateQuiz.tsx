import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';

const CreateQuiz: React.FC = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([{ id: Date.now(), text: '', options: [{ text: '', isCorrect: true }, { text: '', isCorrect: false }] }]);

  const addQuestion = () => {
    setQuestions([...questions, { id: Date.now(), text: '', options: [{ text: '', isCorrect: true }, { text: '', isCorrect: false }] }]);
  };

  const removeQuestion = (id: number) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const addOption = (questionId: number) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return { ...q, options: [...q.options, { text: '', isCorrect: false }] };
      }
      return q;
    }));
  };

  const removeOption = (questionId: number, optionIdx: number) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const newOptions = [...q.options];
        newOptions.splice(optionIdx, 1);
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit the payload to the backend via createQuiz API
    alert('Quiz saved successfully! (Demo)');
    navigate('/teacher/courses');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Create Quiz</h1>
            <p className="text-muted-foreground mt-1">Build an assessment for your course.</p>
          </div>
        </div>
        
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition"
        >
          <Save size={18} />
          Publish Quiz
        </button>
      </div>

      <div className="bg-background border border-border rounded-xl p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Quiz Title</label>
            <input type="text" className="w-full px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:outline-none" placeholder="e.g. React Hooks Assessment" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Time Limit (minutes)</label>
            <input type="number" defaultValue={30} className="w-full px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:outline-none" />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {questions.map((q, idx) => (
          <div key={q.id} className="bg-background border border-border rounded-xl p-6 shadow-sm relative group">
            <button 
              onClick={() => removeQuestion(q.id)}
              className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
            >
              <Trash2 size={18} />
            </button>
            
            <h3 className="font-semibold text-lg mb-4">Question {idx + 1}</h3>
            
            <div className="mb-6">
              <input type="text" className="w-full px-4 py-3 border border-input rounded-md focus:ring-2 focus:ring-primary focus:outline-none font-medium" placeholder="Type your question here..." />
            </div>

            <div className="space-y-3">
              {q.options.map((opt, optIdx) => (
                <div key={optIdx} className="flex items-center gap-3">
                  <input type="radio" name={`correct-${q.id}`} defaultChecked={opt.isCorrect} className="w-4 h-4 text-primary focus:ring-primary border-input" />
                  <input type="text" className="flex-1 px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:outline-none" placeholder={`Option ${optIdx + 1}`} />
                  {q.options.length > 2 && (
                    <button onClick={() => removeOption(q.id, optIdx)} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button onClick={() => addOption(q.id)} className="mt-4 text-sm font-medium text-primary hover:underline flex items-center gap-1">
              <Plus size={16} /> Add Option
            </button>
          </div>
        ))}

        <button onClick={addQuestion} className="w-full py-4 border-2 border-dashed border-primary text-primary rounded-xl font-medium hover:bg-primary/5 transition flex items-center justify-center gap-2">
          <Plus size={20} />
          Add New Question
        </button>
      </div>
    </div>
  );
};

export default CreateQuiz;
