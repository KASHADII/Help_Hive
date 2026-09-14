import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Heart, TreePine, Utensils, BookOpen, Dog, X, ArrowRight } from 'lucide-react'

export const LivingTree = () => {
  const [activeNode, setActiveNode] = useState(null)

  // Real community impact blossom nodes positioned on the tree branches
  const blossomNodes = [
    {
      id: 'mangroves',
      cx: 190,
      cy: 160,
      label: 'Tree Plantation',
      icon: TreePine,
      color: '#10B981',
      impact: '1,200 Native Mangroves',
      location: 'Aarey & Coastal Mumbai',
      description: 'Greening urban coastal zones to protect biodiversity and prevent soil erosion.',
      volunteers: '48 Volunteers'
    },
    {
      id: 'meals',
      cx: 330,
      cy: 130,
      label: 'Zero Hunger',
      icon: Utensils,
      color: '#F59E0B',
      impact: '4,500 Warm Meals',
      location: 'Community Kitchens',
      description: 'Preparing fresh, hygienic food packets for daily-wage workers and children.',
      volunteers: '32 Volunteers'
    },
    {
      id: 'education',
      cx: 240,
      cy: 90,
      label: 'Youth Mentoring',
      icon: BookOpen,
      color: '#6366F1',
      impact: '180 Kids Mentored',
      location: 'Municipal Schools',
      description: 'Weekend foundational math, reading comprehension, and digital literacy classes.',
      volunteers: '24 Mentors'
    },
    {
      id: 'animals',
      cx: 380,
      cy: 220,
      label: 'Animal Rescue',
      icon: Dog,
      color: '#EC4899',
      impact: '95 Rescued Animals',
      location: 'City Animal Care Shelter',
      description: 'Rehabilitating injured street dogs, medical dressing, and foster adoptions.',
      volunteers: '18 Volunteers'
    },
    {
      id: 'community',
      cx: 130,
      cy: 240,
      label: 'Elder Smiles',
      icon: Heart,
      color: '#E06D53',
      impact: '60 Senior Citizens',
      location: 'Golden Age Home',
      description: 'Weekly companionship, storytelling, health checkup drives, and game afternoons.',
      volunteers: '15 Volunteers'
    }
  ]

  // Leaves clusters positioned across canopy
  const leafClusters = [
    { x: 170, y: 130, size: 28, rot: 15, delay: 0.1 },
    { x: 210, y: 100, size: 32, rot: -20, delay: 0.2 },
    { x: 270, y: 80, size: 36, rot: 10, delay: 0.15 },
    { x: 310, y: 100, size: 30, rot: -15, delay: 0.25 },
    { x: 350, y: 140, size: 28, rot: 25, delay: 0.3 },
    { x: 200, y: 190, size: 24, rot: -30, delay: 0.18 },
    { x: 330, y: 190, size: 26, rot: 20, delay: 0.22 },
    { x: 250, y: 140, size: 34, rot: 5, delay: 0.12 },
    { x: 290, y: 150, size: 30, rot: -8, delay: 0.28 },
    { x: 150, y: 190, size: 24, rot: 18, delay: 0.35 },
    { x: 370, y: 180, size: 22, rot: -12, delay: 0.4 }
  ]

  return (
    <div className="relative w-full max-w-[540px] aspect-[5/4] mx-auto select-none">
      {/* Ambient warm radial glow behind canopy */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-gradient-to-tr from-amber-200/40 via-emerald-100/50 to-teal-100/30 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Sunlight Spores */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-amber-400/60 pointer-events-none blur-[0.5px]"
          style={{
            left: `${20 + (i * 14)}%`,
            top: `${40 + ((i % 3) * 15)}%`
          }}
          animate={{
            y: [-10, -40, -10],
            x: [0, (i % 2 === 0 ? 8 : -8), 0],
            opacity: [0.2, 0.8, 0.2]
          }}
          transition={{
            duration: 4 + (i * 0.8),
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.6
          }}
        />
      ))}

      {/* Main Living Tree SVG */}
      <svg
        viewBox="0 0 500 420"
        className="w-full h-full drop-shadow-sm overflow-visible"
      >
        <defs>
          <linearGradient id="trunkGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#0F2418" />
            <stop offset="60%" stopColor="#1C402B" />
            <stop offset="100%" stopColor="#2A593D" />
          </linearGradient>

          <linearGradient id="canopyGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34D399" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#059669" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#065F46" stopOpacity="0.95" />
          </linearGradient>
        </defs>

        {/* Tree Roots & Base Mound */}
        <motion.ellipse
          cx="250"
          cy="385"
          rx="110"
          ry="14"
          fill="#E8DFD1"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
        />
        <path
          d="M 190 380 Q 250 395 310 380 Q 250 375 190 380 Z"
          fill="#2C523B"
          opacity="0.25"
        />

        {/* Organic Trunk & Main Branches */}
        <motion.path
          d="M 235 385 
             C 240 330, 220 280, 210 240 
             C 200 200, 160 170, 140 160
             C 175 175, 205 210, 225 240
             C 235 220, 230 170, 235 120
             C 240 155, 255 185, 270 215
             C 290 190, 310 160, 350 140
             C 320 170, 285 220, 275 255
             C 285 285, 270 340, 265 385 
             Z"
          fill="url(#trunkGrad)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />

        {/* Outer Canopy Cloud Silhouettes */}
        <motion.g
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <circle cx="200" cy="150" r="55" fill="url(#canopyGlow)" opacity="0.45" />
          <circle cx="260" cy="110" r="65" fill="url(#canopyGlow)" opacity="0.55" />
          <circle cx="320" cy="145" r="58" fill="url(#canopyGlow)" opacity="0.45" />
          <circle cx="250" cy="165" r="50" fill="url(#canopyGlow)" opacity="0.5" />
        </motion.g>

        {/* Stylized Swaying Leaves */}
        {leafClusters.map((leaf, idx) => (
          <motion.g
            key={idx}
            transform={`translate(${leaf.x}, ${leaf.y}) rotate(${leaf.rot})`}
            animate={{
              rotate: [leaf.rot - 4, leaf.rot + 4, leaf.rot - 4]
            }}
            transition={{
              duration: 3 + (idx * 0.3),
              repeat: Infinity,
              ease: 'easeInOut',
              delay: leaf.delay
            }}
          >
            <ellipse
              cx="0"
              cy="0"
              rx={leaf.size * 0.7}
              ry={leaf.size * 0.4}
              fill="#227047"
              opacity="0.85"
            />
            <ellipse
              cx="-2"
              cy="-2"
              rx={leaf.size * 0.5}
              ry={leaf.size * 0.28}
              fill="#34D399"
              opacity="0.95"
            />
          </motion.g>
        ))}

        {/* Interactive Impact Blossom Nodes */}
        {blossomNodes.map((node) => {
          const isSelected = activeNode?.id === node.id
          return (
            <g
              key={node.id}
              className="cursor-pointer group"
              onClick={() => setActiveNode(isSelected ? null : node)}
            >
              {/* Outer pulsing beacon */}
              <motion.circle
                cx={node.cx}
                cy={node.cy}
                r="18"
                fill={node.color}
                opacity="0.2"
                animate={{
                  r: [14, 22, 14],
                  opacity: [0.3, 0.05, 0.3]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />

              {/* Central Node Circle */}
              <motion.circle
                cx={node.cx}
                cy={node.cy}
                r={isSelected ? "14" : "11"}
                fill={node.color}
                stroke="#FFFFFF"
                strokeWidth="2.5"
                whileHover={{ scale: 1.25 }}
                className="transition-all"
              />

              {/* Node Center Dot */}
              <circle
                cx={node.cx}
                cy={node.cy}
                r="4"
                fill="#FFFFFF"
              />
            </g>
          )
        })}
      </svg>

      {/* Interactive Blossom Popover Card */}
      <AnimatePresence>
        {activeNode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="absolute z-20 top-4 right-2 sm:right-4 max-w-[280px] bg-white rounded-3xl p-4 sm:p-5 shadow-2xl border border-[#14281D]/10 text-[#14281D]"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-xl flex items-center justify-center text-white"
                  style={{ backgroundColor: activeNode.color }}
                >
                  <activeNode.icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">{activeNode.label}</div>
                  <div className="text-xs font-black text-[#14281D]">{activeNode.impact}</div>
                </div>
              </div>
              <button
                onClick={() => setActiveNode(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
              {activeNode.description}
            </p>

            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-500">
              <span>📍 {activeNode.location}</span>
              <span className="text-emerald-700 font-extrabold">{activeNode.volunteers}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Visual Instruction Badge */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-white/90 backdrop-blur-sm border border-[#14281D]/10 text-[11px] font-bold text-[#14281D]/80 shadow-sm flex items-center gap-1.5 pointer-events-none">
        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        <span>Click the glowing nodes to see what's growing</span>
      </div>
    </div>
  )
}
