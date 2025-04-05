import { cashInCashkoPAID } from "@/lib/apiCalls";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get the query parameters from the URL
    const urlParams = new URLSearchParams(location.search);
    const clientNo = urlParams.get("clientNo");


    const handleUpdate = async () => {
      const data = await cashInCashkoPAID(clientNo);
    }

    // Check if the clientNo parameter exists
    if (clientNo) 
    {
      console.log("Client No:", clientNo);
      handleUpdate();
    } 
    else 
    {
      console.log("clientNo parameter not found.");
    }

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
