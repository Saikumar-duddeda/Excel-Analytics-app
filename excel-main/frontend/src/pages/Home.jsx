import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { User, Shield, BarChart3, TrendingUp, FileSpreadsheet, Sparkles } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
              <BarChart3 className="h-16 w-16" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4" style={{ fontFamily: 'Manrope' }}>
            Excel Analytics Portal
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8">
            Transform Your Data into Actionable Insights with AI
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <FileSpreadsheet className="h-5 w-5" />
              <span>Excel Upload</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <TrendingUp className="h-5 w-5" />
              <span>Interactive Charts</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <Sparkles className="h-5 w-5" />
              <span>AI Insights</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Access Type</h2>
          <p className="text-gray-600">Select how you want to access the platform</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* User Access Card */}
          <Card 
            className="hover:shadow-2xl transition-all duration-300 border-2 hover:border-purple-400 cursor-pointer group"
            data-testid="user-access-card"
          >
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl group-hover:scale-110 transition-transform">
                  <User className="h-12 w-12 text-purple-600" />
                </div>
              </div>
              <CardTitle className="text-2xl text-gray-900">User Access</CardTitle>
              <CardDescription className="text-base">
                Create an account or sign in to analyze your Excel data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm text-gray-600 mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Upload Excel files (.xls, .xlsx)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <span>Create interactive charts</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Generate AI-powered insights</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Download charts as PNG/PDF</span>
                </div>
              </div>
              <Button
                onClick={() => navigate('/register')}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                size="lg"
                data-testid="user-signup-button"
              >
                Sign Up as User
              </Button>
              <Button
                onClick={() => navigate('/login')}
                variant="outline"
                className="w-full border-purple-300 hover:bg-purple-50"
                size="lg"
                data-testid="user-signin-button"
              >
                Sign In
              </Button>
            </CardContent>
          </Card>

          {/* Admin Access Card */}
          <Card 
            className="hover:shadow-2xl transition-all duration-300 border-2 hover:border-blue-400 cursor-pointer group"
            data-testid="admin-access-card"
          >
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl group-hover:scale-110 transition-transform">
                  <Shield className="h-12 w-12 text-blue-600" />
                </div>
              </div>
              <CardTitle className="text-2xl text-gray-900">Admin Access</CardTitle>
              <CardDescription className="text-base">
                Administrative portal for platform management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm text-gray-600 mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Manage all users</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  <span>View platform statistics</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Block/unblock users</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  <span>Access all features</span>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                <p className="text-xs text-blue-800 text-center font-medium">
                  Default Admin Credentials:
                </p>
                <p className="text-xs text-blue-600 text-center mt-1">
                  admin email
                </p>
                <p className="text-xs text-blue-600 text-center">
                  admin Password
                </p>
              </div>
              <Button
                onClick={() => navigate('/admin-login')}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                size="lg"
                data-testid="admin-login-button"
              >
                <Shield className="h-4 w-4 mr-2" />
                Admin Login
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">Why Choose Our Platform?</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow">
              <div className="inline-block p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full mb-4">
                <FileSpreadsheet className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-lg mb-2 text-gray-900">Easy Upload</h4>
              <p className="text-gray-600 text-sm">Support for .xls and .xlsx files up to 20MB</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow">
              <div className="inline-block p-3 bg-gradient-to-br from-pink-100 to-pink-200 rounded-full mb-4">
                <TrendingUp className="h-8 w-8 text-pink-600" />
              </div>
              <h4 className="font-semibold text-lg mb-2 text-gray-900">5 Chart Types</h4>
              <p className="text-gray-600 text-sm">Bar, Line, Scatter, Pie, and 3D Column charts</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow">
              <div className="inline-block p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full mb-4">
                <Sparkles className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-lg mb-2 text-gray-900">AI Powered</h4>
              <p className="text-gray-600 text-sm">Get insights with OpenAI GPT-4 integration</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-400">© 2025 Excel Analytics Portal. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
