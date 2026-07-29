import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Upload, FileText, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const SubmitAssignment: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const onSubmit = (data: any) => {
    // In a real app, upload file, then call API to save submission
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
          <h2 className="text-3xl font-bold text-foreground mb-2">Assignment Submitted!</h2>
          <p className="text-muted-foreground mb-8">Your work has been sent to the instructor for grading.</p>
          
          <button onClick={() => navigate('/student/dashboard')} className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition">
            Return to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-6">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Submit Assignment</h1>
          <p className="text-muted-foreground mt-1">Upload your work for grading.</p>
        </div>
      </div>

      <div className="bg-secondary/30 border border-border rounded-xl p-6 mb-8">
        <h3 className="font-semibold text-lg text-foreground mb-2">Instructions</h3>
        <p className="text-muted-foreground text-sm">
          Please submit your final project files as a ZIP archive. Ensure your code is well-commented. You may also include a link to your GitHub repository in the text area below.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
          Due: Tomorrow at 11:59 PM
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-background border border-border rounded-xl p-6 shadow-sm space-y-6">
        
        <div>
          <label className="block text-sm font-medium mb-1">Text Submission (Optional)</label>
          <textarea 
            {...register('content')}
            rows={4}
            className="w-full px-4 py-3 border border-input rounded-md focus:ring-2 focus:ring-primary focus:outline-none resize-none" 
            placeholder="Add any comments, links, or text required for your submission..." 
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">File Upload</label>
          <div className="border-2 border-dashed border-input rounded-xl p-8 text-center hover:bg-secondary/20 transition-colors">
            <input 
              type="file" 
              id="file-upload"
              className="hidden"
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3">
                <Upload size={24} />
              </div>
              <span className="text-sm font-medium text-foreground">
                {file ? 'Change file' : 'Click to select a file'}
              </span>
              <span className="text-xs text-muted-foreground mt-1">Maximum file size: 50MB</span>
            </label>
          </div>
          
          {file && (
            <div className="mt-4 flex items-center gap-3 p-4 bg-secondary/50 rounded-lg border border-border">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded flex items-center justify-center shrink-0">
                <FileText size={20} />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button 
                type="button" 
                onClick={() => setFile(null)}
                className="text-sm text-destructive font-medium hover:underline px-2"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-border flex justify-end">
          <button 
            type="submit" 
            disabled={!file && !register('content').name} // Need either text or file
            className="px-8 py-3 bg-primary text-primary-foreground rounded-md font-bold hover:opacity-90 transition disabled:opacity-50"
          >
            Submit Work
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubmitAssignment;
