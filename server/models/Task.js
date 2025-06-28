const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Task description is required'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  ngo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NGO',
    required: [true, 'NGO is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Healthcare',
      'Education',
      'Environment',
      'Community Service',
      'Animal Welfare',
      'Disaster Relief',
      'Human Rights',
      'Arts & Culture',
      'Sports',
      'Technology',
      'Other'
    ]
  },
  location: {
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    zipCode: {
      type: String,
      required: [true, 'ZIP code is required'],
      trim: true
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  dateTime: {
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required']
    },
    isRecurring: {
      type: Boolean,
      default: false
    },
    recurringPattern: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      default: 'weekly'
    }
  },
  requirements: {
    volunteersNeeded: {
      type: Number,
      required: [true, 'Number of volunteers needed is required'],
      min: [1, 'At least 1 volunteer is needed']
    },
    ageMin: {
      type: Number,
      min: 0,
      default: 0
    },
    ageMax: {
      type: Number,
      min: 0
    },
    skills: [{
      type: String,
      trim: true
    }],
    experience: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
    },
    trainingProvided: {
      type: Boolean,
      default: false
    },
    trainingDescription: String
  },
  benefits: {
    type: String,
    maxlength: [500, 'Benefits description cannot be more than 500 characters']
  },
  images: [{
    type: String,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Image must be a valid URL'
    }
  }],
  status: {
    type: String,
    enum: ['draft', 'active', 'in-progress', 'completed', 'cancelled'],
    default: 'draft'
  },
  isUrgent: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  applications: [{
    volunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'withdrawn'],
      default: 'pending'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    approvedAt: Date,
    rejectedAt: Date,
    rejectionReason: String,
    message: {
      type: String,
      maxlength: [500, 'Message cannot be more than 500 characters']
    },
    availability: {
      type: String,
      enum: ['full-time', 'part-time', 'flexible'],
      default: 'flexible'
    }
  }],
  volunteers: [{
    volunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    hoursWorked: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    feedback: String,
    completedAt: Date
  }],
  stats: {
    totalApplications: {
      type: Number,
      default: 0
    },
    approvedApplications: {
      type: Number,
      default: 0
    },
    totalVolunteers: {
      type: Number,
      default: 0
    },
    totalHours: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    }
  },
  tags: [{
    type: String,
    trim: true
  }],
  contactInfo: {
    name: String,
    email: String,
    phone: String
  },
  additionalInfo: {
    type: String,
    maxlength: [1000, 'Additional info cannot be more than 1000 characters']
  }
}, {
  timestamps: true
});

// Index for better query performance
taskSchema.index({ title: 'text', description: 'text' });
taskSchema.index({ category: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ 'location.city': 1, 'location.state': 1 });
taskSchema.index({ 'dateTime.startDate': 1 });
taskSchema.index({ isUrgent: 1 });
taskSchema.index({ isFeatured: 1 });
taskSchema.index({ ngo: 1 });

// Virtual for full location
taskSchema.virtual('fullLocation').get(function() {
  const loc = this.location;
  return `${loc.address}, ${loc.city}, ${loc.state} ${loc.zipCode}`;
});

// Virtual for duration
taskSchema.virtual('duration').get(function() {
  const start = new Date(this.dateTime.startDate);
  const end = new Date(this.dateTime.endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual for isOpen
taskSchema.virtual('isOpen').get(function() {
  return this.status === 'active' && 
         this.applications.filter(app => app.status === 'approved').length < this.requirements.volunteersNeeded;
});

// Pre-save middleware to update stats
taskSchema.pre('save', function(next) {
  // Update total applications
  this.stats.totalApplications = this.applications.length;
  this.stats.approvedApplications = this.applications.filter(app => app.status === 'approved').length;
  this.stats.totalVolunteers = this.volunteers.length;
  
  // Update total hours
  this.stats.totalHours = this.volunteers.reduce((total, vol) => total + (vol.hoursWorked || 0), 0);
  
  // Update average rating
  const ratings = this.volunteers.filter(vol => vol.rating).map(vol => vol.rating);
  this.stats.averageRating = ratings.length > 0 ? 
    ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : 0;
  
  next();
});

// Method to get public profile
taskSchema.methods.getPublicProfile = function() {
  const taskObject = this.toObject();
  
  // Remove sensitive information
  delete taskObject.additionalInfo;
  delete taskObject.contactInfo;
  
  return taskObject;
};

// Static method to find tasks by category
taskSchema.statics.findByCategory = function(category) {
  return this.find({ category, status: 'active' })
    .populate('ngo', 'organizationName logo category')
    .sort({ 'dateTime.startDate': 1 });
};

// Static method to find tasks by location
taskSchema.statics.findByLocation = function(city, state) {
  const query = { status: 'active' };
  if (city) query['location.city'] = new RegExp(city, 'i');
  if (state) query['location.state'] = new RegExp(state, 'i');
  return this.find(query)
    .populate('ngo', 'organizationName logo category')
    .sort({ 'dateTime.startDate': 1 });
};

// Static method to find urgent tasks
taskSchema.statics.findUrgentTasks = function(limit = 10) {
  return this.find({ isUrgent: true, status: 'active' })
    .populate('ngo', 'organizationName logo category')
    .sort({ 'dateTime.startDate': 1 })
    .limit(limit);
};

// Static method to find featured tasks
taskSchema.statics.findFeaturedTasks = function(limit = 10) {
  return this.find({ isFeatured: true, status: 'active' })
    .populate('ngo', 'organizationName logo category')
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to search tasks
taskSchema.statics.searchTasks = function(searchTerm, filters = {}) {
  const query = { status: 'active' };
  
  if (searchTerm) {
    query.$text = { $search: searchTerm };
  }
  
  if (filters.category) query.category = filters.category;
  if (filters.city) query['location.city'] = new RegExp(filters.city, 'i');
  if (filters.state) query['location.state'] = new RegExp(filters.state, 'i');
  if (filters.isUrgent !== undefined) query.isUrgent = filters.isUrgent;
  
  return this.find(query)
    .populate('ngo', 'organizationName logo category')
    .sort({ 'dateTime.startDate': 1 });
};

module.exports = mongoose.model('Task', taskSchema); 