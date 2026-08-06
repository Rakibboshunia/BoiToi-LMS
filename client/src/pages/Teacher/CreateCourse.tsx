import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCourse } from '../../services/courseApi';
import { ArrowLeft } from 'lucide-react';

const courseSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }),
  category: z.string().min(1, { message: "Category is required" }),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  price: z.number().min(0),
  isFree: z.boolean().default(false),
});

type CourseFormValues = z.infer<typeof courseSchema>;

const CreateCourse: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CourseFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(courseSchema) as any,
    defaultValues: {
      level: 'beginner',
      price: 0,
      isFree: false,
    }
  });

  const isFree = watch('isFree');

  const mutation = useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-courses'] });
      navigate('/teacher/courses');
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || "Failed to create course");
    }
  });

  const onSubmit = (data: CourseFormValues) => {
    mutation.mutate(data);
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
          <h1 className="text-2xl font-bold text-foreground">Create New Course</h1>
          <p className="text-muted-foreground mt-1">Fill in the details to start building your course.</p>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit as any)} className="bg-background border border-border rounded-xl shadow-sm p-6 space-y-6">
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b border-border pb-2">Basic Information</h3>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Course Title</label>
            <input
              type="text"
              {...register("title")}
              className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g. Advanced Web Development 2026"
            />
            {errors.title && <p className="text-destructive text-xs mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Description</label>
            <textarea
              {...register("description")}
              rows={4}
              className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              placeholder="What is this course about?"
            />
            {errors.description && <p className="text-destructive text-xs mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Category</label>
              <select
                {...register("category")}
                className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
              >
                <option value="">Select category</option>
                <option value="Web Development">Web Development</option>
                <option value="Data Science">Data Science</option>
                <option value="AI & ML">AI & ML</option>
                <option value="Mobile Dev">Mobile Dev</option>
                <option value="DevOps & Cloud">DevOps & Cloud</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Software Testing">Software Testing</option>
                <option value="System Design">System Design</option>
              </select>
              {errors.category && <p className="text-destructive text-xs mt-1">{errors.category.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Level</label>
              <select
                {...register("level")}
                className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              {errors.level && <p className="text-destructive text-xs mt-1">{errors.level.message}</p>}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b border-border pb-2">Pricing</h3>
          
          <div className="flex items-center gap-2 mb-4">
            <input 
              type="checkbox" 
              id="isFree"
              {...register("isFree")}
              className="w-4 h-4 text-primary rounded border-input focus:ring-primary"
            />
            <label htmlFor="isFree" className="text-sm font-medium text-foreground">Make this course free</label>
          </div>

          {!isFree && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Price (USD)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register("price", { valueAsNumber: true })}
                  className="w-full pl-8 pr-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="29.99"
                />
              </div>
              {errors.price && <p className="text-destructive text-xs mt-1">{errors.price.message}</p>}
            </div>
          )}
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 border border-input rounded-md font-medium hover:bg-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition-opacity min-w-[120px]"
          >
            {mutation.isPending ? "Saving..." : "Create Course"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCourse;
