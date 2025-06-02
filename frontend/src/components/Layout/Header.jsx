import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaVolumeUp, FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaBars } from 'react-icons/fa';

const Header = () => {
  const { isAuthenticated, logout, user } = useAuth();

  const navLinkClass = ({ isActive }) =>
    `relative px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
      isActive
        ? 'text-indigo-600 bg-indigo-50 shadow-sm'
        : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `block px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
      isActive
        ? 'text-indigo-600 bg-indigo-50'
        : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
    }`;

  const navLinks = (
    <>
      <li>
        <NavLink to="/" className={navLinkClass}>
          Home
        </NavLink>
      </li>
      {isAuthenticated && (
        <li>
          <NavLink to="/conversions" className={navLinkClass}>
            Conversions
          </NavLink>
        </li>
      )}
    </>
  );

  const mobileNavLinks = (
    <>
      <li>
        <NavLink to="/" className={mobileNavLinkClass}>
          Home
        </NavLink>
      </li>
      {isAuthenticated && (
        <li>
          <NavLink to="/conversions" className={mobileNavLinkClass}>
            Conversions
          </NavLink>
        </li>
      )}
      {!isAuthenticated && (
        <>
          <li>
            <NavLink to="/login" className={mobileNavLinkClass}>
              <div className="flex items-center">
                <FaSignInAlt className="mr-3 text-sm" />
                Login
              </div>
            </NavLink>
          </li>
          <li>
            <NavLink to="/register" className={mobileNavLinkClass}>
              <div className="flex items-center">
                <FaUserPlus className="mr-3 text-sm" />
                Register
              </div>
            </NavLink>
          </li>
        </>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-md mb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <NavLink 
              to="/" 
              className="flex items-center space-x-3 text-gray-900 hover:text-indigo-600 transition-colors duration-200"
              aria-label="TTS Converter Home"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-md">
                <FaVolumeUp className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  TTS Converter
                </h1>
                <p className="text-xs text-gray-500 -mt-1">Text to Speech</p>
              </div>
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <ul className="flex items-center space-x-1">
              {navLinks}
            </ul>
          </nav>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 rounded-full">
                    <FaUser className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">{user?.username}</p>
                    <p className="text-gray-500">Welcome back</p>
                  </div>
                </div>
                <button 
                  onClick={logout}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  aria-label="Logout"
                >
                  <FaSignOutAlt className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <NavLink
                  to="/login"
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  aria-label="Login"
                >
                  <FaSignInAlt className="w-4 h-4" />
                  <span>Login</span>
                </NavLink>
                <NavLink
                  to="/register"
                  className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  aria-label="Register"
                >
                  <FaUserPlus className="w-4 h-4" />
                  <span>Register</span>
                </NavLink>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <div className="dropdown dropdown-end">
              <div 
                tabIndex={0} 
                role="button" 
                className="btn btn-ghost btn-circle hover:bg-gray-100"
                aria-label="Open menu"
              >
                <FaBars className="w-5 h-5 text-gray-700" />
              </div>
              <div
                tabIndex={0}
                className="dropdown-content mt-3 w-64 p-4 shadow-xl bg-white rounded-xl border border-gray-200"
              >
                {/* Mobile Navigation */}
                <nav className="mb-4">
                  <ul className="space-y-2">
                    {mobileNavLinks}
                  </ul>
                </nav>

                {/* Mobile Auth Section */}
                {isAuthenticated ? (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-full">
                        <FaUser className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user?.username}</p>
                        <p className="text-sm text-gray-500">Welcome back</p>
                      </div>
                    </div>
                    <button 
                      onClick={logout}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-lg font-medium transition-all duration-200"
                      aria-label="Logout"
                    >
                      <FaSignOutAlt className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;