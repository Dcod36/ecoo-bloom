# 🌱 EcoBloom - Community Environmental Cleanup Platform

EcoBloom is a full-stack web application that connects environmental volunteers with cleanup campaigns organized by NGOs and community organizers. The platform leverages **AI-powered waste analysis** using Google's Gemini API to provide intelligent insights about environmental conditions.

![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react) ![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js) ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb) ![Gemini AI](https://img.shields.io/badge/Gemini%20AI-Powered-4285F4?logo=google)

---

## 👥 User Profiles & Functionality

### 🧑‍💼 Admin (Organizer/NGO)
Admins are environmental organizations or NGOs who organize cleanup campaigns.

| Feature | Description |
|---------|-------------|
| **Create Jobs** | Post new environmental cleanup campaigns with location, date, time slots, and payment details |
| **Manage Applicants** | View all volunteer applications, approve or reject candidates |
| **Delete Jobs** | Remove posted jobs that are no longer needed |
| **Waste Analysis Dashboard** | AI-powered analytics showing waste trends and insights |
| **Review Reported Issues** | Handle environmental issues reported by volunteers |
| **Complete Jobs** | Mark cleanup campaigns as completed |

### 🙋 User (Volunteer)
Regular users are volunteers who participate in cleanup activities.

| Feature | Description |
|---------|-------------|
| **Browse Jobs** | View all available cleanup opportunities on an interactive map |
| **Apply for Jobs** | Submit applications with personal details and contact info |
| **Track Applications** | Monitor application status (Pending/Approved/Rejected) |
| **Report Issues** | Report environmental issues with location and images |
| **AI Chatbot** | Ask questions about waste analysis in any area |
| **Dashboard** | Personalized view of applied jobs and activities |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 19** | UI library with hooks |
| **React Router DOM** | Client-side routing |
| **Tailwind CSS** | Utility-first styling |
| **Framer Motion** | Smooth animations & transitions |
| **Axios** | HTTP client for API calls |
| **React Leaflet** | Interactive maps for job locations |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | JavaScript runtime |
| **Express.js** | Web server framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | MongoDB ODM |
| **JWT** | Token-based authentication |
| **bcryptjs** | Password hashing |

### AI Integration
| Technology | Purpose |
|------------|---------|
| **Google Gemini API** | AI-powered waste analysis & chatbot |
| **gemini-1.5-flash** | Fast, efficient language model |

---

## 🤖 AI Features (Gemini API)

EcoBloom integrates **Google Gemini AI** for intelligent waste management insights:

### 1. Waste Analysis Chatbot
- Interactive chat interface for querying waste data
- Ask questions like *"Garbage analysis in Kochi"* or *"Waste trends in Angamaly"*
- Real-time AI-generated responses based on collected data

### 2. Smart Analytics
- AI-powered insights on waste collection patterns
- Environmental impact predictions
- Suggestions for cleanup prioritization

### 3. Issue Assessment
- Automated severity assessment of reported issues
- AI-generated recommendations for resolution

---

## ⚠️ Challenges Faced During Implementation

### 1. CORS Policy Issues
**Problem:** Frontend (localhost:3000) couldn't communicate with deployed backend (Vercel)  
**Solution:** Configured proper CORS headers and switched to local development server

### 2. API Route Mismatch
**Problem:** Frontend called `/auth/register` but server expected `/api/auth/register`  
**Solution:** Updated axios baseURL to include `/api` prefix

### 3. MongoDB Memory Server Setup
**Problem:** Local MongoDB installation not available on all machines  
**Solution:** Implemented MongoDB Memory Server as fallback for development

### 4. Gemini API Rate Limits
**Problem:** API rate limits during heavy usage  
**Solution:** Implemented fallback responses when API is unavailable

### 5. Authentication Flow
**Problem:** Users auto-logged in after registration  
**Solution:** Modified flow to redirect to login page for explicit authentication

---

## 🚀 Future Updates

- [ ] **Email Notifications** - Notify volunteers when applications are approved/rejected
- [ ] **Payment Integration** - Razorpay/Stripe for volunteer payments
- [ ] **Mobile App** - React Native version for iOS and Android
- [ ] **Real-time Updates** - WebSocket for live application status
- [ ] **Gamification** - Points, badges, and leaderboards for volunteers
- [ ] **Multi-language Support** - Hindi, Malayalam, Tamil translations
- [ ] **Image Recognition** - AI-powered waste categorization from photos
- [ ] **Carbon Footprint Tracker** - Calculate environmental impact
- [ ] **Social Sharing** - Share cleanup achievements on social media
- [ ] **Admin Analytics Dashboard** - Advanced charts and reports

---

## 📦 Installation

### Prerequisites
- Node.js v18 or higher
- npm or yarn
- Google Gemini API Key (optional, for AI features)

### Step 1: Clone Repository
```bash
git clone https://github.com/yourusername/ecoo-bloom.git
cd ecoo-bloom
```

### Step 2: Install Frontend Dependencies
```bash
npm install
```

### Step 3: Install Backend Dependencies
```bash
cd server
npm install
```

### Step 4: Configure Environment Variables
Create `.env` file in the `server` folder:
```env
PORT=5000
JWT_SECRET=your_secret_key_here
MONGO_URI=mongodb://localhost:27017/ecobloom
GEMINI_API_KEY=your_gemini_api_key_here
```

### Step 5: Run the Application

**Terminal 1 - Backend:**
```bash
cd server
node index.js
```
✅ Server runs at: http://localhost:5000

**Terminal 2 - Frontend:**
```bash
npm start
```
✅ App runs at: http://localhost:3000

---

## 📁 Project Structure

```
ecoo-bloom/
├── public/                    # Static assets
├── src/
│   ├── api/
│   │   └── axios.js          # API configuration
│   ├── components/
│   │   ├── Navbar.jsx        # Navigation bar
│   │   ├── WasteChatbot.jsx  # AI chatbot component
│   │   ├── WasteMap.jsx      # Interactive map
│   │   └── ...
│   ├── context/
│   │   └── AuthContext.js    # Authentication context
│   ├── pages/
│   │   ├── AdminDashboard.jsx
│   │   ├── UserDashboard.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   └── ...
│   └── App.js
├── server/
│   ├── config/
│   │   └── db.js             # Database connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── jobController.js
│   │   └── wasteController.js # Gemini AI integration
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Job.js
│   │   ├── Application.js
│   │   └── WasteLocation.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── jobRoutes.js
│   │   └── wasteRoutes.js
│   └── index.js
└── package.json
```

---

## 🔗 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |

### Jobs
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/jobs` | Get all open jobs | Public |
| GET | `/api/jobs/:id` | Get job details | Public |
| POST | `/api/jobs` | Create new job | Admin |
| DELETE | `/api/jobs/:id` | Delete job | Admin |
| PATCH | `/api/jobs/:id/complete` | Complete job | Admin |

### Applications
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/applications` | Apply for job | User |
| GET | `/api/applications/my` | My applications | User |
| PATCH | `/api/applications/:id` | Update status | Admin |

### Waste Analysis (AI)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/waste/analysis` | Get waste analytics |
| POST | `/api/waste/chat` | Chat with AI bot |

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Contributors

- Your Name - Full Stack Developer

---

Made with 💚 for a cleaner planet 🌍
