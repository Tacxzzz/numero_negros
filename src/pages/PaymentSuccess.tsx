import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Redirect to dashboard after 2 seconds
    setTimeout(() => {
      navigate("/dashboard");
    }, 2000);
  }, [location, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-green-500 text-2xl font-bold">Payment Successful!</h2>
      <p>Redirecting to dashboard...</p>
    </div>
  );
};
