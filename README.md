# EchoMe X - AI Twin Platform

Create your digital persona that speaks and interacts just like you.

## Overview

EchoMe X is an AI Twin platform that allows users to create digital personas that mimic their communication style and personality. The platform features a comprehensive interface for twin creation through personality assessment, real-time chat interaction, and analytics dashboard with insights into your AI twin's performance.

## Features

### 🧬 **Twin Creation**
- **Personality Quiz**: 11-question assessment based on psychological models
- **Social Media Integration**: Optional permissions for enhanced personalization
- **AI Persona Generation**: Creates unique personality profiles using advanced AI

### 💬 **Premium Chat Interface**
- **ChatGPT-inspired Design**: Ultra-black theme with premium aesthetics
- **Real-time Conversations**: Powered by Groq API for fast responses
- **Personality-driven Responses**: AI responds based on your unique persona
- **Mobile-optimized**: Responsive design for all devices

### 📊 **Analytics Dashboard**
- **Engagement Metrics**: Track follower growth and interaction rates
- **Performance Insights**: Monitor conversation trends and topics
- **Social Influence Tracking**: Visualize your twin's growing influence
- **Real-time Updates**: Live analytics with animated charts

### 🎨 **Modern Design System**
- **Consistent UI**: Unified sidebar navigation across all pages
- **Premium Aesthetics**: Dark theme with purple gradient accents
- **Responsive Layout**: Optimized for desktop and mobile
- **Accessibility**: Focus states and keyboard navigation support

## Tech Stack

**Frontend:**
- HTML5/CSS3/JavaScript (Vanilla)
- CSS Custom Properties & Modern Layout (Grid/Flexbox)
- Inter Font Family for premium typography
- Modular CSS architecture with component system
- Progressive Web App features

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose ODM
- Groq API integration for AI responses
- RESTful API architecture
- Environment-based configuration

## Project Structure

```
echome-x/
├── frontend/
│   ├── index.html              # Landing & twin creation with quiz
│   ├── chat.html               # Premium chat interface
│   ├── analytics.html          # Analytics dashboard
│   ├── sidebar.html            # Reusable sidebar component
│   ├── styles.css              # Legacy styles (being phased out)
│   ├── index.css               # Landing page specific styles
│   ├── chat.css                # Premium chat interface styles
│   ├── analytics.css           # Analytics dashboard styles
│   ├── sidebar.css             # Sidebar component styles
│   ├── index.js                # Landing page functionality
│   ├── chat.js                 # Chat interface logic
│   ├── analytics.js            # Analytics dashboard logic
│   ├── sidebar.js              # Sidebar component manager
│   ├── utils.js                # Shared utilities and API helpers
│   ├── landing.js              # Twin creation form logic
│   ├── css/
│   │   ├── base.css            # CSS variables and reset
│   │   ├── layout.css          # Layout utilities
│   │   ├── components.css      # Reusable components
│   │   ├── pages.css           # Page-specific overrides
│   │   ├── utilities.css       # Utility classes
│   │   └── sidebar.css         # Sidebar styling
│   ├── js/
│   │   ├── api.js              # API integration layer
│   │   └── chat.js             # Chat functionality
│   └── assets/
│       └── landingpage.jpg     # Hero background image
├── backend/
│   ├── server.js               # Express server with CORS & static serving
│   ├── config/
│   │   └── database.js         # MongoDB connection configuration
│   ├── models/
│   │   ├── Twin.js             # Twin model with personality profiles
│   │   └── Analytics.js        # Analytics model for metrics
│   ├── controllers/
│   │   └── mainController.js   # Main business logic handlers
│   ├── routes/
│   │   └── api.js              # API route definitions
│   ├── utils/
│   │   └── aiService.js        # Groq API integration service
│   ├── data/
│   │   └── twinStore.js        # Data management utilities
│   ├── .env                    # Environment variables
│   └── package.json            # Backend dependencies
├── .gitignore
└── README.md
```

## API Endpoints

### Twin Management
- `POST /api/train` - Create AI twin with personality assessment data
- `GET /api/twin-info` - Retrieve current twin information
- `GET /api/debug-twins` - Development endpoint for twin debugging

### Chat System
- `POST /api/chat` - Basic chat with simple responses
- `POST /api/chat-with-personality` - Advanced chat using AI personality
- `GET /api/chat-history/:twinId` - Retrieve conversation history

### Analytics
- `GET /api/analytics/:userId` - Get comprehensive analytics data
- `POST /api/analytics/track` - Track engagement events

### System
- `GET /health` - Health check endpoint
- `GET /test` - Backend connectivity test

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Groq API key (for AI responses)

### Frontend Development
1. Open `frontend/index.html` in your browser
2. Complete the personality quiz to create your twin
3. Navigate to chat interface to interact with your AI twin
4. View analytics dashboard for engagement insights

### Backend Setup
1. Navigate to `backend/` directory:
   ```bash
   cd backend
   npm install
   ```

2. Configure environment variables in `.env`:
   ```env
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/echome-x
   GROQ_API_KEY=your_groq_api_key
   NODE_ENV=development
   ```

3. Start the development server:
   ```bash
   npm start
   ```

### Full Stack Development
1. Start backend server on `http://localhost:3001`
2. Open `frontend/index.html` in browser
3. The frontend will automatically connect to the local backend

## Environment Variables

```env
# Backend Configuration
PORT=3001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/echome-x

# AI Service
GROQ_API_KEY=your_groq_api_key_here
```

## Development Status

✅ **Frontend Complete**
- Premium UI/UX with dark theme
- Personality quiz system
- Chat interface (ChatGPT-inspired)
- Analytics dashboard
- Responsive design system
- Component-based architecture

✅ **Backend Complete**
- Express.js API server
- MongoDB integration
- Groq AI service integration
- Twin creation and management
- Chat with personality system
- Analytics tracking

✅ **Integration Complete**
- API connectivity layer
- Real-time twin creation
- Personality-driven chat responses
- Analytics data visualization

## Key Features Implementation

### Personality Assessment
- 11-question psychological assessment
- Big Five personality model integration
- Dynamic persona generation
- Social media permission system

### AI Chat System
- Groq API integration for fast responses
- Personality-based response generation
- Conversation history tracking
- Fallback response system

### Analytics System
- Real-time engagement tracking
- Follower growth simulation
- Interaction pattern analysis
- Visual data representation

### Design System
- Consistent purple gradient branding
- Inter font family throughout
- Mobile-first responsive design
- Accessibility compliant

## Performance Optimizations

- **Modular CSS**: Component-based styling system
- **Efficient API**: Streamlined backend with error handling
- **Responsive Images**: Optimized asset loading
- **Progressive Enhancement**: Core functionality works without JavaScript

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Implement changes with consistent styling
4. Test across different devices
5. Submit pull request

## License

MIT License - feel free to use this project as a foundation for your own AI twin platform.

## Deployment

### Frontend
- Deploy to Vercel/Netlify
- Set environment variables for API endpoints
- Configure build settings for static hosting

### Backend
- Deploy to Render/Railway/Heroku
- Set production environment variables
- Configure MongoDB connection string
- Set up Groq API credentials

---

**EchoMe X** - Where AI meets personality. Create your digital twin today! 🚀