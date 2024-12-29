import { Navigation } from '../components/Navigation';
import { Dashboard } from '../components/Dashboard';

export function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
          <div className="bg-white shadow-lg rounded-xl p-8">
            <Dashboard />
          </div>
        </div>
      </div>
    </div>
  );
}