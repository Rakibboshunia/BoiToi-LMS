import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Upload, Paperclip } from 'lucide-react';

const CreateAssignment: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const onSubmit = (data: any) => {
    // In a real app, you would upload files to Cloudinary here, get the URLs, 
    // and submit the full payload via assignmentApi.createAssignment
    alert('Assignment created! (Demo)');
    navigate('/teacher/courses');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Create Assignment</h1>
          <p className="text-muted-foreground mt-1">Assign coursework and projects to your students.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-background border border-border rounded-xl p-6 shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Assignment Title</label>
          <input 
            type="text" 
            {...register('title', { required: true })}
            className="w-full px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:outline-none" 
            placeholder="e.g. Final Project Submission" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Instructions / Description</label>
          <textarea 
            {...register('description', { required: true })}
            rows={5}
            className="w-full px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:outline-none resize-none" 
            placeholder="Provide clear instructions for what the students need to do..." 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Due Date</label>
            <input 
              type="date" 
              {...register('dueDate', { required: true })}
              className="w-full px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:outline-none bg-background" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Maximum Score</label>
            <input 
              type="number" 
              defaultValue={100}
              {...register('maxScore')}
              className="w-full px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:outline-none" 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Attachments (Optional)</label>
          <div className="border-2 border-dashed border-input rounded-xl p-8 text-center hover:bg-secondary/20 transition-colors">
            <input 
              type="file" 
              id="file-upload"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3">
                <Upload size={24} />
              </div>
              <span className="text-sm font-medium text-foreground">Click to upload files</span>
              <span className="text-xs text-muted-foreground mt-1">PDF, DOCX, ZIP (Max 10MB)</span>
            </label>
          </div>
          
          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              {files.map((file, idx) => (
                <div key={idx} className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg text-sm">
                  <Paperclip size={16} className="text-muted-foreground" />
                  <span className="flex-1 truncate">{file.name}</span>
                  <span className="text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-border flex justify-end gap-3">
          <button type="button" onClick={() => navigate(-1)} className="px-6 py-2 border border-input rounded-md font-medium hover:bg-secondary transition">
            Cancel
          </button>
          <button type="submit" className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition">
            Create Assignment
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAssignment;
