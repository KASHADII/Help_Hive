import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Mail, 
  MapPin, 
  Edit, 
  Save, 
  X, 
  Flame, 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  Heart,
  Calendar,
  Clock
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export const Profile = () => {
  const { currentUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const [profileData, setProfileData] = useState({
    name: currentUser?.name || 'Alex Morgan',
    email: currentUser?.email || 'alex.morgan@university.edu',
    phone: currentUser?.phone || '+1 (555) 349-2810',
    location: currentUser?.location || 'San Francisco, CA',
    bio: currentUser?.bio || 'Passionate volunteer dedicated to tree planting, zero-hunger food drives, and tutoring kids.',
    skills: currentUser?.skills || ['First Aid', 'Youth Tutoring', 'Photography', 'Meal Packaging', 'Social Media'],
    karmaPoints: currentUser?.karmaPoints || 450,
    hoursCompleted: currentUser?.totalHours || 24
  })

  const [skillInput, setSkillInput] = useState('')

  const handleAddSkill = (e) => {
    e.preventDefault()
    if (skillInput.trim() && !profileData.skills.includes(skillInput.trim())) {
      setProfileData({ ...profileData, skills: [...profileData.skills, skillInput.trim()] })
      setSkillInput('')
    }
  }

  const handleRemoveSkill = (s) => {
    setProfileData({ ...profileData, skills: profileData.skills.filter(x => x !== s) })
  }

  const handleSave = () => {
    setIsEditing(false)
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-800 py-10 px-4 sm:px-6 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600">
            <Heart className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>MY VOLUNTEER PASSPORT</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Volunteer Profile & Recognition
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Track your verified community service hours, earned badges, and karma score.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Profile</span>
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-5 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200 transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>
      </div>

      {savedSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile changes saved successfully!</span>
        </motion.div>
      )}

      {/* Main Passport Card */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-orange-500/20">
              {profileData.name.charAt(0)}
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                {profileData.name}
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Verified Helper
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-medium flex items-center gap-2">
                <span>{profileData.email}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-amber-500" /> {profileData.location}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="text-right">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Karma Score</div>
              <div className="text-2xl font-black text-amber-600 flex items-center justify-end gap-1">
                <Flame className="w-4 h-4 fill-amber-500" /> {profileData.karmaPoints}
              </div>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div className="text-left">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Hours Given</div>
              <div className="text-2xl font-black text-slate-900">{profileData.hoursCompleted}h</div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700">About Me & Why I Volunteer</label>
          {isEditing ? (
            <textarea
              rows={3}
              value={profileData.bio}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
            />
          ) : (
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
              {profileData.bio}
            </p>
          )}
        </div>

        <div className="space-y-3 pt-2">
          <label className="text-xs font-bold text-slate-700">Skills & Interests</label>
          <div className="flex flex-wrap gap-2">
            {profileData.skills.map((skill) => (
              <span
                key={skill}
                className="px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900 flex items-center gap-1.5"
              >
                <span>{skill}</span>
                {isEditing && (
                  <button onClick={() => handleRemoveSkill(skill)} className="hover:text-rose-600">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
          </div>

          {isEditing && (
            <form onSubmit={handleAddSkill} className="flex gap-2 max-w-sm pt-2">
              <input
                type="text"
                placeholder="Add another skill..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-2xl bg-amber-500 text-white font-bold text-xs shadow-sm"
              >
                Add
              </button>
            </form>
          )}
        </div>

        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" /> Earned Badges & Recognition
            </label>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">LEVEL 2 CHAMPION</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-center space-y-1">
              <div className="text-2xl">🌱</div>
              <div className="font-extrabold text-xs text-emerald-900">Green Thumb</div>
              <div className="text-[10px] text-emerald-700 font-medium">10 hrs Forestry</div>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-center space-y-1">
              <div className="text-2xl">🍲</div>
              <div className="font-extrabold text-xs text-amber-900">Meal Hero</div>
              <div className="text-[10px] text-amber-700 font-medium">Food Relief</div>
            </div>
            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-center space-y-1">
              <div className="text-2xl">📚</div>
              <div className="font-extrabold text-xs text-indigo-900">Young Mentor</div>
              <div className="text-[10px] text-indigo-700 font-medium">Youth Tutoring</div>
            </div>
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-center space-y-1">
              <div className="text-2xl">💖</div>
              <div className="font-extrabold text-xs text-rose-900">Golden Heart</div>
              <div className="text-[10px] text-rose-700 font-medium">100% Reliable</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}