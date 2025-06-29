const mongoose = require('mongoose');

const ngoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  organizationName: {
    type: String,
    required: [true, 'Organization name is required'],
    trim: true,
    maxlength: [100, 'Organization name cannot be more than 100 characters']
  },
  registrationNumber: {
    type: String,
    required: [true, 'Registration number is required'],
    unique: true,
    trim: true
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
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  foundedYear: {
    type: Number,
    required: [true, 'Founded year is required'],
    min: [1900, 'Founded year must be after 1900'],
    max: [new Date().getFullYear(), 'Founded year cannot be in the future']
  },
  contactPerson: {
    name: {
      type: String,
      required: [true, 'Contact person name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Contact person email is required'],
      lowercase: true
    },
    phone: {
      type: String,
      required: [true, 'Contact person phone is required'],
      trim: true
    },
    position: {
      type: String,
      trim: true
    }
  },
  address: {
    street: {
      type: String,
      required: [true, 'Street address is required'],
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
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
      default: 'United States'
    }
  },
  website: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.+/, 'Website must be a valid URL']
  },
  socialMedia: {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String
  },
  logo: {
    type: String,
    default: ''
  },
  banner: {
    type: String,
    default: ''
  },
  documents: {
    registrationCertificate: {
      type: String,
      required: false
    },
    taxExemption: String,
    annualReport: String,
    otherDocuments: [String]
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  mission: {
    type: String,
    maxlength: [500, 'Mission cannot be more than 500 characters']
  },
  vision: {
    type: String,
    maxlength: [500, 'Vision cannot be more than 500 characters']
  },
  focusAreas: [{
    type: String,
    trim: true
  }],
  targetAudience: [{
    type: String,
    trim: true
  }],
  volunteerRequirements: {
    ageMin: {
      type: Number,
      min: 0,
      default: 0
    },
    ageMax: {
      type: Number,
      min: 0
    },
    skills: [String],
    timeCommitment: String,
    trainingProvided: {
      type: Boolean,
      default: false
    }
  },
  stats: {
    totalTasks: {
      type: Number,
      default: 0
    },
    completedTasks: {
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
  adminNotes: {
    type: String,
    maxlength: [1000, 'Admin notes cannot be more than 1000 characters']
  },
  rejectionReason: {
    type: String,
    maxlength: [500, 'Rejection reason cannot be more than 500 characters']
  }
}, {
  timestamps: true
});

// Index for better query performance
ngoSchema.index({ organizationName: 1 });
ngoSchema.index({ category: 1 });
ngoSchema.index({ status: 1 });
ngoSchema.index({ 'address.city': 1, 'address.state': 1 });
ngoSchema.index({ registrationNumber: 1 });

// Virtual for full address
ngoSchema.virtual('fullAddress').get(function() {
  const addr = this.address;
  return `${addr.street}, ${addr.city}, ${addr.state} ${addr.zipCode}, ${addr.country}`;
});

// Virtual for contact info
ngoSchema.virtual('contactInfo').get(function() {
  return {
    name: this.contactPerson.name,
    email: this.contactPerson.email,
    phone: this.contactPerson.phone,
    position: this.contactPerson.position
  };
});

// Pre-save middleware to update user role
ngoSchema.pre('save', async function(next) {
  if (this.isNew) {
    // Update user role to NGO
    await mongoose.model('User').findByIdAndUpdate(
      this.user,
      { role: 'ngo' }
    );
  }
  next();
});

// Method to get public profile
ngoSchema.methods.getPublicProfile = function() {
  const ngoObject = this.toObject();
  
  // Remove sensitive information
  delete ngoObject.adminNotes;
  delete ngoObject.rejectionReason;
  delete ngoObject.documents;
  
  return ngoObject;
};

// Static method to find NGOs by category
ngoSchema.statics.findByCategory = function(category) {
  return this.find({ category, status: 'approved', isActive: true });
};

// Static method to find NGOs by location
ngoSchema.statics.findByLocation = function(city, state) {
  const query = { status: 'approved', isActive: true };
  if (city) query['address.city'] = new RegExp(city, 'i');
  if (state) query['address.state'] = new RegExp(state, 'i');
  return this.find(query);
};

// Static method to find top NGOs
ngoSchema.statics.findTopNGOs = function(limit = 10) {
  return this.find({ status: 'approved', isActive: true })
    .sort({ 'stats.averageRating': -1, 'stats.completedTasks': -1 })
    .limit(limit)
    .select('organizationName logo category stats');
};

module.exports = mongoose.model('NGO', ngoSchema); 