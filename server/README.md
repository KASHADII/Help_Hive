# HelpHive Backend API

A comprehensive Node.js/Express backend API for the HelpHive community service platform, connecting volunteers with NGOs and community service opportunities.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Volunteer and NGO user profiles with verification
- **Task Management**: Create, manage, and apply for volunteer opportunities
- **NGO Management**: NGO registration, approval, and profile management
- **File Upload**: Image uploads using Cloudinary
- **Admin Dashboard**: Comprehensive admin panel for system management
- **Search & Filtering**: Advanced search and filtering capabilities
- **Statistics & Analytics**: Detailed analytics and reporting
- **Rate Limiting**: API rate limiting for security
- **Validation**: Comprehensive input validation and sanitization

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer + Cloudinary
- **Validation**: Express-validator
- **Security**: Helmet, CORS, Rate limiting
- **Logging**: Morgan

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Cloudinary account (for image uploads)

## Installation

1. **Clone the repository**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   # Server Configuration
   NODE_ENV=development
   PORT=5000
   CLIENT_URL=http://localhost:5173

   # Database
   MONGODB_URI=mongodb://localhost:27017/helphive

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret

   # Admin Configuration
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin123
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/auth/register` | Register volunteer | Public |
| POST | `/api/auth/ngo-register` | Register NGO | Public |
| POST | `/api/auth/login` | User login | Public |
| POST | `/api/auth/admin-login` | Admin login | Public |
| GET | `/api/auth/me` | Get current user | Private |
| POST | `/api/auth/logout` | Logout | Private |
| POST | `/api/auth/forgot-password` | Forgot password | Public |
| POST | `/api/auth/reset-password/:token` | Reset password | Public |

### Users

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/users/profile` | Get user profile | Private |
| PUT | `/api/users/profile` | Update profile | Private |
| PUT | `/api/users/avatar` | Update avatar | Private |
| GET | `/api/users/:id` | Get user by ID | Public |
| GET | `/api/users/:id/tasks` | Get user tasks | Private |
| GET | `/api/users/stats/leaderboard` | Volunteer leaderboard | Public |
| GET | `/api/users/stats/skills` | Users by skills | Public |
| GET | `/api/users/search` | Search users | Public |

### Tasks

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/tasks` | Get all tasks | Public |
| GET | `/api/tasks/featured` | Get featured tasks | Public |
| GET | `/api/tasks/urgent` | Get urgent tasks | Public |
| GET | `/api/tasks/:id` | Get single task | Public |
| POST | `/api/tasks` | Create task | NGO/Admin |
| PUT | `/api/tasks/:id` | Update task | Owner/Admin |
| DELETE | `/api/tasks/:id` | Delete task | Owner/Admin |
| POST | `/api/tasks/:id/apply` | Apply for task | Volunteer |
| PUT | `/api/tasks/:id/applications/:id` | Update application | Owner/Admin |
| POST | `/api/tasks/:id/complete` | Complete task | Volunteer |

### NGOs

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/ngos` | Get all NGOs | Public |
| GET | `/api/ngos/featured` | Get featured NGOs | Public |
| GET | `/api/ngos/:id` | Get single NGO | Public |
| GET | `/api/ngos/:id/tasks` | Get NGO tasks | Public |
| GET | `/api/ngos/profile/my` | Get my NGO profile | NGO |
| PUT | `/api/ngos/profile` | Update NGO profile | NGO |
| PUT | `/api/ngos/logo` | Update logo | NGO |
| PUT | `/api/ngos/banner` | Update banner | NGO |
| GET | `/api/ngos/search` | Search NGOs | Public |
| GET | `/api/ngos/stats/categories` | NGO stats by category | Public |
| GET | `/api/ngos/stats/locations` | NGO stats by location | Public |

### Admin

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/admin/dashboard` | Admin dashboard | Admin |
| GET | `/api/admin/users` | Get all users | Admin |
| GET | `/api/admin/ngos` | Get all NGOs | Admin |
| PUT | `/api/admin/ngos/:id/approve` | Approve NGO | Admin |
| PUT | `/api/admin/ngos/:id/reject` | Reject NGO | Admin |
| GET | `/api/admin/tasks` | Get all tasks | Admin |
| PUT | `/api/admin/tasks/:id/feature` | Toggle task feature | Admin |
| DELETE | `/api/admin/tasks/:id` | Delete task | Admin |
| GET | `/api/admin/stats` | System statistics | Admin |
| POST | `/api/admin/broadcast` | Send broadcast | Admin |

### Upload

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/upload/image` | Upload single image | Private |
| POST | `/api/upload/multiple` | Upload multiple images | Private |
| POST | `/api/upload/avatar` | Upload avatar | Private |
| POST | `/api/upload/logo` | Upload NGO logo | NGO/Admin |
| POST | `/api/upload/banner` | Upload NGO banner | NGO/Admin |
| DELETE | `/api/upload/:publicId` | Delete image | Private |

## Data Models

### User
- Basic info (name, email, password)
- Profile details (avatar, bio, location, skills)
- Role-based access (volunteer, ngo, admin)
- Statistics (total hours, completed tasks)
- Verification status

### NGO
- Organization details (name, description, category)
- Contact information and address
- Documents and verification
- Statistics and performance metrics
- Approval workflow

### Task
- Task details (title, description, requirements)
- Location and scheduling
- Volunteer applications and management
- Progress tracking and completion
- Ratings and feedback

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Role-Based Access

- **Volunteers**: Can apply for tasks, update profiles, view tasks
- **NGOs**: Can create tasks, manage applications, update profiles
- **Admins**: Full system access, user management, NGO approval

## Error Handling

The API returns consistent error responses:

```json
{
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Validation error message"
    }
  ]
}
```

## Rate Limiting

- General API: 100 requests per 15 minutes
- Login: 5 attempts per 15 minutes
- Registration: 3 attempts per hour
- Password reset: 3 attempts per hour

## File Upload

Images are uploaded to Cloudinary with automatic optimization:
- Maximum file size: 5MB
- Supported formats: JPG, PNG, GIF, WebP
- Automatic resizing and compression
- Organized folder structure

## Development

### Scripts

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start

# Run tests
npm test
```

### Environment Variables

See `env.example` for all required environment variables.

### Database

The API uses MongoDB with Mongoose. Make sure MongoDB is running and accessible.

### Testing

```bash
npm test
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong JWT secret
3. Configure MongoDB connection string
4. Set up Cloudinary credentials
5. Configure CORS origins
6. Use HTTPS in production
7. Set up proper logging and monitoring

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- CORS protection
- Helmet security headers
- Role-based access control

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions, please contact the development team or create an issue in the repository. 