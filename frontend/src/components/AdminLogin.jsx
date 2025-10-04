import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const AdminLogin = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simple admin login - in production, use proper authentication
    if (credentials.username === 'aparna' && credentials.password === 'diwali2025') {
      toast({ title: 'Welcome back, Aparna!', description: 'Successfully logged into admin panel' });
      onLogin(true);
    } else {
      toast({ 
        title: 'Invalid credentials', 
        description: 'Please check your username and password',
        variant: 'destructive' 
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md border-orange-200 shadow-2xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-amber-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            Admin Login
          </CardTitle>
          <p className="text-gray-600">Aparna's Diwali Delights</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                placeholder="Enter your username"
                className="border-orange-200 focus:border-orange-400"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter your password"
                  className="border-orange-200 focus:border-orange-400 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <Button
              type="submit"
              disabled={loading || !credentials.username || !credentials.password}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-6"
            >
              {loading ? 'Signing in...' : 'Sign In to Admin Panel'}
            </Button>
          </form>
          
          <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-sm text-orange-700 text-center">
              <strong>Demo Credentials:</strong><br />
              Username: aparna<br />
              Password: diwali2025
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;