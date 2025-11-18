# CS Department Admin Panel

This is the administrative interface for the CS Department website. It's a separate React application from the main frontend.

## Features

- Faculty Management
- Course Management
- Events & Announcements Management
- Study Materials Management
- Gallery Management
- Achievements Management
- Dashboard with Statistics

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Navigate to the admin directory:

```bash
cd admin
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file (optional):

```
REACT_APP_API_URL=http://localhost:5000/api
```

## Development

To start the development server (runs on port 3001 by default):

```bash
npm start
```

The admin panel will be available at `http://localhost:3001`

## Production Build

To create a production build:

```bash
npm run build
```

The build files will be in the `build/` directory.

## Default Login Credentials

For development/demo purposes:

- Username: admin
- Password: (any password)

**Note:** This uses a simple localStorage authentication. In production, implement proper authentication with JWT tokens and secure backend endpoints.

## Deployment

### Option 1: Deploy to Vercel

1. Push code to GitHub
2. Import the admin folder in Vercel
3. Set build settings:
   - Root Directory: `admin`
   - Build Command: `npm run build`
   - Output Directory: `build`
4. Add environment variables in Vercel dashboard

### Option 2: Deploy to Netlify

1. Connect your GitHub repository
2. Set build settings:
   - Base directory: `admin`
   - Build command: `npm run build`
   - Publish directory: `admin/build`

## Project Structure

```
admin/
├── public/          # Static files
├── src/
│   ├── components/  # Reusable components
│   │   ├── modals/  # Modal components
│   │   └── AdminLayout.jsx
│   ├── pages/       # Page components
│   │   ├── manage/  # Management pages
│   │   ├── AdminLogin.jsx
│   │   └── AdminDashboard.jsx
│   ├── services/    # API services
│   │   └── api.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## API Integration

The admin panel communicates with the backend API at `http://localhost:5000/api` by default. Update the `REACT_APP_API_URL` environment variable to point to your production backend.

## Security Notes

- Implement proper JWT authentication
- Add role-based access control
- Secure all API endpoints
- Use HTTPS in production
- Implement CSRF protection
- Add rate limiting on authentication endpoints

## Technologies Used

- React 18
- React Router v6
- Axios for API calls
- React Icons
- Tailwind CSS
- React Toastify for notifications
