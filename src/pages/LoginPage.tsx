import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useUser } from "./UserContext";
import { loginAccount } from '@/lib/apiCalls';
import { useClient } from "./ClientContext";

export function LoginPage() {
  const navigate = useNavigate();
  const { setUserID } = useUser();
  const { setClientId } = useClient();
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);


  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    const rememberedPassword = localStorage.getItem("rememberedPassword");

    if (rememberedEmail && rememberedPassword) {
      setMobile(rememberedEmail);
      setPassword(rememberedPassword);
      setRememberMe(true);
    }
  }, []);

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
    if (rememberMe) {
      // ✅ Save to localStorage if "Remember Me" is checked
      localStorage.setItem("rememberedEmail", mobile);
      localStorage.setItem("rememberedPassword", password);
    } else {
      // ❌ Clear remembered data if "Remember Me" is unchecked
      localStorage.removeItem("rememberedEmail");
      localStorage.removeItem("rememberedPassword");
    }
    setClientId(null);
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
                <div className="flex items-center space-x-2 border rounded-xl p-2 bg-gray-100">
                  {/* Fixed +63 country code */}
                  <span className="text-gray-700 font-semibold">+63</span>

                  {/* Mobile Input */}
                  <Input 
                    id="mobile" 
                    type="tel" 
                    placeholder="9XXXXXXXXX" 
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))} 
                    pattern="[0-9]{10}" 
                    className="flex-1 bg-transparent border-none focus:ring-0 outline-none"
                    required
                  />
                </div>
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
              
              <div className="flex items-center space-x-2 mb-4">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
            />
            <label htmlFor="remember" className="text-sm text-gray-600">
              Remember me
            </label>
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
