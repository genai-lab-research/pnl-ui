import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { LoginRequest, RegisterRequest } from '../types/auth';
import { getUserDisplayName, getUserInitials, formatTimeUntilExpiry } from '../utils/authHelpers';

export function AuthDemo() {
  const { user, isAuthenticated, isLoading, login, register, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(true);
  const [credentials, setCredentials] = useState<LoginRequest>({
    username: '',
    password: ''
  });
  const [registerData, setRegisterData] = useState<RegisterRequest>({
    email: '',
    username: '',
    password: '',
    full_name: ''
  });
  const [error, setError] = useState<string>('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(credentials);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await register(registerData);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err: any) {
      setError(err.message || 'Logout failed');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
            {getUserInitials(user)}
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome!</h2>
          <p className="text-gray-600">{getUserDisplayName(user)}</p>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-semibold text-gray-900 mb-2">User Information</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <div><strong>Username:</strong> {user.username}</div>
              <div><strong>Email:</strong> {user.email}</div>
              <div><strong>Status:</strong> {user.is_active ? 'Active' : 'Inactive'}</div>
              <div><strong>Member since:</strong> {new Date(user.created_at).toLocaleDateString()}</div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded">
            <h3 className="font-semibold text-green-900 mb-2">Session Info</h3>
            <div className="text-sm text-green-700">
              <div>Token expires in: {formatTimeUntilExpiry() || 'Unknown'}</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setShowLogin(true)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              showLogin 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setShowLogin(false)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              !showLogin 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Register
          </button>
        </div>
      </div>

      {showLogin ? (
        <form onSubmit={handleLogin} className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 text-center">Login</h2>
          
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleRegister} className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 text-center">Register</h2>
          
          <div>
            <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="reg-email"
              value={registerData.email}
              onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="reg-username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              id="reg-username"
              value={registerData.username}
              onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="reg-fullname" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name (Optional)
            </label>
            <input
              type="text"
              id="reg-fullname"
              value={registerData.full_name}
              onChange={(e) => setRegisterData({ ...registerData, full_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="reg-password"
              value={registerData.password}
              onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  );
}