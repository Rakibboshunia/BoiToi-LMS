import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, BookOpen, Star, Sparkles, Play } from 'lucide-react';
import { getCourses } from '../../services/courseApi';
import { motion } from 'framer-motion';

const CourseCatalog: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Filter States
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category');
  
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategory ? [initialCategory] : []);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('Newest');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ['public-courses'],
    queryFn: () => getCourses(),
  });

  const courses = data?.data || [];

  // Handlers
  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const toggleLevel = (level: string) => {
    setSelectedLevels(prev => 
      prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]
    );
  };

  const togglePrice = (price: string) => {
    setSelectedPrices(prev => 
      prev.includes(price) ? prev.filter(p => p !== price) : [...prev, price]
    );
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(searchInput);
  };

  // Derived filtered and sorted courses
  const filteredCourses = useMemo(() => {
    let result = [...courses];

    // Search filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(course => 
        course.title?.toLowerCase().includes(lowerSearch) || 
        course.description?.toLowerCase().includes(lowerSearch) ||
        course.shortDescription?.toLowerCase().includes(lowerSearch)
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter(course => selectedCategories.includes(course.category));
    }

    // Level filter
    if (selectedLevels.length > 0) {
      // Assuming course.level might be lowercase or capitalized
      result = result.filter(course => {
        const cLevel = course.level ? course.level.toLowerCase() : 'all levels';
        return selectedLevels.some(l => cLevel.includes(l.toLowerCase()));
      });
    }

    // Price filter
    if (selectedPrices.length > 0) {
      result = result.filter(course => {
        if (selectedPrices.includes('Free') && course.isFree) return true;
        if (selectedPrices.includes('Paid') && !course.isFree) return true;
        return false;
      });
    }

    // Sorting
    if (sortBy === 'Newest') {
      result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    } else if (sortBy === 'Highest Rated') {
      result.sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0));
    } else if (sortBy === 'Most Popular') {
      result.sort((a, b) => (b.enrolledStudents?.length || 0) - (a.enrolledStudents?.length || 0));
    }

    return result;
  }, [courses, searchTerm, selectedCategories, selectedLevels, selectedPrices, sortBy]);

  return (
    <div className="min-h-screen bg-[#0a0a0e] text-slate-200 font-sans selection:bg-indigo-500/30">
      
      {/* Simplified Navbar */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#0a0a0e]/80 backdrop-blur-md border-b border-white/10 py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-lg shadow-white/10 group-hover:shadow-white/20 transition-all overflow-hidden shrink-0">
              <img src="/logo.png" alt="BoiToi" className="w-8 h-8 object-contain" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-white">
              Boi<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Toi</span>
            </span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Home</Link>
            <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Log in</Link>
            <Link to="/register" className="px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/25">
              Sign up
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero / Header */}
      <div className="relative pt-32 pb-20 px-6 overflow-hidden border-b border-white/10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
        
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-2">
            <BookOpen size={14} />
            Course Catalog
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
            Discover Your Next <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Skill</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Explore thousands of courses taught by expert instructors. Learn at your own pace and achieve your goals.
          </p>
          
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mt-10 relative flex items-center bg-white/5 border border-white/10 rounded-full p-1.5 focus-within:bg-white/10 focus-within:border-indigo-500/50 transition-all shadow-2xl">
            <Search className="absolute left-6 text-slate-400" size={20} />
            <input 
              type="text" 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="What do you want to learn?"
              className="w-full bg-transparent pl-14 pr-32 py-4 outline-none text-white placeholder:text-slate-500"
            />
            <button type="submit" className="absolute right-2 bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20">
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-[#12121a] border border-white/10 rounded-3xl p-6 sticky top-24">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2 font-bold text-xl text-white">
                <Filter size={20} className="text-indigo-400" /> Filters
              </div>
              {(selectedCategories.length > 0 || selectedLevels.length > 0 || selectedPrices.length > 0 || searchTerm) && (
                <button 
                  onClick={() => {
                    setSelectedCategories([]);
                    setSelectedLevels([]);
                    setSelectedPrices([]);
                    setSearchTerm('');
                    setSearchInput('');
                  }} 
                  className="text-xs text-slate-400 hover:text-white transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-300">Category</h3>
                <div className="space-y-3 text-sm text-slate-400">
                  {['Web Development', 'Data Science', 'AI & ML', 'Mobile Dev', 'DevOps & Cloud', 'Cybersecurity'].map(cat => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`relative flex items-center justify-center w-5 h-5 rounded border ${selectedCategories.includes(cat) ? 'border-indigo-400 bg-indigo-500/20' : 'border-white/20 bg-black/20 group-hover:border-indigo-400'} transition-colors`}>
                        <input 
                          type="checkbox" 
                          checked={selectedCategories.includes(cat)}
                          onChange={() => toggleCategory(cat)}
                          className="opacity-0 absolute inset-0 cursor-pointer" 
                        />
                        <div className={`w-2.5 h-2.5 bg-indigo-400 rounded-sm ${selectedCategories.includes(cat) ? 'opacity-100' : 'opacity-0'} transition-opacity`}></div>
                      </div>
                      <span className="group-hover:text-slate-200 transition-colors">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-slate-300">Level</h3>
                <div className="space-y-3 text-sm text-slate-400">
                  {['Beginner', 'Intermediate', 'Advanced'].map(level => (
                    <label key={level} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`relative flex items-center justify-center w-5 h-5 rounded border ${selectedLevels.includes(level) ? 'border-indigo-400 bg-indigo-500/20' : 'border-white/20 bg-black/20 group-hover:border-indigo-400'} transition-colors`}>
                        <input 
                          type="checkbox" 
                          checked={selectedLevels.includes(level)}
                          onChange={() => toggleLevel(level)}
                          className="opacity-0 absolute inset-0 cursor-pointer" 
                        />
                        <div className={`w-2.5 h-2.5 bg-indigo-400 rounded-sm ${selectedLevels.includes(level) ? 'opacity-100' : 'opacity-0'} transition-opacity`}></div>
                      </div>
                      <span className="group-hover:text-slate-200 transition-colors">{level}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-300">Price</h3>
                <div className="space-y-3 text-sm text-slate-400">
                  {['Paid', 'Free'].map(price => (
                    <label key={price} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`relative flex items-center justify-center w-5 h-5 rounded border ${selectedPrices.includes(price) ? 'border-indigo-400 bg-indigo-500/20' : 'border-white/20 bg-black/20 group-hover:border-indigo-400'} transition-colors`}>
                        <input 
                          type="checkbox" 
                          checked={selectedPrices.includes(price)}
                          onChange={() => togglePrice(price)}
                          className="opacity-0 absolute inset-0 cursor-pointer" 
                        />
                        <div className={`w-2.5 h-2.5 bg-indigo-400 rounded-sm ${selectedPrices.includes(price) ? 'opacity-100' : 'opacity-0'} transition-opacity`}></div>
                      </div>
                      <span className="group-hover:text-slate-200 transition-colors">{price}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="flex-1">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-white">
              {searchTerm ? `Results for "${searchTerm}"` : 'All Courses'}
            </h2>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-slate-400">{filteredCourses.length} results</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#12121a] border border-white/10 text-white rounded-lg px-3 py-2 outline-none focus:border-indigo-500 transition-colors appearance-none pr-8 relative cursor-pointer"
              >
                <option>Newest</option>
                <option>Most Popular</option>
                <option>Highest Rated</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white/5 rounded-2xl h-96 animate-pulse border border-white/10"></div>
              ))}
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 border-dashed">
              <BookOpen className="mx-auto text-slate-500 mb-4" size={48} />
              <h3 className="text-xl font-bold text-white">No courses found</h3>
              <p className="text-slate-400 mt-2">Try adjusting your filters or search terms</p>
              {(selectedCategories.length > 0 || selectedLevels.length > 0 || selectedPrices.length > 0 || searchTerm) && (
                <button 
                  onClick={() => {
                    setSelectedCategories([]);
                    setSelectedLevels([]);
                    setSelectedPrices([]);
                    setSearchTerm('');
                    setSearchInput('');
                  }}
                  className="mt-6 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-full transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCourses.map((course: any, idx: number) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={course._id} 
                >
                  <Link 
                    to={`/courses/${course._id}`}
                    className="block group h-full flex flex-col bg-[#12121a] rounded-2xl overflow-hidden border border-white/10 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300"
                  >
                    <div className="relative aspect-video overflow-hidden bg-[#1a1a24]">
                      {course.thumbnail ? (
                        <img 
                          src={course.thumbnail} 
                          alt={course.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen size={40} className="text-white/10" />
                        </div>
                      )}
                      {/* Overlay badges */}
                      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white border border-white/10">
                        {course.category}
                      </div>
                      <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-xs font-bold text-white flex items-center gap-1 border border-white/10">
                        <Play size={12} className="text-indigo-400" />
                        {course.sections?.reduce((acc: number, sec: any) => acc + sec.lessons?.length || 0, 0) || 0} Lessons
                      </div>
                    </div>
                    
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="flex items-center gap-1 text-amber-400 text-sm font-bold">
                          <Star size={14} fill="currentColor" />
                          {course.rating?.average?.toFixed(1) || '0.0'}
                        </span>
                        <span className="text-slate-500 text-xs">({course.rating?.count || 0} reviews)</span>
                        <span className="ml-auto text-[10px] uppercase font-bold tracking-wider text-slate-500 bg-white/5 px-2 py-1 rounded">
                          {course.level || 'All Levels'}
                        </span>
                      </div>
                      
                      <h3 className="font-bold text-lg text-white line-clamp-2 mb-2 group-hover:text-indigo-400 transition-colors leading-tight">
                        {course.title}
                      </h3>
                      
                      <p className="text-sm text-slate-400 mb-4 line-clamp-2 flex-1">
                        {course.shortDescription || course.description}
                      </p>
                      
                      <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-[10px] font-bold text-white shadow-inner">
                            {course.instructor?.name?.charAt(0) || course.teacher?.name?.charAt(0) || 'I'}
                          </div>
                          <span className="text-xs font-medium text-slate-300 truncate max-w-[100px]">
                            {course.instructor?.name || course.teacher?.name || 'Instructor'}
                          </span>
                        </div>
                        
                        <div className="font-extrabold text-white text-lg">
                          {course.isFree ? <span className="text-emerald-400">Free</span> : `$${course.price}`}
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
