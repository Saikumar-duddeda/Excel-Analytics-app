import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { Button } from './ui/button';
import { BarChart3, LogOut, User, Shield } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 border-b border-white/20 sticky top-0 z-50 backdrop-blur-sm shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center space-x-2" data-testid="navbar-logo">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white" style={{ fontFamily: 'Manrope' }}>Excel Analytics Portal</span>
          </Link>

          {isAuthenticated && (
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" data-testid="nav-dashboard-link">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">Dashboard</Button>
              </Link>
              {user?.role === 'admin' && (
                <Link to="/admin" data-testid="nav-admin-link">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                    <Shield className="h-4 w-4 mr-1" />
                    Admin
                  </Button>
                </Link>
              )}
              <div className="flex items-center space-x-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                <User className="h-4 w-4 text-white" />
                <span className="text-sm font-medium text-white" data-testid="nav-user-name">{user?.name}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
                data-testid="nav-logout-button"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
