import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Heart, 
  Sparkles, 
  ArrowRight, 
  Users, 
  Building2, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Flame, 
  Compass, 
  Sliders, 
  Award,
  TreePine,
  Utensils,
  BookOpen,
  Dog,
  ShieldCheck,
  Smile,
  ChevronDown
} from 'lucide-react'
import { tasksAPI } from '../lib/api'
import { LivingTree } from '../components/LivingTree'
import { CausesCarousel } from '../components/CausesCarousel'

export const Home = () => {
  const [tasks, setTasks] = useState([])
  const [loadingTasks, setLoadingTasks] = useState(true)
  const [hoursPledged, setHoursPledged] = useState(4)
  const [activeStoryStage, setActiveStoryStage] = useState(0)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoadingTasks(true)
        const response = await tasksAPI.getAll({ limit: 6 })
        if (response && response.data) {
          setTasks(response.data)
        }
      } catch (err) {
        console.error('Error fetching home tasks:', err)
      } finally {
        setLoadingTasks(false)
      }
    }
    fetchTasks()
  }, [])

  // Story stages
  const storyStages = [
    {
      step: '01',
      title: 'A Single Decision to Show Up',
      quote: 'It starts with one person choosing to give 3 hours on a Saturday.',
      description: 'You sign up for a local mangrove planting or community soup kitchen. It feels like a small afternoon, but it breaks the barrier of passive intent into living action.',
      highlight: '1 Volunteer • 3 Hours Pledged',
      image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=800&q=80'
    },
    {
      step: '02',
      title: 'The Ripple Begins to Spread',
      quote: 'Ten hands together turn a chore into a celebration of community.',
      description: 'You work alongside local residents, students, and grassroots NGO coordinators. 200 saplings get planted in two hours. Fresh hot meals are packaged and distributed with dignity.',
      highlight: '25 Volunteers • 200 Trees Planted',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80'
    },
    {
      step: '03',
      title: 'A Living Community Forest',
      quote: 'Over months, repeated small acts become lasting neighborhood transformation.',
      description: 'Grassroots NGOs get the dependable help they need. Volunteers build verifiable service records for their careers. Children get educated, parks thrive, and communities flourish.',
      highlight: '12,000+ Hours • Verified Social Impact',
      image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=800&q=80'
    }
  ]

  // Calculated community impact
  const calculatedMeals = hoursPledged * 8
  const calculatedTrees = hoursPledged * 3
  const calculatedSmiles = hoursPledged * 4
  const calculatedKarma = hoursPledged * 50

  return (
    <div className="relative min-h-screen bg-[#FBF9F5] text-[#14281D] overflow-x-hidden selection:bg-[#E5A93C]/30">
      
      {/* =========================================================================
          SECTION 1: SIGNATURE HERO — "THE LIVING IMPACT TREE"
      ========================================================================= */}
      <section className="relative pt-8 pb-20 md:pt-16 md:pb-28 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Asymmetric Editorial Copy */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Organic Eyebrow Tag */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E8F2EC] border border-[#C5DFD0] text-[#163B25] text-xs font-bold"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D95D39]" />
              <span>Small acts. Living impact.</span>
            </motion.div>

            {/* Main Editorial Mixed Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-[#14281D] leading-[1.08]"
            >
              Empowering{' '}
              <span className="font-serif italic font-normal text-[#D95D39]">
                citizens
              </span>{' '}
              to grow something{' '}
              <span className="font-serif italic font-normal text-[#1A5336]">
                good.
              </span>
            </motion.h1>

            {/* Subhead */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-slate-600 max-w-xl font-normal leading-relaxed"
            >
              Volunteering is not an event on a calendar—it is a seed you plant in your community. Connect with verified grassroots NGOs and see how a few hours of your time grow real change.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <Link
                to="/tasks"
                className="px-8 py-4 rounded-2xl bg-[#14281D] hover:bg-[#0F2418] text-white font-extrabold text-sm shadow-xl shadow-[#14281D]/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5"
              >
                <Heart className="w-4 h-4 fill-white text-white" />
                <span>Find Your Cause</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="#how-it-works"
                className="px-7 py-4 rounded-2xl bg-white hover:bg-slate-50 text-[#14281D] font-bold text-sm border border-[#14281D]/15 shadow-sm transition-all flex items-center gap-2"
              >
                <span>How HelpHive Works</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </a>
            </motion.div>

            {/* Trust Badges */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-700" /> 100% NGO Verified</span>
              <span>•</span>
              <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-amber-600" /> Official Service Certificates</span>
              <span>•</span>
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-indigo-600" /> 2,400+ Active Volunteers</span>
            </div>
          </div>

          {/* Right: The Living Impact Tree Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="lg:col-span-5"
          >
            <LivingTree />
          </motion.div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: FEATURED CAUSES CAROUSEL — "FIND SOMETHING WORTH SHOWING UP FOR"
      ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-[#14281D]/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D95D39] bg-[#FDF0EC] px-3 py-1 rounded-full border border-[#F8CCC0]">
              Featured Causes
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#14281D] tracking-tight">
              Find something worth{' '}
              <span className="font-serif italic font-normal text-[#D95D39]">
                showing up
              </span>{' '}
              for.
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl">
              Swipe or use your arrow keys to explore urgent volunteering opportunities hosted by verified non-profits.
            </p>
          </div>

          <Link
            to="/tasks"
            className="inline-flex items-center gap-2 text-sm font-extrabold text-[#14281D] hover:text-[#D95D39] transition-colors"
          >
            <span>Explore all open causes</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Large Editorial Causes Carousel */}
        <CausesCarousel tasks={tasks} loading={loadingTasks} />
      </section>

      {/* =========================================================================
          SECTION 3: WHY HELPHIVE EXISTS (EDITORIAL NARRATIVE)
      ========================================================================= */}
      <section className="py-24 px-4 sm:px-6 max-w-7xl mx-auto bg-[#F4EFE6] rounded-[36px] my-10 border border-[#14281D]/10">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="space-y-4 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1A5336] bg-[#E8F2EC] px-3 py-1 rounded-full">
              Our Belief
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#14281D] tracking-tight leading-tight">
              Most people want to help.{' '}
              <span className="font-serif italic font-normal text-[#D95D39]">
                They just don't know where to start.
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-5 text-slate-700 leading-relaxed text-sm sm:text-base">
              <p>
                Every weekend in our cities, grassroots non-profits run out of volunteer hands to sort meals, teach children, and clean coastlines.
              </p>
              <p>
                Meanwhile, thousands of students and working professionals want to give back—but get lost in outdated WhatsApp groups, unverified claims, and confusing event schedules.
              </p>
              <p className="font-semibold text-[#14281D]">
                HelpHive bridges that gap: one trusted platform connecting honest intentions with verified grassroots missions.
              </p>
            </div>

            <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white h-80">
              <img
                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=800&q=80"
                alt="Volunteers joining hands"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                <p className="font-serif italic text-lg text-amber-200">"Alone we can do so little; together we can grow so much."</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: SIGNATURE SCROLL STORY — "FROM ONE SEED TO A LIVING FOREST"
      ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-[#14281D]/10">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D95D39] bg-[#FDF0EC] px-3 py-1 rounded-full">
            The Growth Journey
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#14281D] tracking-tight">
            How One Small Act{' '}
            <span className="font-serif italic font-normal text-[#1A5336]">
              Becomes a Forest
            </span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Click through the stages of what happens when you decide to show up.
          </p>
        </div>

        {/* 3 Interactive Stages */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Stage Pickers */}
          <div className="lg:col-span-5 space-y-4">
            {storyStages.map((stage, idx) => {
              const isSelected = activeStoryStage === idx
              return (
                <button
                  key={stage.step}
                  onClick={() => setActiveStoryStage(idx)}
                  className={`w-full text-left p-6 rounded-3xl border transition-all duration-300 space-y-2 ${
                    isSelected
                      ? 'bg-white border-[#14281D] shadow-lg shadow-[#14281D]/5 scale-[1.02]'
                      : 'bg-white/60 hover:bg-white border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif italic text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#E8F2EC] text-[#163B25]">
                      Stage {stage.step}
                    </span>
                    <span className="text-xs font-bold text-[#D95D39]">{stage.highlight}</span>
                  </div>
                  <h4 className="font-extrabold text-lg text-[#14281D]">{stage.title}</h4>
                  <p className="text-xs text-slate-500 font-serif italic">"{stage.quote}"</p>
                </button>
              )
            })}
          </div>

          {/* Right: Stage Deep-Dive Card */}
          <div className="lg:col-span-7">
            <motion.div
              key={activeStoryStage}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="bg-white rounded-[32px] overflow-hidden border border-[#14281D]/10 shadow-xl h-full flex flex-col justify-between"
            >
              <div className="h-64 relative overflow-hidden">
                <img
                  src={storyStages[activeStoryStage].image}
                  alt={storyStages[activeStoryStage].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/90 text-[#14281D]">
                    {storyStages[activeStoryStage].highlight}
                  </span>
                </div>
              </div>

              <div className="p-8 space-y-4">
                <h3 className="text-2xl font-extrabold text-[#14281D]">
                  {storyStages[activeStoryStage].title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {storyStages[activeStoryStage].description}
                </p>
                <div className="pt-2 flex items-center justify-between text-xs font-bold text-emerald-800">
                  <span>Verified NGO Collaboration</span>
                  <span>100% Grassroots Impact</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: HOW IT WORKS (CONNECTED JOURNEY)
      ========================================================================= */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-[#14281D]/10">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#1A5336] bg-[#E8F2EC] px-3 py-1 rounded-full">
            The Volunteer Process
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#14281D] tracking-tight">
            How It Works in{' '}
            <span className="font-serif italic font-normal text-[#D95D39]">
              4 Simple Steps
            </span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            No friction, no confusion. Just showing up and creating change.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="bg-white p-7 rounded-[28px] border border-slate-200/80 shadow-md space-y-4 relative">
            <div className="w-12 h-12 rounded-2xl bg-[#E8F2EC] text-[#163B25] font-serif italic text-xl font-bold flex items-center justify-center">
              1
            </div>
            <h3 className="font-extrabold text-lg text-[#14281D]">Discover a Cause</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Filter opportunities by your passion—tree planting, food drives, teaching, or shelter care—in your city.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-7 rounded-[28px] border border-slate-200/80 shadow-md space-y-4 relative">
            <div className="w-12 h-12 rounded-2xl bg-[#FDF0EC] text-[#B84725] font-serif italic text-xl font-bold flex items-center justify-center">
              2
            </div>
            <h3 className="font-extrabold text-lg text-[#14281D]">Sign Up in Seconds</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Click volunteer. The NGO coordinator gets notified and sends you event briefing and location details.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-7 rounded-[28px] border border-slate-200/80 shadow-md space-y-4 relative">
            <div className="w-12 h-12 rounded-2xl bg-[#FDF6E8] text-[#A36B15] font-serif italic text-xl font-bold flex items-center justify-center">
              3
            </div>
            <h3 className="font-extrabold text-lg text-[#14281D]">Show Up & Give Time</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Arrive at the event, meet passionate fellow volunteers, and spend a meaningful morning giving back.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-7 rounded-[28px] border border-slate-200/80 shadow-md space-y-4 relative">
            <div className="w-12 h-12 rounded-2xl bg-[#E8F2EC] text-[#163B25] font-serif italic text-xl font-bold flex items-center justify-center">
              4
            </div>
            <h3 className="font-extrabold text-lg text-[#14281D]">Verified Certificate</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The NGO digitally verifies your service hours. Earn karma points and export official certificates for your resume.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: LIVING IMPACT ESTIMATOR
      ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="p-8 sm:p-14 rounded-[36px] bg-[#14281D] text-white shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Slider */}
            <div className="lg:col-span-6 space-y-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold border border-white/10">
                <Sliders className="w-3.5 h-3.5" /> Impact Visualizer
              </span>

              <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Give a little time.{' '}
                <span className="font-serif italic font-normal text-amber-300">
                  See what it can grow.
                </span>
              </h3>

              <p className="text-slate-300 text-sm leading-relaxed">
                Even 2 to 4 hours over a weekend creates ripples of positivity in a family's life. Slide to calculate your estimated monthly community output:
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300 font-semibold">Weekly Commitment:</span>
                  <span className="font-serif italic font-bold text-amber-400 text-xl">{hoursPledged} Hours / Week</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  step="1"
                  value={hoursPledged}
                  onChange={(e) => setHoursPledged(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#D95D39]"
                />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>1 hr (Weekend Helper)</span>
                  <span>7 hrs (Active Volunteer)</span>
                  <span>15 hrs (Community Leader)</span>
                </div>
              </div>
            </div>

            {/* Right Metrics */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-6 rounded-3xl bg-white/10 border border-white/10 backdrop-blur-sm space-y-1">
                <div className="text-3xl font-extrabold text-amber-300">{calculatedMeals}</div>
                <div className="text-xs font-bold text-slate-200">Warm Meals Served</div>
                <div className="text-[11px] text-slate-400">Monthly Aid</div>
              </div>

              <div className="p-6 rounded-3xl bg-white/10 border border-white/10 backdrop-blur-sm space-y-1">
                <div className="text-3xl font-extrabold text-emerald-300">{calculatedTrees}</div>
                <div className="text-xs font-bold text-slate-200">Saplings Planted</div>
                <div className="text-[11px] text-slate-400">Green Canopy</div>
              </div>

              <div className="p-6 rounded-3xl bg-white/10 border border-white/10 backdrop-blur-sm space-y-1">
                <div className="text-3xl font-extrabold text-rose-300">+{calculatedKarma}</div>
                <div className="text-xs font-bold text-slate-200">Karma Points</div>
                <div className="text-[11px] text-slate-400">Verified Service</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: FINAL CALLOUT & FOOTER
      ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto text-center">
        <div className="p-10 sm:p-16 rounded-[36px] bg-gradient-to-r from-[#14281D] via-[#1A3F2C] to-[#14281D] text-white shadow-2xl space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Be the reason something{' '}
            <span className="font-serif italic font-normal text-amber-300">
              good grows
            </span>{' '}
            this week.
          </h2>
          <p className="text-white/85 text-base max-w-xl mx-auto font-normal">
            Join thousands of volunteers and verified non-profits operating across your city.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/register"
              className="px-8 py-4 rounded-2xl bg-[#D95D39] hover:bg-[#C84B27] text-white font-extrabold text-sm shadow-xl shadow-orange-950/30 hover:scale-105 transition-all flex items-center gap-2"
            >
              <span>Join as a Volunteer</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/ngo-register"
              className="px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all"
            >
              Register an NGO Partner
            </Link>
          </div>
        </div>
      </section>

      {/* Minimalist Natural Footer */}
      <footer className="border-t border-[#14281D]/10 bg-white py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-[#14281D] flex items-center justify-center text-white font-bold text-xs">
              <Heart className="w-4 h-4 fill-white" />
            </div>
            <span className="font-extrabold text-[#14281D] text-sm">HelpHive</span>
            <span>— Small acts. Living impact.</span>
          </div>

          <div className="flex items-center gap-6 font-bold text-slate-700">
            <Link to="/tasks" className="hover:text-[#D95D39] transition-colors">Find Causes</Link>
            <Link to="/ngo-login" className="hover:text-[#D95D39] transition-colors">NGO Portal</Link>
            <Link to="/admin/login" className="hover:text-[#D95D39] transition-colors">Admin Gateway</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}