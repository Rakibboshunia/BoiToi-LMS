import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PlayCircle, Clock, Award, Star, CheckCircle, Lock, BookOpen } from 'lucide-react';
import { getCourse } from '../../services/courseApi';
import { useAuth } from '../../context/AuthContext';

const CourseDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['course', id],
    queryFn: () => getCourse(id as string),
    enabled: !!id,
  });

  const course = data?.data;

  const handleEnroll = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/courses/${id}` } });
      return;
    }
    // In a real app, this would initiate payment or free enrollment
    navigate(`/checkout/${id}`);
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading course...</div>;
  }

  if (!course) {
    return <div className="min-h-screen flex items-center justify-center">Course not found.</div>;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <div className="bg-secondary/50 border-b border-border py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
          
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Link to="/courses" className="text-primary hover:underline">Courses</Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-muted-foreground">{course.category}</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
              {course.title}
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl">
              {course.shortDescription || course.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-1 text-orange-500 font-medium">
                <Star size={18} fill="currentColor" />
                <span className="text-lg">{course.rating?.average?.toFixed(1) || '0.0'}</span>
                <span className="text-muted-foreground font-normal">({course.rating?.count || 0} reviews)</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock size={18} />
                <span>{course.totalDuration || '10'} hours total</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground capitalize">
                <Award size={18} />
                <span>{course.level} Level</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 pt-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                {course.teacher?.avatar ? (
                  <img src={course.teacher.avatar} alt={course.teacher.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-primary font-bold">{course.teacher?.name?.charAt(0)}</span>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created by</p>
                <p className="font-medium text-foreground">{course.teacher?.name}</p>
              </div>
            </div>
          </div>

          {/* Floating Action Card */}
          <div className="w-full lg:w-[400px] shrink-0 bg-background border border-border rounded-2xl shadow-xl overflow-hidden relative lg:-mb-32 z-10">
            <div className="aspect-video bg-secondary relative">
              {course.previewVideo ? (
                 <video src={course.previewVideo} controls className="w-full h-full object-cover" />
              ) : course.thumbnail ? (
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <PlayCircle size={64} className="text-muted-foreground/50" />
                </div>
              )}
            </div>
            
            <div className="p-6 space-y-6">
              <div className="text-3xl font-bold text-foreground">
                {course.isFree ? 'Free' : `$${course.price}`}
              </div>
              
              <button 
                onClick={handleEnroll}
                className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold text-lg hover:opacity-90 transition shadow-md"
              >
                Enroll Now
              </button>
              
              <div className="space-y-3 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">This course includes:</p>
                <div className="flex items-center gap-3"><PlayCircle size={16} /> On-demand video</div>
                <div className="flex items-center gap-3"><BookOpen size={16} /> Assignments & Quizzes</div>
                <div className="flex items-center gap-3"><Clock size={16} /> Lifetime access</div>
                <div className="flex items-center gap-3"><Award size={16} /> Certificate of completion</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 py-16 flex flex-col lg:flex-row gap-12">
        <div className="flex-1 space-y-12 lg:pr-12">
          
          {/* What you'll learn */}
          {(course.whatYouLearn && course.whatYouLearn.length > 0) ? (
            <div className="bg-secondary/30 border border-border rounded-xl p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">What you'll learn</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.whatYouLearn.map((item: string, idx: number) => (
                  <div key={idx} className="flex gap-3">
                    <CheckCircle className="text-primary shrink-0" size={20} />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Course Content */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Course Content</h2>
            <div className="border border-border rounded-xl overflow-hidden bg-background">
              {(!course.modules || course.modules.length === 0) ? (
                <div className="p-8 text-center text-muted-foreground">
                  Content is being prepared for this course.
                </div>
              ) : (
                course.modules.map((mod: any, idx: number) => (
                  <div key={mod._id} className="border-b border-border last:border-0">
                    <div className="bg-secondary/50 p-4 flex justify-between items-center font-medium">
                      <span>Section {idx + 1}: {mod.title}</span>
                      <span className="text-sm text-muted-foreground font-normal">
                        {mod.lessons?.length || 0} lessons
                      </span>
                    </div>
                    {mod.lessons && mod.lessons.length > 0 && (
                      <div className="divide-y divide-border/50">
                        {mod.lessons.map((lesson: any) => (
                          <div key={lesson._id} className="p-4 flex items-center justify-between hover:bg-secondary/20 transition-colors">
                            <div className="flex items-center gap-3">
                              {lesson.type === 'video' ? <PlayCircle size={18} className="text-muted-foreground" /> : <BookOpen size={18} className="text-muted-foreground" />}
                              <span className="text-foreground">{lesson.title}</span>
                            </div>
                            {lesson.isFreePreview ? (
                              <button className="text-sm text-primary font-medium hover:underline">Preview</button>
                            ) : (
                              <Lock size={16} className="text-muted-foreground" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Description */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Description</h2>
            <div className="prose prose-slate max-w-none text-muted-foreground">
              {course.description}
            </div>
          </div>

        </div>
        
        {/* Spacer for floating card on desktop */}
        <div className="hidden lg:block w-[400px] shrink-0"></div>
      </div>
    </div>
  );
};

export default CourseDetail;
