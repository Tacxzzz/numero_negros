import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createAccount, verifyOTP } from '@/lib/apiCalls';
import { useUser } from "./UserContext";
import BetMotoLogo from "@/files/BetMotoLogoOnly.png"; 
import { PhoneIcon, LockIcon, LockKeyholeIcon, EyeOffIcon, EyeIcon } from "lucide-react";
import useBrowserCheck from '@/components/WebBrowserChecker';
import OpenInExternalBrowser from '@/components/OpenInExternalBrowser';
import termsPDF from "../files/terms.pdf"

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
   const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const API_URL = import.meta.env.VITE_DATABASE_URL;

   const { deviceID, userID } = useUser();
  
  const params = new URLSearchParams(window.location.search);
  const encodedData = params.get("data"); // Get encoded data
  let decodedRef = "";
  let decodedFromEmployer = "";
  let decodedMobile = "";
  let decodedUserType = "";

  if (encodedData) {
    try {
      const decodedParams = atob(encodedData); // Decode the full params
      const searchParams = new URLSearchParams(decodedParams); // Convert to object

      const ref = searchParams.get("ref"); // Extract referral ID
      const key = searchParams.get("key"); // Extract key
      const fromEmployer = searchParams.get("fromEmployer") ?? '';
      const employerMobile = searchParams.get("mobile") ?? '';
      const userType = searchParams.get("userType") ?? '';
      decodedRef = ref;
      decodedFromEmployer = fromEmployer;
      decodedMobile = employerMobile;
      decodedUserType = userType;
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

    if (mobile.charAt(0) !== '9') {
      setError("Please enter the 10 digits of your number starting with 9 e.g. 9123456789");
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError("Password must be at least 8 characters long and include 1 uppercase letter, 1 number, and 1 special character.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("mobile", mobile);
    formData.append('password', password);
    formData.append('referral', decodedRef);
    formData.append('fromEmployer', decodedFromEmployer);
    formData.append('userType', decodedUserType);
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
  
    if (!otp || otp.length !== 4) {
      setError("Please enter a valid 4-digit OTP.");
      return;
    }
  
    try {
      const data = await verifyOTP(mobile, otp, deviceID);
  
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

  const isMessengerWebview = useBrowserCheck();
    
  if (isMessengerWebview) {
      return <div> <OpenInExternalBrowser/> </div>;
  }
  
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Top promotional banner */}
        {/* <div className="w-full bg-blue-500 text-white text-center py-4 px-6 rounded-xl mb-5">
          <h2 className="text-xl font-bold">Sign Up and Get your free ₱15 credits</h2>
        </div> */}
        {/* Logo */}
        <div className="flex justify-center">
        <img src={BetMotoLogo} alt="BetMoto Logo" width="100" height="100" />
          {/* <div className="w-20 h-20 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center shadow-lg">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center shadow-lg"> */}
              {/* <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg> */}
              {/* <img src={PisoPlayLogo} alt="PisoPlay Logo" width="65" height="65" />
            </div>
          </div> */}
        </div>

        <h2 className="text-2xl font-bold text-center mb-3 text-[#c63018]">PisoGame Plus</h2>
        
        {/* Login Form */}
        {/* <div className="bg-white rounded-3xl shadow-xl overflow-hidden"> */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-center mb-4 text-[#000080] uppercase">Create an Account</h2>
            {decodedMobile !== '' && <p className="text-red-500 text-sm text-center mt-2">This link is from Coordinator : {decodedMobile}, 
              Note that this coordinator can view all your data since your signing up as his/her usher</p>}
            {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
            {!showOtp ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <Input type="hidden" value={decodedRef} name="referral" />

                {/* <div className="space-y-2">
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
                </div> */}

          <div className="flex">
            <div className="bg-blue-800 w-14 h-14 flex items-center justify-center">
              <PhoneIcon className="h-5 w-5 text-white" />
            </div>
            <Input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="9*********"
              className="flex-1 h-14 bg-gray-200 border-0 rounded-none text-lg"
            />
          </div>

                {/* <div className="space-y-2">
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
                </div> */}

                {/* Password */}
                <div className="mb-6">
                  <div className="flex items-center">
                    <div className="bg-blue-800 w-14 h-14 flex items-center justify-center">
                      <LockKeyholeIcon className="h-5 w-5 text-white" />
                    </div>
                    <div className="relative flex-1">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full h-14 bg-gray-200 border-0 rounded-none text-lg pr-12" // 👈 padding for icon
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOffIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="mb-6">
                  <div className="flex items-center">
                    <div className="bg-blue-800 w-14 h-14 flex items-center justify-center">
                      <LockKeyholeIcon className="h-5 w-5 text-white" />
                    </div>
                    <div className="relative flex-1">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        name="con_password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                        className="w-full h-14 bg-gray-200 border-0 rounded-none text-lg pr-12" // 👈 padding for icon
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOffIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                
                <p className="text-black-500 text-sm text-center mt-2">Please make sure your Password is at least 8 characters long and include 1 uppercase letter, 1 number, and 1 special character.</p>

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
                  <a href={termsPDF} target='_blank' className="text-pink-500"> Terms and Conditions</a>
                </Label>
              </div>
              <br/>
                <Button disabled={isLoading || !termsAccepted} type="submit" className="w-full custom-signup-button">
                {isLoading ? "Sending OTP..." : "Sign Up"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-gray-700">Enter OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="1234"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    maxLength={4}
                    pattern="\d{4}"
                    className="rounded-xl text-center tracking-widest text-xl"
                    required
                  />
                </div>

                <Button type="submit" className="w-full custom-signup-button">
                  Verify OTP & Create Account
                </Button>
              </form>
            )}

            
            <div className="mt-2 text-center">
            Already have an account?{" "}
            <a href="/" className="text-blue-800 hover:underline">Sign In</a>
            </div>
            
          {/* </div> */}

          {/* <div className="mt-8 flex items-center justify-between">
            <div className="bg-gray-200 rounded-full py-3 px-6 flex items-center">
            <a 
                href="https://www.youtube.com/watch?v=GYLa2dGGpTA" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-black-600 hover:text-blue-600 hover:underline"
              >
              <span className="mr-2 font-bold ">Click here to learn how to earn more</span>
                <div className="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="-3 -3 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500">
                    <ellipse cx="10" cy="7" rx="6" ry="2.5" />
                    <path d="M4 7v6c0 1.5 2.7 2.5 6 2.5s6-1 6-2.5V7" />
                    <path d="M4 13v6c0 1.5 2.7 2.5 6 2.5s6-1 6-2.5v-6" />
                  </svg>
                </div>
                </a>
              </div>
          </div> */}

        </div>
      </div>
    </div>
  );
}