import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createAccount, verifyOTP } from '@/lib/apiCalls';
import { useUser } from "./UserContext";
import PisoPlayLogo from "@/files/LogoWithName.svg"; 

export function CreatePage() {
  const navigate = useNavigate();
  const { setUserID } = useUser();
  const [searchParams] = useSearchParams();
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);  
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const API_URL = import.meta.env.VITE_DATABASE_URL;

  
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


    setIsLoading(true);

    const formData = new FormData();
    formData.append("mobile", mobile);
    formData.append('password', password);
    formData.append('referral', decodedRef);
    const data = await createAccount(formData);
    if(!data.authenticated){
      setError("An error occurred. Please try again.");
      setIsLoading(false);
      return;
    }
    setUserID(data.userID);
    setError("");
    setShowOtp(true);
  };


  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
  
    if (!otp || otp.length !== 8) {
      setError("Please enter a valid 8-digit OTP.");
      return;
    }
  
    try {
      const data = await verifyOTP(mobile, otp);
  
      if (!data.authenticated) {
        setError(data.message);
        return;
      }

      localStorage.setItem("authToken", "user_authenticated");
      navigate("/dashboard");
    } catch (err) {
      setError("OTP verification failed.");
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 to-sky-300 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center shadow-lg">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center shadow-lg">
              {/* <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg> */}
              <img src={PisoPlayLogo} alt="PisoPlay Logo" width="65" height="65" />
            </div>
          </div>
        </div>
        
        {/* Login Form */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Create an Account</h2>
            {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
            {!showOtp ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <Input type="hidden" value={decodedRef} name="referral" />

                <div className="space-y-2">
                  <Label htmlFor="mobile" className="text-gray-700">Mobile Number</Label>
                  <div className="flex items-center space-x-2 border rounded-xl p-2 bg-gray-100">
                    <span className="text-gray-700 font-semibold">+63</span>
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
                  <Label htmlFor="password" className="text-gray-700">Password</Label>
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
                  <Label htmlFor="confirm-password" className="text-gray-700">Confirm Password</Label>
                  <Input 
                    id="confirm-password" 
                    type="password" 
                    name="con_password"
                    placeholder="••••••••" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="rounded-xl"
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="terms" 
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="h-4 w-4 text-pink-500 focus:ring-0"
                  required
                />
                <Label htmlFor="terms" className="text-sm text-gray-700">
                  I agree to the 
                  <a href={API_URL +"/img/terms.pdf"} target='_blank' className="text-pink-500"> Terms and Conditions</a>
                </Label>
              </div>
                <Button disabled={isLoading || !termsAccepted} type="submit" className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-xl py-6 text-lg font-bold">
                {isLoading ? "Sending OTP..." : "Send OTP"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-gray-700">Enter OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="12345678"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 8))}
                    maxLength={8}
                    pattern="\d{8}"
                    className="rounded-xl text-center tracking-widest text-xl"
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl py-6 text-lg font-bold">
                  Verify OTP & Create Account
                </Button>
              </form>
            )}

            
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