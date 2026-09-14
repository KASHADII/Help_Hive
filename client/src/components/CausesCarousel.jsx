import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Users, 
  Clock, 
  Flame, 
  ArrowRight,
  Heart,
  TreePine,
  Utensils,
  BookOpen,
  Dog
} from 'lucide-react'

export const CausesCarousel = ({ tasks = [], loading = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Curated high-resolution fallback causes if backend has few tasks
  const fallbackCauses = [
    {
      _id: 'cause-1',
      title: 'Mangrove Sanctuary Reforestation & Coastal Cleanup',
      category: 'Environment',
      description: 'Plant native coastal mangrove saplings to protect marine ecology and restore natural bird habitats.',
      location: 'Carter Road & Versova Beach, Mumbai',
      volunteersNeeded: 25,
      estimatedHours: 4,
      karmaPoints: 200,
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
      ngo: { organizationName: 'Coastal Green Foundation' }
    },
    {
      _id: 'cause-2',
      title: 'Community Warm Meal Kitchen & Food Packaging Drive',
      category: 'Community Service',
      description: 'Prepare fresh nutritional meals and package 600 essential care boxes for underserved families.',
      location: 'Dharavi Community Center, Mumbai',
      volunteersNeeded: 18,
      estimatedHours: 3,
      karmaPoints: 150,
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
      ngo: { organizationName: 'Annam Food Aid' }
    },
    {
      _id: 'cause-3',
      title: 'Weekend STEM & Creative Arts Mentorship for Youth',
      category: 'Education',
      description: 'Teach foundational computer basics, coding, and hands-on science experiments to bright 6th grade students.',
      location: 'Municipal Library Hub, Pune',
      volunteersNeeded: 12,
      estimatedHours: 3,
      karmaPoints: 180,
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
      ngo: { organizationName: 'BrightMinds Academy' }
    },
    {
      _id: 'cause-4',
      title: 'Stray Animal Care, Foster Grooming & Shelter Aid',
      category: 'Animal Welfare',
      description: 'Help walk rehabilitated rescue dogs, feed sheltered kittens, and assist in animal veterinary dressing.',
      location: 'City Paws Rescue Shelter, Bangalore',
      volunteersNeeded: 15,
      estimatedHours: 4,
      karmaPoints: 160,
      image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=1200&q=80',
      ngo: { organizationName: 'Haven for Strays' }
    }
  ]

  const categoryImages = {
    'Environment': 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
    'Community Service': 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
    'Education': 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
    'Animal Welfare': 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=1200&q=80',
    'default': 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=80'
  }

  // Combine backend tasks with fallback causes if tasks are empty
  const displayCauses = tasks.length > 0
    ? tasks.map(t => ({
        ...t,
        image: categoryImages[t.category] || categoryImages['default']
      }))
    : fallbackCauses

  const total = displayCauses.length

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : total - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < total - 1 ? prev + 1 : 0))
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'ArrowRight') handleNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [total])

  const activeItem = displayCauses[currentIndex]

  if (loading) {
    return (
      <div className="w-full h-[460px] rounded-3xl bg-slate-100 animate-pulse border border-slate-200" />
    )
  }

  return (
    <div className="relative w-full select-none space-y-6">
      {/* Featured Slide View */}
      <div className="relative overflow-hidden rounded-[32px] bg-white border border-[#14281D]/10 shadow-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeItem._id || currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="grid grid-cols-1 lg:grid-cols-12 min-h-[440px]"
          >
            {/* Left: Cause Photography */}
            <div className="lg:col-span-7 relative overflow-hidden min-h-[260px] lg:min-h-full">
              <img
                src={activeItem.image}
                alt={activeItem.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
              
              <div className="absolute top-4 left-4">
                <span className="font-bold text-xs px-3.5 py-1.5 rounded-full bg-white/95 text-[#14281D] shadow-sm backdrop-blur-sm">
                  {activeItem.category || 'Grassroots Cause'}
                </span>
              </div>

              <div className="absolute top-4 right-4">
                <span className="font-bold text-xs px-3 py-1.5 rounded-full bg-[#E5A93C] text-[#14281D] shadow-sm flex items-center gap-1 font-sans">
                  <Flame className="w-3.5 h-3.5 fill-[#14281D]" /> +{activeItem.karmaPoints || 150} Karma
                </span>
              </div>
            </div>

            {/* Right: Cause Details & Action */}
            <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between space-y-6 bg-white">
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#D95D39]">
                    {activeItem.ngo?.organizationName || 'Verified Non-Profit'}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#14281D] tracking-tight leading-snug">
                    {activeItem.title}
                  </h3>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {activeItem.description}
                </p>

                {/* Attributes Grid */}
                <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-slate-600 font-medium">
                  <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-[#FBF9F5] border border-slate-100">
                    <MapPin className="w-4 h-4 text-[#D95D39] shrink-0" />
                    <span className="truncate">{activeItem.location || 'Citywide'}</span>
                  </div>

                  <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-[#FBF9F5] border border-slate-100">
                    <Users className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>{activeItem.volunteersNeeded || 10} Open Spots</span>
                  </div>

                  <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-[#FBF9F5] border border-slate-100 col-span-2">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{activeItem.estimatedHours || 4} Hours Contribution • Dual-signed Certificate</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                <Link
                  to={`/tasks/${activeItem._id}`}
                  className="px-7 py-3.5 rounded-2xl bg-[#14281D] hover:bg-[#0F2418] text-white font-extrabold text-xs shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  <Heart className="w-4 h-4 fill-white text-white" />
                  <span>Volunteer for this Cause</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="text-xs font-bold text-slate-400">
                  {currentIndex + 1} of {total}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Carousel Navigation Bar & Thumbnails */}
      <div className="flex items-center justify-between gap-4 px-2">
        {/* Progress Dots / Bar */}
        <div className="flex items-center gap-2">
          {displayCauses.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                currentIndex === i
                  ? 'w-10 bg-[#14281D]'
                  : 'w-2.5 bg-slate-300 hover:bg-slate-400'
              }`}
              title={`Slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Next / Prev Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="p-3 rounded-2xl bg-white hover:bg-slate-100 text-[#14281D] border border-slate-200 shadow-sm transition-transform active:scale-90"
            title="Previous Cause (←)"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="p-3 rounded-2xl bg-white hover:bg-slate-100 text-[#14281D] border border-slate-200 shadow-sm transition-transform active:scale-90"
            title="Next Cause (→)"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
