import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth';

export function Navigation() {
  const { signOut } = useAuth();
  const location = useLocation();
  
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-12">
            <Link
              to="/dashboard"
              className={`inline-flex items-center px-3 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                location.pathname === '/dashboard'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-primary hover:border-primary/50'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/tasks"
              className={`inline-flex items-center px-3 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                location.pathname === '/tasks'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-primary hover:border-primary/50'
              }`}
            >
              Tasks
            </Link>
          </div>
          <button
            onClick={() => signOut()}
            className="ml-4 px-6 py-2 border border-transparent text-sm font-medium rounded-full text-white bg-primary hover:bg-primary/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-md hover:shadow-lg"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}