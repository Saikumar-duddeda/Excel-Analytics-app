# Excel Analytics Platform

A full-stack web application built with **FastAPI (Python) + React + MongoDB** that enables users to upload Excel files, visualize data through interactive charts (2D and 3D), and generate AI-powered insights using OpenAI GPT-4.

## 🚀 Features

### Core Features
- **User Authentication**: JWT-based authentication with role management (user/admin)
- **Excel File Upload**: Support for .xls and .xlsx files (up to 20MB)
- **Interactive Analytics**: 
  - Dynamic X/Y axis selection
  - Multiple chart types: Bar, Line, Scatter, Pie, and 3D Column
  - Real-time chart rendering
- **AI-Powered Insights**: OpenAI GPT-4 integration for automated data analysis and trend identification
- **Download Options**: Export charts as PNG or PDF
- **Upload History**: Track and manage all uploaded files

### Admin Panel
- Platform statistics dashboard
- User management (view, block/unblock, delete users)
- Real-time analytics on uploads and users

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **MongoDB** - NoSQL database with Motor (async driver)
- **OpenPyXL** - Excel file parsing
- **ReportLab** - PDF generation
- **Emergent Integrations** - OpenAI GPT-4 integration
- **JWT** - Authentication tokens
- **BCrypt** - Password hashing

### Frontend
- **React 19** - UI framework
- **Redux Toolkit** - State management
- **Tailwind CSS** - Styling
- **Shadcn/UI** - Component library
- **Chart.js** - 2D charts
- **Three.js** - 3D visualizations
- **html2canvas** - Screenshot generation
- **Axios** - HTTP client

## 📋 Prerequisites

- Python 3.11+
- Node.js 18+ & Yarn
- MongoDB (local instance)

## 🔧 Installation & Setup

### 1. Backend Setup
```bash
cd backend

# Install dependencies
pip install -r requirements.txt
```

### 2. Frontend Setup
```bash
cd frontend

# Install dependencies
yarn install
```

### 3. Start Services

The application uses **supervisor** to manage services:

```bash
# Restart all services
sudo supervisorctl restart backend frontend

# Check status
sudo supervisorctl status
```

Services:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8001
- **MongoDB**: mongodb://localhost:27017

## 👤 Default Admin Account

- **Email**: adminbro@gmail.com
- **Password**: admin123

## 🎯 Usage Guide

### 1. Login/Register
- Navigate to the application
- Use the admin credentials or register a new account

### 2. Upload Excel File
- Go to Dashboard
- Select an Excel file (.xls/.xlsx)
- Click "Upload"

### 3. Analyze Data
- Click "Analyze" on any uploaded file
- Select X and Y axis columns
- Choose chart type (Bar, Line, Scatter, Pie, or 3D Column)
- Add a chart title
- Click "Save Configuration"

### 4. Generate AI Summary
- Click "Generate AI Summary" button
- OpenAI GPT-4 analyzes the data and provides insights

### 5. Download Charts
- Click "PNG" to download as image
- Click "PDF" to download as PDF document

### 6. Admin Panel (Admin Only)
- Click "Admin" in navigation
- View platform statistics
- Manage users (block/unblock/delete)

## 📁 Project Structure

```
/app
├── backend/
│   ├── models/              # Pydantic models
│   ├── routes/              # API routes
│   ├── utils/               # Utilities
│   ├── uploads/             # File storage
│   ├── server.py            # FastAPI app
│   └── .env                 # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── store/           # Redux store
│   │   └── utils/           # API client
│   ├── package.json
│   └── .env
└── README.md
```

## 🔑 Key API Endpoints

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/uploads` - Upload Excel file
- `GET /api/uploads` - Get user's uploads
- `POST /api/uploads/:id/config` - Save chart config
- `GET /api/admin/stats` - Get platform stats
- `GET /api/admin/users` - List all users

## 🎨 Design Features

- Modern UI with glass-morphism effects
- Manrope for headings, Inter for body text
- Ocean blue color scheme (#3b82f6)
- Smooth animations and transitions
- Fully responsive layout

## 📊 Chart Types

1. **Bar Chart** - Compare values
2. **Line Chart** - Show trends
3. **Scatter Chart** - Display correlations
4. **Pie Chart** - Show proportions
5. **3D Column Chart** - Interactive 3D visualization

## 🤖 AI Integration

OpenAI GPT-4 analyzes your data to:
- Identify trends and patterns
- Detect outliers
- Suggest correlations
- Provide actionable insights

## 📝 Notes

- Runs independently on localhost (ports 3000 and 8001)
- Uses local MongoDB instance
- All dependencies included
- File size limit: 20MB per upload
