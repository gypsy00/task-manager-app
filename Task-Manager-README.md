# 📋 Task Manager - Real-Time Collaboration App

A full-stack task management application built with the MERN stack, featuring real-time collaboration, drag-and-drop functionality, and secure authentication.

![Project Status](https://img.shields.io/badge/status-in%20development-yellow)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🚀 Live Demo

- **Frontend:** [Coming Soon - Will be deployed on Vercel]
- **Backend API:** [Coming Soon - Will be deployed on Render]

## 📸 Screenshots

[Screenshots will be added here once the app is built]

---

## ✨ Features

### Core Functionality
- ✅ **User Authentication** - Secure registration and login with JWT tokens
- ✅ **Task Management** - Full CRUD operations (Create, Read, Update, Delete)
- ✅ **Task Organization** - Organize tasks by status (To Do, In Progress, Done)
- ✅ **Real-Time Updates** - Live synchronization across multiple users using Socket.io
- ✅ **Drag & Drop** - Intuitive task reordering and status changes
- ✅ **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- ✅ **Persistent Storage** - All data stored securely in MongoDB

### Security Features
- 🔒 Password hashing with bcrypt
- 🔒 JWT-based authentication
- 🔒 Protected API routes
- 🔒 User-specific task ownership

---

## 🛠️ Tech Stack

### Frontend
- **React** - UI component library
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Socket.io Client** - Real-time communication
- **React Beautiful DnD** - Drag and drop functionality
- **CSS3** - Styling and animations

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Socket.io** - WebSocket library for real-time features
- **JSON Web Tokens (JWT)** - Authentication
- **bcryptjs** - Password hashing

### Development & Testing
- **Jest** - Testing framework
- **React Testing Library** - Component testing
- **Supertest** - API endpoint testing
- **Nodemon** - Development server auto-reload

### Deployment
- **Vercel** - Frontend hosting
- **Render** - Backend hosting
- **MongoDB Atlas** - Database hosting

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or Atlas account)
- Git

### Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/task-manager-app.git
cd task-manager-app
```

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

4. Start the backend server:
```bash
npm start
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the client directory:
```env
REACT_APP_API_URL=http://localhost:5000
```

4. Start the React development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

---

## 🏗️ Project Structure

```
task-manager-app/
├── client/                 # Frontend React application
│   ├── public/
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Auth/      # Login/Register components
│   │   │   ├── Tasks/     # Task-related components
│   │   │   └── Layout/    # Layout components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service functions
│   │   ├── utils/         # Utility functions
│   │   ├── App.js         # Main App component
│   │   └── index.js       # Entry point
│   ├── package.json
│   └── .env
│
├── server/                 # Backend Node.js application
│   ├── models/            # Mongoose schemas
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/            # Express routes
│   │   ├── auth.js
│   │   └── tasks.js
│   ├── controllers/       # Route controllers
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── middleware/        # Custom middleware
│   │   └── auth.js
│   ├── config/            # Configuration files
│   │   └── db.js
│   ├── server.js          # Entry point
│   ├── package.json
│   └── .env
│
└── README.md
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user and get JWT token |

### Tasks (Protected Routes)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks for logged-in user |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/:id` | Update a specific task |
| DELETE | `/api/tasks/:id` | Delete a specific task |

### WebSocket Events
| Event | Description |
|-------|-------------|
| `taskCreated` | Emitted when a new task is created |
| `taskUpdated` | Emitted when a task is updated |
| `taskDeleted` | Emitted when a task is deleted |

---

## 🧪 Testing

### Run Backend Tests
```bash
cd server
npm test
```

### Run Frontend Tests
```bash
cd client
npm test
```

### Test Coverage
```bash
npm test -- --coverage
```

---

## 🚀 Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Set environment variables:
   - `REACT_APP_API_URL`: Your backend URL
5. Deploy!

### Backend (Render)

1. Push your code to GitHub
2. Go to [Render](https://render.com)
3. Create a new Web Service
4. Connect your repository
5. Set environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
6. Deploy!

### Database (MongoDB Atlas)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Add database user
4. Whitelist IP address (or use 0.0.0.0/0 for testing)
5. Get connection string and add to backend `.env`

---

## 📈 Performance Optimizations

- ✅ Debounced API calls to reduce server load
- ✅ Optimistic UI updates for instant feedback
- ✅ Lazy loading for components
- ✅ WebSocket connection pooling
- ✅ MongoDB indexing for faster queries
- ✅ JWT token expiration and refresh

---

## 🔮 Future Enhancements

- [ ] Task priorities (Low, Medium, High, Urgent)
- [ ] Due dates and reminders
- [ ] Task categories/tags
- [ ] File attachments
- [ ] Task comments and discussions
- [ ] Team collaboration features
- [ ] Email notifications
- [ ] Dark mode toggle
- [ ] Advanced filtering and search
- [ ] Data export (CSV, PDF)
- [ ] Task templates
- [ ] Mobile app (React Native)

---

## 🐛 Known Issues

- None at the moment! (Will update as development progresses)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@your-username](https://github.com/your-username)
- LinkedIn: [Your Name](https://linkedin.com/in/your-profile)
- Portfolio: [your-website.com](https://your-website.com)

---

## 🙏 Acknowledgments

- Inspiration from Trello and Asana
- Socket.io documentation and community
- React Beautiful DnD library
- MongoDB University courses
- [Add any other resources or people you'd like to thank]

---

## 📞 Support

If you have any questions or run into issues, please open an issue on GitHub or contact me directly.

---

**⭐ If you found this project helpful, please give it a star!**

---

## 📊 Project Metrics

- **Lines of Code:** ~2,500+ (will update)
- **Components:** 15+ React components
- **API Endpoints:** 6+ RESTful endpoints
- **Test Coverage:** 80%+ (goal)
- **Load Time:** < 2 seconds
- **Lighthouse Score:** 90+ (goal)

---

Built with ❤️ using the MERN stack
