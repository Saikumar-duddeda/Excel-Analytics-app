**Excel Analytics Platform
🚀 Overview**

The Excel Analytics Platform is a full-stack web application designed for interactive data visualization, analytics, and AI-powered insights.
Users can securely upload Excel files, analyze their data using multiple chart types, and download results in PNG or PDF format.
An Admin Dashboard provides role-based access control, user management, and platform statistics.

This platform is now fully tested, production-ready, and deployable.

**🧩 Key Features
👥 Authentication & Roles**

Secure JWT-based authentication

Separate Admin and User roles

Admin Dashboard for user and data management

Registration and Login with validation

**📂 Excel Data Management**

Upload .xlsx or .xls files (up to 20MB)

Automatic column extraction and validation

Persistent chart configurations per user

**📊 Analytics & Visualization**

Create 5 different chart types:

Bar Chart

Line Chart

Scatter Plot

Pie Chart

3D Column Chart (Three.js-based)

Interactive visualization controls

Real-time data statistics

🤖 AI Summary Generation

Integrated with OpenAI GPT for automatic dataset insights

Generates concise, actionable summaries from Excel data

🧾 Exports

Download charts as PNG (via html2canvas)

Export analytics reports as PDF (via backend using ReportLab)

**🛠️ Admin Panel**

Secure admin login

Dashboard with user analytics and platform usage statistics

Manage registered users and view activity insights

Full role-based access control implementation

**🏗️ Architecture
🖥️ Frontend**

Built with React.js:

Responsive design using Tailwind CSS

Modern dark theme with glassmorphism effects

Smooth animations and transitions

State management using React Context API

Chart rendering with Chart.js and Three.js

File upload using react-dropzone

**⚙️ Backend**

Developed with FastAPI:

RESTful API structure

MongoDB integration via Motor

JWT Authentication and bcrypt password hashing

Excel parsing with Pandas and openpyxl

PDF generation using ReportLab

AI summary using OpenAI GPT

Robust error handling and validation

**🗃️ Database**

MongoDB stores:

User credentials and roles

Uploaded file metadata

Chart configurations

Admin analytics data

****Backend setup ****
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
**
frontend setup **
cd frontend
npm install
npm start

**Key Learning & Experience**

This project provided hands-on experience in:

Full-stack architecture design and integration

Role-based authentication and admin control systems

Data visualization and analytics workflows

AI integration for data summarization

RESTful API design and validation with FastAPI

Modern UI/UX practices with React and Tailwind
