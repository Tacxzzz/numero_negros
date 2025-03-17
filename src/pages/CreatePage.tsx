import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createAccount } from '@/lib/apiCalls';
import { useUser } from "./UserContext";

export function CreatePage() {
  const navigate = useNavigate();
  const { setUserID } = useUser();
  const [searchParams] = useSearchParams();
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState("");
  
  const params = new URLSearchParams(window.location.search);
  const encodedData = params.get("data"); // Get encoded data
  let decodedRef = "";
  if (encodedData) {
    try {
      const decodedParams = atob(encodedData); // Decode the full params
      const searchParams = new URLSearchParams(decodedParams); // Convert to object

      const ref = searchParams.get("ref"); // Extract referral ID
      const key = searchParams.get("key"); // Extract key
      decodedRef = ref;
      console.log("Decoded Ref:", ref);
      console.log("Decoded Key:", key);
    } catch (err) {
      console.error("Invalid referral code:", err.message);
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }


    const formData = new FormData();
    formData.append("mobile", mobile);
    formData.append('password', password);
    formData.append('referral', decodedRef);
    const data = await createAccount(formData);
    if(!data.authenticated){
      setError("An error occurred. Please try again.");
      return;
    }
    setUserID(data.userID);

    // Mock user registration (Replace with API call)
    localStorage.setItem("authToken", "user_authenticated");
    navigate("/dashboard"); // Redirect to dashboard after signup
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
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Create an Account</h2>
            {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
            <form onSubmit={handleLogin} className="space-y-4">
            <Input 
                  type="" 
                  value={decodedRef}
                  name="referral"
                />

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
                </div>
                <Input 
                  id="password" 
                  type="password"
                  name="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-xl"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-gray-700">Confirm Password</Label>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  name="con_password"
                  placeholder="••••••••" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="rounded-xl"
                  required
                />
              </div>
              
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white rounded-xl py-6 text-lg font-bold"
              >
                Sign Up
              </Button>
            </form>
            
            <div className="mt-6 text-center">
            Already have an account?{" "}
            <a href="/" className="text-blue-500 hover:underline">Sign In</a>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}