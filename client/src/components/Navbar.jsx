import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHotel, FaUserCircle, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <FaHotel className="logo-icon" />
                    <span>LuxeStay</span>
                </Link>

                <div className="navbar-menu">
                    <Link to="/" className="nav-link">Rooms</Link>

                    {user ? (
                        <>
                            {isAdmin && (
                                <Link to="/admin" className="nav-link admin-link">
                                    <FaTachometerAlt /> Admin
                                </Link>
                            )}
                            <Link to="/bookings" className="nav-link">My Bookings</Link>

                            <div className="user-profile">
                                <FaUserCircle className="user-icon" />
                                <span className="user-name">{user.name}</span>
                                <button onClick={handleLogout} className="logout-btn" title="Logout">
                                    <FaSignOutAlt />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login" className="btn btn-secondary btn-sm">Sign In</Link>
                            <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
