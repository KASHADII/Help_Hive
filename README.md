# HelpHive - Volunteer Management Platform

HelpHive is a comprehensive platform that connects NGOs (Non-Governmental Organizations) with passionate volunteers and students. The platform facilitates meaningful community engagement by providing tools for task posting, volunteer management, and impact tracking.

## 🌟 Features

### For Volunteers
- Browse and apply for volunteer opportunities
- Track completed tasks and impact
- Build skills and gain experience
- Connect with NGOs and other volunteers
- Profile management and achievements

### For NGOs
- Post volunteer opportunities
- Manage volunteer applications
- Track task completion and impact
- Profile and organization management
- Communication tools

### For Admins
- User and NGO management
- Task moderation and featuring
- System statistics and analytics
- Content moderation

## 🏗️ Architecture

The project consists of two main parts:

### Frontend (React + Vite)
- **Location**: `/client`
- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS with custom animations
- **UI Components**: Radix UI primitives
- **State Management**: React Context API
- **Routing**: React Router DOM

### Backend (Node.js + Express)
- **Location**: `/server`
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT tokens
- **File Upload**: Cloudinary integration
- **Validation**: Joi schema validation

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Help_Hive
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp server/env.example server/.env
   
   # Edit the .env file with your configuration
   nano server/.env
   ```

4. **Configure your environment variables**
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # Database
   MONGODB_URI=mongodb://localhost:27017/helphive
   
   # JWT Secret
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   
   # Cloudinary (for file uploads)
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   
   # Admin credentials
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin123
   ADMIN_EMAIL=admin@helphive.com
   ```

### Running the Application

#### Development Mode (Both Frontend and Backend)
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend development server on `http://localhost:5173`

#### Individual Services

**Backend only:**
```bash
npm run server
```

**Frontend only:**
```bash
npm run client
```

#### Production Build
```bash
npm run build
npm start
```

## 📁 Project Structure

```
Help_Hive/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React contexts for state management
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions and API client
│   │   ├── pages/          # Page components
│   │   └── main.jsx        # Application entry point
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── server/                 # Backend Node.js application
│   ├── middleware/         # Express middleware
│   ├── models/             # MongoDB models
│   ├── routes/             # API route handlers
│   ├── server.js           # Server entry point
│   └── package.json        # Backend dependencies
└── README.md              # This file
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new volunteer
- `POST /api/auth/ngo-register` - Register new NGO
- `POST /api/auth/login` - User login
- `POST /api/auth/admin-login` - Admin login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/:id/apply` - Apply for task
- `PUT /api/tasks/:id/applications/:applicationId` - Update application status
- `POST /api/tasks/:id/complete` - Complete task

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/:id/tasks` - Get user's tasks

### NGOs
- `GET /api/ngos` - Get all NGOs
- `GET /api/ngos/:id` - Get NGO by ID
- `GET /api/ngos/profile/my` - Get my NGO profile
- `PUT /api/ngos/profile` - Update NGO profile

### Admin
- `GET /api/admin/dashboard` - Admin dashboard stats
- `GET /api/admin/users` - Get all users
- `GET /api/admin/ngos` - Get all NGOs
- `PUT /api/admin/ngos/:id/approve` - Approve NGO
- `PUT /api/admin/ngos/:id/reject` - Reject NGO

### File Upload
- `POST /api/upload/image` - Upload single image
- `POST /api/upload/avatar` - Upload user avatar
- `POST /api/upload/logo` - Upload NGO logo
- `POST /api/upload/banner` - Upload NGO banner

## 🎨 Frontend Features

### Modern UI/UX
- Responsive design with Tailwind CSS
- Smooth animations and transitions
- Gradient backgrounds and modern styling
- Loading states and error handling

### Role-Based Navigation
- Different navigation for volunteers, NGOs, and admins
- Protected routes based on user roles
- Dynamic content based on authentication status

### Real-time Updates
- API integration for live data
- Optimistic updates for better UX
- Error handling and fallback states

## 🔒 Security Features

- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- Secure file upload handling
- CORS configuration
- Environment variable protection

## 🧪 Testing

### Backend Testing
```bash
cd server
npm test
```

### Frontend Testing
```bash
cd client
npm test
```

## 📦 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or local MongoDB
2. Configure environment variables
3. Deploy to your preferred platform (Heroku, Vercel, etc.)

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information
4. Contact the development team

## 🎯 Roadmap

- [ ] Real-time notifications
- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Integration with social media
- [ ] Multi-language support
- [ ] Advanced search and filtering
- [ ] Volunteer certification system
- [ ] Payment integration for donations

---

**Made with ❤️ by the HelpHive Team**

