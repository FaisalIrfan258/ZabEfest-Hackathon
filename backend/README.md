# EcoTracker - Community Environmental Reporting Platform

EcoTracker is a community-driven environmental monitoring platform that enables citizens to report, track, and address environmental issues in their neighborhoods. The platform empowers communities to take action on local environmental challenges while providing valuable data to local authorities and researchers.

## Features

### Core Features
- **User Authentication**: Secure registration and login system with CNIC for users and email for admins
- **Incident Reporting**: Report environmental incidents with details, photos, and location
- **Interactive Map**: Visualize reported incidents on a map with filtering
- **User Dashboard**: Track personal contributions and followed reports
- **Verification System**: Community verification of reported incidents
- **Status Tracking**: Follow progress from reporting to resolution
- **Push Notifications**: Receive web notifications for status updates and verifications

### Advanced Features
- **Data Analysis**: Environmental statistics and visualization
- **Community Events**: Organize and participate in cleanup and awareness events
- **Authority Portal**: Special interface for government agencies
- **Environmental Scoring**: Track neighborhood environmental health scores
- **Gamification**: Points and badges to incentivize participation

## Technology Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Multer & Cloudinary for file uploads
- Web Push Notifications

### Frontend (Not included in this repository)
- React.js
- Mapbox/Leaflet for maps
- Chart.js for data visualization
- Web Push for notifications

## API Documentation

The API documentation is available via Swagger UI at `/api-docs` when the server is running. You can also generate and update the documentation by running:

```
npm run swagger:generate   # Generate or update the Swagger YAML file
npm run swagger:docs       # Generate documentation and start the server
```

### Adding to the Documentation

The Swagger documentation is generated from individual JSON files in the `scripts/swagger-docs` directory. To add or modify documentation:

1. Edit the corresponding JSON file for the feature (e.g., `auth.json`, `incidents.json`)
2. Run `npm run swagger:generate` to update the main `swagger.yaml` file
3. Start or restart the server to see the changes

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Log in a user (supports both CNIC and email)
- `POST /api/auth/login/user` - User login with CNIC
- `POST /api/auth/login/admin` - Admin login with email
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/me` - Update user profile
- `PUT /api/auth/password` - Change password
- `PUT /api/auth/profile-picture` - Upload profile picture
- `PUT /api/auth/push-subscription` - Update push subscription for notifications
- `GET /api/auth/vapid-public-key` - Get VAPID public key for push notifications

### Incidents
- `GET /api/incidents` - Get all incidents with filtering
- `GET /api/incidents/:id` - Get a specific incident
- `POST /api/incidents` - Report a new incident
- `PUT /api/incidents/:id` - Update an incident
- `DELETE /api/incidents/:id` - Delete an incident
- `PUT /api/incidents/:id/status` - Update incident status
- `PUT /api/incidents/:id/verify` - Verify an incident
- `PUT /api/incidents/:id/follow` - Follow/unfollow an incident
- `PUT /api/incidents/:id/images` - Upload images to an incident

### Comments
- `GET /api/comments/incident/:incidentId` - Get comments for an incident
- `POST /api/comments` - Add a comment
- `DELETE /api/comments/:id` - Delete a comment

### Dashboard
- `GET /api/dashboard/user` - Get user dashboard data
- `GET /api/dashboard/admin` - Get admin dashboard data
- `GET /api/dashboard/neighborhoods` - Get neighborhood data
- `GET /api/dashboard/neighborhoods/:id` - Get specific neighborhood data
- `GET /api/dashboard/stats` - Get platform statistics

### Events
- `GET /api/events` - Get all events with filtering
- `GET /api/events/:id` - Get a specific event
- `POST /api/events` - Create a new event
- `PUT /api/events/:id` - Update an event
- `PUT /api/events/:id/register` - Register for an event
- `PUT /api/events/:id/cancel` - Cancel an event

## Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB
- Cloudinary account (optional for production)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/ecotracker-backend.git
   cd ecotracker-backend
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Set up environment variables
   Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ecotracker
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRY=7d
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # Web Push Configuration
   VAPID_PUBLIC_KEY=your_vapid_public_key
   VAPID_PRIVATE_KEY=your_vapid_private_key
   VAPID_SUBJECT=mailto:contact@ecotracker.com

   # Email Configuration
   EMAIL_HOST=smtp.example.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your-email@example.com
   EMAIL_PASSWORD=your-email-password
   EMAIL_FROM=no-reply@yourapp.com
   EMAIL_FROM_NAME=Your App Name
   FRONTEND_URL=http://localhost:3000
   ```

4. Start the development server
   ```
   npm run dev
   ```

5. Try the notification demo
   Open your browser and navigate to `http://localhost:5000/notification-demo.html`

## License
This project is licensed under the ISC License. 

## Email Configuration for Password Reset

To enable the password reset functionality, you need to configure the following environment variables in your `.env` file:

You can use services like Gmail, SendGrid, Mailgun, or any other SMTP provider. For development purposes, you can use [Mailtrap](https://mailtrap.io/) which provides a free testing inbox.

### Gmail Example

If you're using Gmail, use these settings:

```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-app-password
```

Note: For Gmail, you'll need to use an "App Password" instead of your regular password. You can generate one in your Google Account settings under Security > App passwords. 