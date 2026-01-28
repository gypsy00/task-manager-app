import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import TaskList from '../components/TaskList';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Task Manager</h1>
        <div className="header-right">
          <span className="welcome-text">Welcome, {user?.username}</span>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <TaskList />
      </main>
    </div>
  );
};

export default Dashboard;
