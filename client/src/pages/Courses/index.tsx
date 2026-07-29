import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Search, Filter, BookOpen, Star } from 'lucide-react';
import { getCourses } from '../../services/courseApi';
import { motion } from 'framer-motion';

const CourseCatalog: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['public-courses'],
    queryFn: () => getCourses(),
  });

  const courses = data?.data || [];

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Header / Hero */}
      <div className="bg-primary text-primary-foreground py-16 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">Discover Your Next Skill</h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
            Explore thousands of courses taught by expert instructors. Learn at your own pace and achieve your goals.
          </p>
          
          <div className="max-w-xl mx-auto mt-8 relative flex items-center">
            <Search className="absolute left-4 text-muted-foreground" size={20} />
            <input 
              type="text" 
              placeholder="What do you want to learn?"
              className="w-full pl-12 pr-4 py-4 rounded-full text-foreground focus:outline-none shadow-lg"
            />
            <button className="absolute right-2 bg-primary text-primary-foreground px-6 py-2 rounded-full font-medium hover:opacity-90 transition">
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 shrink-0 space-y-6">
          <div className="flex items-center gap-2 font-bold text-lg border-b border-border pb-2">
            <Filter size={20} /> Filters
          </div>
          
          <div className="space-y-3">
            <h3 className="font-medium text-foreground">Category</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <label className="flex items-center gap-2 cursor-pointer hover:text-foreground">
                <input type="checkbox" className="rounded text-primary focus:ring-primary" /> Development
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:text-foreground">
                <input type="checkbox" className="rounded text-primary focus:ring-primary" /> Business
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:text-foreground">
                <input type="checkbox" className="rounded text-primary focus:ring-primary" /> Design
              </label>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium text-foreground">Level</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <label className="flex items-center gap-2 cursor-pointer hover:text-foreground">
                <input type="checkbox" className="rounded text-primary focus:ring-primary" /> Beginner
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:text-foreground">
                <input type="checkbox" className="rounded text-primary focus:ring-primary" /> Intermediate
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:text-foreground">
                <input type="checkbox" className="rounded text-primary focus:ring-primary" /> Advanced
              </label>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="flex-1">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-bold text-foreground">All Courses</h2>
            <span className="text-sm text-muted-foreground">{courses.length} results</span>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-background rounded-xl h-80 animate-pulse border border-border"></div>
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-20 bg-background rounded-xl border border-border">
              <BookOpen className="mx-auto text-muted-foreground mb-4" size={48} />
              <h3 className="text-xl font-medium text-foreground">No courses found</h3>
              <p className="text-muted-foreground mt-2">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course: any, idx: number) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={course._id} 
                >
                  <Link 
                    to={`/courses/${course._id}`}
                    className="block bg-background rounded-xl overflow-hidden border border-border hover:shadow-lg transition-shadow group h-full flex flex-col"
                  >
                    <div className="h-48 bg-secondary overflow-hidden relative">
                      {course.thumbnail ? (
                        <img 
                          src={course.thumbnail} 
                          alt={course.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <BookOpen size={48} opacity={0.5} />
                        </div>
                      )}
                      <div className="absolute top-2 left-2 bg-background/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-foreground">
                        {course.category}
                      </div>
                    </div>
                    
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-bold text-lg text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                      
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {course.shortDescription || course.description}
                      </p>
                      
                      <div className="mt-auto space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1 text-orange-500 font-medium">
                            <span>{course.rating?.average?.toFixed(1) || '0.0'}</span>
                            <Star size={14} fill="currentColor" />
                            <span className="text-muted-foreground font-normal">({course.rating?.count || 0})</span>
                          </div>
                          <span className="text-muted-foreground capitalize">{course.level}</span>
                        </div>
                        
                        <div className="flex items-center justify-between border-t border-border pt-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-secondary overflow-hidden flex items-center justify-center text-primary font-bold text-xs">
                              {course.teacher?.avatar ? (
                                <img src={course.teacher.avatar} alt={course.teacher.name} className="w-full h-full object-cover" />
                              ) : (
                                course.teacher?.name?.charAt(0)
                              )}
                            </div>
                            <span className="text-sm font-medium text-muted-foreground truncate w-24">
                              {course.teacher?.name}
                            </span>
                          </div>
                          
                          <div className="font-bold text-lg text-foreground">
                            {course.isFree ? 'Free' : `$${course.price}`}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCatalog;
