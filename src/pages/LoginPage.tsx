import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useUser } from "./UserContext";
import { loginAccount } from '@/lib/apiCalls';

export function LoginPage() {
  const navigate = useNavigate();
  const { setUserID } = useUser();
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');


  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('authToken'); // Replace 'authToken' with your actual storage key
    if (token) {
      navigate('/dashboard'); // Redirect to dashboard if token exists
    }
  }, [navigate]);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("mobile", mobile);
    formData.append('password', password);
    const data = await loginAccount(formData);
    if(!data.authenticated){
      setError("Invalid mobile number or password.");
      return;
    }
    setUserID(data.userID);
    localStorage.setItem('authToken', 'user_authenticated'); // Store token
    navigate('/dashboard'); // Redirect to dashboard
    
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 to-sky-300 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-500 flex items-center justify-center shadow-lg">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Login Form */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Welcome Back!</h2>

            {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mobile" className="text-gray-700">Mobile Number</Label>
                <Input 
                  id="mobile" 
                  type="number" 
                  placeholder="Mobile Number" 
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="rounded-xl"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-gray-700">Password</Label>
                  <a href="#" className="text-sm text-blue-500 hover:underline">Forgot Password?</a>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-xl"
                  required
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <label htmlFor="remember" className="text-sm text-gray-600">Remember me</label>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white rounded-xl py-6 text-lg font-bold"
              >
                Sign In
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-600">Don't have an account? <a href="/create-account" className="text-blue-500 hover:underline">Sign Up</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
