import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-container">
      <nav className="sidebar">
        <div className="sidebar-header">
          <h3>Assets Management</h3>
        </div>
        <ul className="sidebar-menu">
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/users">Users</Link>
          </li>
          <li>
            <Link to="/locations">Locations</Link>
          </li>
          <li>
            <Link to="/regions">Regions</Link>
          </li>
          <li>
            <Link to="/townships">Townships</Link>
          </li>
          <li>
            <Link to="/assets">Assets</Link>
          </li>
        </ul>
        <div className="sidebar-footer">
          <div className="user-info">
            <span>{user?.name}</span>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
