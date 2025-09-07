# EchoMe X - AI Twin Platform

Create your digital persona that speaks and interacts just like you.

## Overview

EchoMe X is an AI Twin platform MVP that allows users to create digital personas that mimic their communication style and personality. The platform features a simple three-page interface for twin creation, chat interaction, and analytics dashboard.

## Features

- **Twin Creation**: Simple form to create your AI twin with personality details
- **Chat Interface**: Real-time chat with your AI twin powered by Groq/OpenAI
- **Analytics Dashboard**: View engagement metrics and social influence potential

## Tech Stack

**Frontend:**
- HTML5/CSS3/JavaScript (Vanilla)
- Responsive design with CSS Grid/Flexbox
- Deployed on Vercel/Netlify

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose
- Groq/OpenAI API integration
- Deployed on Render/Railway

## Project Structure

```
echome-x/
├── frontend/
│   ├── index.html          # Landing page - twin creation
│   ├── chat.html           # Chat interface
│   ├── analytics.html      # Analytics dashboard
│   ├── styles.css          # Global styles
│   ├── landing.js          # Landing page functionality
│   ├── chat.js             # Chat functionality
│   └── analytics.js        # Analytics functionality
├── backend/
│   ├── server.js           # Express server
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── services/           # AI service integration
│   └── package.json        # Backend dependencies
├── .gitignore
└── README.md
```

## Getting Started

### Frontend Development
1. Open `frontend/index.html` in your browser
2. Navigate between pages to see the interface
3. Forms will show validation but won't submit until backend is ready

### Backend Development
1. Navigate to `backend/` directory
2. Run `npm install` to install dependencies
3. Set up environment variables for MongoDB and AI API keys
4. Run `npm start` to start the server

## API Endpoints

- `POST /api/train` - Create AI twin with persona details
- `POST /api/chat` - Send message and get AI twin response
- `GET /api/analytics/:userId` - Get engagement analytics

## Development Status

✅ Frontend foundation complete
⏳ Backend development in progress
⏳ API integration pending
⏳ Deployment configuration pending