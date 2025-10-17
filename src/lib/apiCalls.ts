import axios from "axios";
import CryptoJS from "crypto-js";

const API_URL = import.meta.env.VITE_DATABASE_URL;
const rawToken = import.meta.env.VITE_API_KEY;
const API_KEY = btoa(rawToken);

axios.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("authToken"); // or sessionStorage
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export const createAccount = async (
  formData: FormData,
) => {
  try {
    const response = await axios.post(
      `${API_URL}/main/create`,
      formData,
      { headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,  } }
    );

    if (response.data && response.data.authenticated) {
      const userData = response.data;
      return {
        userID: userData.userID,
        authenticated: userData.authenticated
      };
    } else {
      console.warn("User data is empty or invalid.");
      return { userID: "none", authenticated: false };
    }
    
  } catch (error) {
    console.error("Failed to send remittance:", error);
    return { userID: "none", authenticated: false };
  }
};

export const updatePassword = async (
  userID: string, password: string , newPassword: string
) => {
  try {
    const response = await axios.post(`${API_URL}/main/updatePassword`, { userID, password, newPassword },{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

    if (response.data && response.data.authenticated) {
      const userData = response.data;
      return {
        authenticated: userData.authenticated
      };
    } else {
      console.warn("User data is empty or invalid.");
      return { authenticated: false };
    }
    
  } catch (error) {
    console.error("Failed to send remittance:", error);
    return {  authenticated: false };
  }
};


export const verifyOTP = async (
  mobile: string, otp: string, deviceID: string
) => {
  try {
    const response = await axios.post(`${API_URL}/main/verifyOTP`, { mobile, otp, deviceID },{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

    if (response.data) {
      if(response.data.authenticated)
      {
        const userData = response.data;
        return {
          authenticated: userData.authenticated
        };
      }
      else
      {
        const userData = response.data;
        return {
          authenticated: userData.authenticated,
          message: userData.message
        };
      }
      
    } else {
      console.warn("User data is empty or invalid.");
      return { authenticated: false, message: "no response on the api" };
    }
    
  } catch (error) {
    console.error("Failed to send remittance:", error);
    return {  authenticated: false,message: "no response on the api" };
  }
};


export const verifyOTPForgot = async (
  mobile: string, otp: string 
) => {
  try {
    const response = await axios.post(`${API_URL}/main/verifyOTPForgot`, { mobile, otp },{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

    if (response.data) {
      if(response.data.authenticated)
      {
        const userData = response.data;
        return {
          authenticated: userData.authenticated,
          userID: userData.userID
        };
      }
      else
      {
        const userData = response.data;
        return {
          authenticated: userData.authenticated,
          message: userData.message
        };
      }
      
    } else {
      console.warn("User data is empty or invalid.");
      return { authenticated: false, message: "no response on the api" };
    }
    
  } catch (error) {
    console.error("Failed to send remittance:", error);
    return {  authenticated: false,message: "no response on the api" };
  }
};


export const sendOTPForReset = async (
  mobile: string
) => {
  try {
    const response = await axios.post(`${API_URL}/main/sendOTPForReset`, { mobile },{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

    if (response.data) {
      if(response.data.authenticated)
      {
        const userData = response.data;
        return {
          authenticated: userData.authenticated
        };
      }
      else
      {
        const userData = response.data;
        return {
          authenticated: userData.authenticated,
          message: userData.message
        };
      }
      
    } else {
      console.warn("User data is empty or invalid.");
      return { authenticated: false, message: "no response on the api" };
    }
    
  } catch (error) {
    console.error("Failed to send remittance:", error);
    return {  authenticated: false,message: "no response on the api" };
  }
};



export const verifyOTPLogin = async (
  mobile: string, otp: string, deviceID: string
) => {
  try {
    const response = await axios.post(`${API_URL}/main/verifyOTPLogin`, { mobile, otp, deviceID },{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

    if (response.data) {
      if(response.data.authenticated)
      {
        const userData = response.data;
        return {
          authenticated: userData.authenticated,
          userID: userData.userID
        };
      }
      else
      {
        const userData = response.data;
        return {
          authenticated: userData.authenticated,
          message: userData.message
        };
      }
      
    } else {
      console.warn("User data is empty or invalid.");
      return { authenticated: false, message: "no response on the api" };
    }
    
  } catch (error) {
    console.error("Failed to send remittance:", error);
    return {  authenticated: false,message: "no response on the api" };
  }
};



export const loginAccount = async (
  formData: FormData,
) => {
  try {
    const response = await axios.post(
      `${API_URL}/main/login`,
      formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      }
    );

    if (response.data && response.data.authenticated) {
      const userData = response.data;
      return {
        userID: userData.userID,
        authenticated: userData.authenticated,
        newDevice: userData.newDevice,
        token: userData.token
      };
    } else {
      console.warn("User data is empty or invalid.");
      return { userID: "none", authenticated: false };
    }
    
  } catch (error) {
    console.error("Failed to send remittance:", error);
    return { userID: "none", authenticated: false };
  }
};





export const getTransactions = async (userID: string) => {
  try {
    const response = await axios.post(`${API_URL}/main/getTransactions`, { userID },{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data.error) {
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch recipients:", error);
    return null;
  }
};


export const updateDatabase = async (user: any , getAccessTokenSilently: any) => {
  try {
    console.log(user.email);
    const token = await getAccessTokenSilently();
    const response = await axios.post(
      `${API_URL}/main/login`,
      { email: user.email },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const userID = response.data.userID;
    console.log(userID);
    return { dbUpdate: true, userID: userID };
  } catch (error) {
    console.error("Database update failed:", error);
    return { dbUpdate: false, userID: "id" };
  } 
};



export const fetchUserData = async (userID: string, deviceID: string) => { 
  try {
    const response = await axios.post(`${API_URL}/main/getUserData`, { userID, deviceID },{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });
      
    const data = response.data;

    if (data?.error === "ERROR") {
      return null;
    }

    if (data?.error === "invalid") {
      alert("DEVICE ID ALREADY EXISTS!");
      localStorage.removeItem("authToken");
      localStorage.removeItem("identifier");
      localStorage.removeItem("deviceIDFingerPrint");
      window.location.reload();
      return null;
    }

    return data; // now always returning an object or null
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    return null;
  }
};



export const fetchUserDataDyna = async (userID: string) => {
  try {
    const response = await axios.post(`${API_URL}/main/getUserDataDyna`, { userID },{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data.error) {
      return null;
    }
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    return null;
  }
};


export const getReferrals = async (id: string
) => {
  try {
    const response = await axios.post(`${API_URL}/main/getReferrals`, { userID: id },{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

    if (response.data && response.data.authenticated) {
      const userData = response.data;
      return {
        level1: userData.level1,
        level2: userData.level2,
        nolimit: userData.nolimit,
      };
    } else {
      console.warn("User data is empty or invalid.");
      return { level1: "", level2: "", nolimit: "" };
    }
    
  } catch (error) {
    console.error("Failed to send remittance:", error);
    return { level1: "", level2: "", nolimit: "" };
  }
};


export const getBetsWinners = async () => {
  try {
    const response = await axios.get(`${API_URL}/main/getBetsWinners`,{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data.error) {
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return [];
  }
};

export const getDrawResultsToday = async () => {
  try {
    const response = await axios.get(`${API_URL}/main/getDrawResultsToday`, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data.error) {
      return [];
    }
  } catch (error) {
    console.error('Failed to fetch draws today:', error);
    return[];
  }
}

export const getGamesToday = async () => {
  try {
    const response = await axios.get(`${API_URL}/main/getGamesToday`,{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

    console.log(response);
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data.error) {
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return [];
  }
};

export const getGames = async () => {
  try {
    const response = await axios.get(`${API_URL}/main/getGames`,{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data.error) {
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return [];
  }
};


export const getGameTypes = async (game_id: string, user_type: string) => {
  try {
    const response = await axios.post(`${API_URL}/main/getGameTypes`, { game_id, user_type },{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data.error) {
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch game types:", error);
    return [];
  }
};

export const getGameByID = async (game_id: string) => {
  try {
    const response = await axios.post(`${API_URL}/main/getGameByID`, { game_id },{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data.error) {
      return null;
    }
  } catch (error) {
    console.error("Failed to fetch game types:", error);
    return null;
  }
};


export const getDrawByID = async (game_id: string) => {
  try {
    const response = await axios.post(`${API_URL}/main/getDrawByID`, { game_id },{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data.error) {
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch game types:", error);
    return [];
  }
};

export const getDrawsByID = async (game_id: string) => {
  try {
    const response = await axios.post(`${API_URL}/main/getDrawsByID`, { game_id },{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data.error) {
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch game types:", error);
    return [];
  }
};

export const getGameTypeByID = async (game_id: string, user_type: string) => {
  try {
    const response = await axios.post(`${API_URL}/main/getGameTypeByID`, { game_id, user_type },{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });
      console.log(response);
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data.error) {
      return null;
    }
  } catch (error) {
    console.error("Failed to fetch game types:", error);
    return null;
  }
};

export const getGameTypesByID = async (game_id: string, user_type: string) => {
  try {
    const response = await axios.post(`${API_URL}/main/getGameTypesByID`, { game_id, user_type },{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data.error) {
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch game types:", error);
    return [];
  }
};



export const confirmBet = async (
  formData: FormData,
) => {
  try {
    const response = await axios.post(
      `${API_URL}/main/confirmBet`,
      formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      }
    );

    if (response.data) {

      const userData = response.data;
      return {
        authenticated: userData.authenticated,
        message: userData.message,
        receipt_id: userData.receipt_id,
        back: userData.back,
      };

    } else {
      console.warn("User data is empty or invalid.");
      return { authenticated: false, message: "no response on the api",back:true };
    }
    
  } catch (error) {
    console.error("Failed to send remittance:", error);
    return { authenticated: false, message: "no response on the api",back:true };
  }
};

export const saveBet = async (
  formData: FormData,
) => {
  try {
    const response = await axios.post(
      `${API_URL}/main/saveBet`,
      formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      }
    );

    if (response.data) {
      console.log(response.data)
      const userData = response.data;
      return {
        authenticated: userData.authenticated,
        receipt_id: userData.receipt_id,
        message: userData.message,
        back: userData.back,
      };

    } else {
      console.warn("User data is empty or invalid.");
      return { authenticated: false, message: "no response on the api",back:true };
    }
    
  } catch (error) {
    console.error("Failed to send remittance:", error);
    return { authenticated: false, message: "no response on the api",back:true };
  }
};

export const getBetsByUserAndDraw = async (game_id: string, userID: string) => {
  try {
    const response = await axios.post(`${API_URL}/main/getBetsByUserAndDraw`, { game_id, userID },{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data.error) {
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch game types:", error);
    return [];
  }
};

export const getMyBets = async (userID: string) => {
  try {
    const response = await axios.post(`${API_URL}/main/getMyBets`, {userID },{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data.error) {
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch game types:", error);
    return null;
  }
};

export const getMySavedBets = async (userID: string) => {
  try {
    const response = await axios.post(`${API_URL}/main/getMySavedBets`, {userID },{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

      console.log(response.data);
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data.error) {
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch game types:", error);
    return null;
  }
};

export const confirmSavedBets = async (userID: string, selectedBets: any[]) => {
  try {
    const response = await axios.post(
      `${API_URL}/main/confirmSavedBets`,
      {
        userID,
        bets: selectedBets
      },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      }
    );
    
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to confirm saved bets:", error);
    throw error;
  }
};

export const deleteSavedBets = async (userID: string, selectedBets: any[]) => {
  try {
    const response = await axios.post(
      `${API_URL}/main/deleteSavedBets`,
      {
        userID,
        bets: selectedBets
      },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      }
    );
    
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to confirm saved bets:", error);
    throw error;
  }
};

export const getDrawsResults = async () => {
  try {
    const response = await axios.get(`${API_URL}/main/getDrawsResults`,{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data.error) {
      return null;
    }
  } catch (error) {
    console.error("Failed to fetch game types:", error);
    return null;
  }
};


export const checkCurrentBetsTotal = async (draw_id: string) => {
  try {
    const response = await axios.post(`${API_URL}/main/checkCurrentBetsTotal`, {draw_id },{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

    if (response.data && response.data.authenticated) {
      const userData = response.data;
      return {
        authenticated: userData.authenticated,
        totalBets: userData.totalBets,
      };
    } else {
      console.warn("User data is empty or invalid.");
      return null;
    }
    
  } catch (error) {
    console.error("Failed to send remittance:", error);
    return null;
  }
};



export const getMyBetClientsCount = async (userID: string) => {
  try {
    const response = await axios.post(`${API_URL}/main/getMyBetClientsCount`, {userID },{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

    if (response.data && response.data.authenticated) {
      const userData = response.data;
      return {
        authenticated: userData.authenticated,
        countClients: userData.countClients,
      };
    } else {
      console.warn("User data is empty or invalid.");
      return { authenticated: false, countClients: '0' };
    }
  } catch (error) {
    console.error("Failed to send remittance:", error);
    return { authenticated: false, countClients: '0' };
  }
};



export const saveFavorite = async (userID: string, game_id: string, bet:string) => {
  try {
    const response = await axios.post(`${API_URL}/main/saveFavorite`, {userID,game_id,bet },{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

    if (response.data && response.data.authenticated) {
      const userData = response.data;
      return {
        authenticated: userData.authenticated,
      };
    } else {
      console.warn("User data is empty or invalid.");
      return { authenticated: false };
    }
  } catch (error) {
    console.error("Failed to send remittance:", error);
    return { authenticated: false };
  }
};

export const readMyFavorite = async (userID: string, game_id: string) => {
  try {
    const response = await axios.post(`${API_URL}/main/readMyFavorite`, {userID,game_id },{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

    if (response.data && response.data.authenticated) {
      const userData = response.data;
      return {
        authenticated: userData.authenticated,
        bet: userData.bet,
      };
    } else {
      console.warn("User data is empty or invalid.");
      return { authenticated: false,bet: '' };
    }
  } catch (error) {
    console.error("Failed to send remittance:", error);
    return { authenticated: false,bet: '' };
  }
};



export const getMyBetClients = async (userID: string) => {
  try {
    const response = await axios.post(`${API_URL}/main/getMyBetClients`, {userID },{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

      console.log(response);

    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data.error) {
      return null;
    }
  } catch (error) {
    console.error("Failed to fetch game types:", error);
    return null;
  }
};




export const addBetClients = async (
  formData: FormData,
) => {
  try {
    const response = await axios.post(
      `${API_URL}/main/addBetClients`,
      formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      }
    );

    if (response.data) {

      const userData = response.data;
      return {
        authenticated: userData.authenticated,
      };

    } else {
      console.warn("User data is empty or invalid.");
      return { authenticated: false };
    }
    
  } catch (error) {
    console.error("Failed to send remittance:", error);
    return { authenticated: false };
  }
};


export const updateBetClient = async (
  formData: FormData,
) => {
  try {
    const response = await axios.post(
      `${API_URL}/main/updateBetClient`,
      formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      }
    );

    if (response.data) {

      const userData = response.data;
      return {
        authenticated: userData.authenticated,
      };

    } else {
      console.warn("User data is empty or invalid.");
      return { authenticated: false };
    }
    
  } catch (error) {
    console.error("Failed to send remittance:", error);
    return { authenticated: false };
  }
};



export const getBetClientData = async (id: string) => {
  try {
    const response = await axios.post(`${API_URL}/main/getBetClientData`, { clientID: id },{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

    if (response.data && response.data.length > 0) {
      const userData = response.data[0];
      return {
        full_name: userData.full_name ?? "",
      };
    } else {
      console.warn("User data is empty or invalid.");
      return { balance: 0,mobile: "",referral: "", status: "none", agent: "" };
    }
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    return { balance: 0,mobile: "",referral: "", status: "none", agent: "" };
  }
};


export const cashInCashko = async (
  amountToPay: string, creditCashin: string, userID: string, channel:string 
) => {
  try {
    const timestamp = Date.now().toString();
    const clientNo = `PP${timestamp}`;
    const amount = amountToPay.toString();
    const hrefbackurl = `${window.location.origin}/payment-success`
    const callbackurl = API_URL;

    const res = await axios.post(`${API_URL}/main/cashInRequest`, {userID, creditCashin,amount ,clientNo, channel, hrefbackurl, callbackurl, timestamp },{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });
      console.log(res);
      if (res.data && res.data.authenticated) {
        window.location.href = res.data.payUrl;
        return { error: false };
      } 
      else 
      {
        console.warn("User data is empty or invalid.");
        return { error: true };
      }
  } catch (error) {
    console.error("Cashko request failed:", error);
    return {error: true};
  }
};

export const cashOutCashko = async (
  userID: string,
  winnings: string,
  full_name: string,
  bank: string,
  account: string
) => {
  try {
    const timestamp = Date.now().toString();
    const clientNo = `PPCO${timestamp}`;
    const callbackurl = `${API_URL}`;

    const res = await axios.post(`${API_URL}/main/cashOutRequest`, {
        userID,
        clientNo,
        winnings,
        full_name,
        bank,
        account,
        callbackurl,
        timestamp
      },{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });
      console.log("result:");
      console.log(res);
      if (res.data && res.data.authenticated) {
        return { error: false };
      } else {
        const message = res.data?.error || "User data is empty or invalid.";
        return { error: true, message };
      }
  } catch (error) {
    console.error("Cashko request failed:", error);
    return { error: true , message:"Cashko api request failed." };
  }
};



export const cashOutCashkoCommission = async (
  userID: string,
  commissions: string,
  full_name: string,
  bank: string,
  account: string
) => {
  try {
    const timestamp = Date.now().toString();
    const clientNo = `PPCO${timestamp}`;
    const callbackurl = `${API_URL}`;

    const res = await axios.post(`${API_URL}/main/cashOutRequestCommissions`, {
        userID,
        clientNo,
        commissions,
        full_name,
        bank,
        account,
        callbackurl,
        timestamp
      },{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

      if (res.data && res.data.authenticated) {
        return { error: false };
      } else {
        const message = res.data?.error || "User data is empty or invalid.";
        return { error: true, message };
      }
  } catch (error) {
    console.error("Cashko request failed:", error);
    return { error: true , message:"Cashko api request failed." };
  }
};



export const getAnnouncements = async () => {
  try {
    const response = await axios.get(`${API_URL}/main/getAnnouncements`,{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data.error) {
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return [];
  }
};

export const checkMaintainingBalance = async (userID : string) => {
  try {
    const response = await axios.post(`${API_URL}/main/checkMaintainingBalance`, {userID},{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

    if (!response.data.authenticated || !response.data.proceed) {
      const message = response.data.message;
      return { error: true, message };
    } 

    return response.data;

  } catch (error) {
    return [];
  }
};


export const getCommissions = async (
  id: string
) => {
  try {
    const response = await axios.post(`${API_URL}/main/getCommissions`, { userID:id },{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

    if (response.data) {
      if(response.data.authenticated)
      {
        const userData = response.data;
        return {
          authenticated: userData.authenticated,
          total_amount: userData.total_amount,
        };
      }
      else
      {
        const userData = response.data;
        return {
          authenticated: userData.authenticated,
          message: userData.message
        };
      }
      
    } else {
      console.warn("User data is empty or invalid.");
      return { authenticated: false, message: "no response on the api" };
    }
    
  } catch (error) {
    console.error("Failed to send remittance:", error);
    return {  authenticated: false,message: "no response on the api" };
  }
};






///TEAM DASHBOARD

export const getRateChartDataTeam = async (id:string,start_date:string, end_date:string) => {
  try {
    const response = await axios.post(`${API_URL}/main/getRateChartDataTeam`, { userID: id ,start_date: start_date, end_date: end_date},{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });
    
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data.error) {
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return [];
  }
};


export const countBetsEarnedTeam = async (id:string,start_date:string, end_date:string) => {
  try {
    const response = await axios.post(`${API_URL}/main/countBetsEarnedTeam`, { userID: id ,start_date: start_date, end_date: end_date},{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });
    
    if (response.data) 
      {
      const userData = response.data;
      console.log(response);
      return {
        count: userData.count,
      };
    } 
    else 
    {
      console.warn("User data is empty or invalid.");
      return { count: '-' };
    }
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return { count: '-' };
  }
};


export const totalWinsTeam = async (id:string,start_date:string, end_date:string) => {
  try {
    const response = await axios.post(`${API_URL}/main/totalWinsTeam`, { userID: id ,start_date: start_date, end_date: end_date},{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });
    
    if (response.data) 
      {
      const userData = response.data;
      console.log(response);
      return {
        count: userData.count,
      };
    } 
    else 
    {
      console.warn("User data is empty or invalid.");
      return { count: '-' };
    }
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return { count: '-' };
  }
};


export const totalBalancePlayersTeam = async (id:string,start_date:string, end_date:string) => {
  try {

    const response = await axios.post(`${API_URL}/main/totalBalancePlayersTeam`, { userID: id ,start_date: start_date, end_date: end_date},{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });
    
    if (response.data) 
      {
      const userData = response.data;
      console.log(response);
      return {
        count: userData.count,
      };
    } 
    else 
    {
      console.warn("User data is empty or invalid.");
      return { count: '-' };
    }
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return { count: '-' };
  }
};

export const totalCommissionsTeam = async (id:string,start_date:string, end_date:string) => {
  try {

    const response = await axios.post(`${API_URL}/main/totalCommissionsTeam`, { userID: id ,start_date: start_date, end_date: end_date},{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });
    
    if (response.data) 
      {
      const userData = response.data;
      console.log(response);
      return {
        count: userData.count,
      };
    } 
    else 
    {
      console.warn("User data is empty or invalid.");
      return { count: '-' };
    }
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return { count: '-' };
  }
};

export const totalPlayersTeam = async (id:string,start_date:string, end_date:string) => {
  try {

    const response = await axios.post(`${API_URL}/main/totalPlayersTeam`, { userID: id ,start_date: start_date, end_date: end_date},{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });
    
    if (response.data) 
      {
      const userData = response.data;
      console.log(response);
      return {
        count: userData.count,
      };
    } 
    else 
    {
      console.warn("User data is empty or invalid.");
      return { count: '-' };
    }
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return { count: '-' };
  }
};

export const totalClientsTeam = async (id:string,start_date:string, end_date:string) => {
  try {

    const response = await axios.post(`${API_URL}/main/totalClientsTeam`, { userID: id ,start_date: start_date, end_date: end_date},{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });
    
    if (response.data) 
      {
      const userData = response.data;
      console.log(response);
      return {
        count: userData.count,
      };
    } 
    else 
    {
      console.warn("User data is empty or invalid.");
      return { count: '-' };
    }
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return { count: '-' };
  }
};

export const totalCashinTeam = async (id:string,start_date:string, end_date:string) => {
  try {

    const response = await axios.post(`${API_URL}/main/totalCashinTeam`, { userID: id ,start_date: start_date, end_date: end_date},{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });
    
    if (response.data) 
      {
      const userData = response.data;
      console.log(response);
      return {
        count: userData.count,
      };
    } 
    else 
    {
      console.warn("User data is empty or invalid.");
      return { count: '-' };
    }
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return { count: '-' };
  }
};

export const totalCashOutTeam = async (id:string,start_date:string, end_date:string) => {
  try {

    const response = await axios.post(`${API_URL}/main/totalCashOutTeam`, { userID: id ,start_date: start_date, end_date: end_date},{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });
    
    if (response.data) 
      {
      const userData = response.data;
      console.log(response);
      return {
        count: userData.count,
      };
    } 
    else 
    {
      console.warn("User data is empty or invalid.");
      return { count: '-' };
    }
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return { count: '-' };
  }
};



export const allowAccessReferrer = async (
  userID: string, allow: string 
) => {
  try {
    const response = await axios.post(`${API_URL}/main/allowAccessReferrer`, { userID, allow},{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

    if (response.data && response.data.authenticated) {
      const userData = response.data;
      return {
        authenticated: userData.authenticated
      };
    } else {
      console.warn("User data is empty or invalid.");
      return { authenticated: false };
    }
    
  } catch (error) {
    console.error("Failed to send remittance:", error);
    return {  authenticated: false };
  }
};

export const removeAccessReferrer = async (
  userID: string, allow: string 
) => {
  try {
    const response = await axios.post(`${API_URL}/main/removeAccessReferrer`, { userID, allow},{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

    if (response.data && response.data.authenticated) {
      const userData = response.data;
      return {
        authenticated: userData.authenticated
      };
    } else {
      console.warn("User data is empty or invalid.");
      return { authenticated: false };
    }
    
  } catch (error) {
    console.error("Failed to send remittance:", error);
    return {  authenticated: false };
  }
};



export const getDownlinesTable = async (userID: string, type:string) => {
  try {
    const response = await axios.post(`${API_URL}/main/getDownlinesTable`, { userID, type },{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data.error) {
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch recipients:", error);
    return null;
  }
};

export const getBetsEarnedTeamTable = async (userID: string) => {
  try {
    const response = await axios.post(`${API_URL}/main/getBetsEarnedTeamTable`, { userID },{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data.error) {
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch recipients:", error);
    return null;
  }
};

export const getBetsTableByUser = async (userID: string) => {
  try {
    const response = await axios.post(`${API_URL}/main/getBetsTableByUser`, { userID },{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data.error) {
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch recipients:", error);
    return null;
  }
};

export const getWinsTeamTable = async (userID: string) => {
  try {
    const response = await axios.post(`${API_URL}/main/getWinsTeamTable`, { userID },{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data.error) {
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch recipients:", error);
    return null;
  }
};

export const getCommissionsTeamTable = async (userID: string) => {
  try {
    const response = await axios.post(`${API_URL}/main/getCommissionsTeamTable`, { userID },{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data.error) {
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch recipients:", error);
    return null;
  }
};

export const totalCashinTeamTable = async (userID: string) => {
  try {
    const response = await axios.post(`${API_URL}/main/totalCashinTeamTable`, { userID },{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data.error) {
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch recipients:", error);
    return null;
  }
};

export const getCashinsTableByUser = async (userID: string) => {
  try {
    const response = await axios.post(`${API_URL}/main/getCashinsTableByUser`, { userID },{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data.error) {
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch recipients:", error);
    return null;
  }
};

export const totalCashoutTeamTable = async (userID: string) => {
  try {
    const response = await axios.post(`${API_URL}/main/totalCashoutTeamTable`, { userID },{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data.error) {
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch recipients:", error);
    return null;
  }
};

export const getCashoutsTableByUser = async (userID: string) => {
  try {
    const response = await axios.post(`${API_URL}/main/getCashoutsTableByUser`, { userID },{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data.error) {
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch recipients:", error);
    return null;
  }
};




export const convertWinsToBalance = async (
  userID: string,
  amount: string,
) => {
  try {

      const res = await axios.post(`${API_URL}/main/convertWinsToBalance`, {
        userID,amount
      },{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

      if (res.data && res.data.authenticated) {
        return { error: false };
      } else {
        return { error: true, message:res.data.error };
      }
    
  } catch (error) {
    return { error: true , message:"conversion failed." };
  }
};

export const convertCommissionsToBalance = async (
  userID: string,
  amount: string,
) => {
  try {

      const res = await axios.post(`${API_URL}/main/convertCommissionsToBalance`, {
        userID,amount
      },{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

      if (res.data && res.data.authenticated) {
        return { error: false };
      } else {
        return { error: true, message:res.data.error };
      }
    
  } catch (error) {
    return { error: true , message:"conversion failed." };
  }
};



export const setDailyRewards = async (userID: string) => {
  try {
    const response = await axios.post(`${API_URL}/main/setDailyRewards`, { userID },{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

    if (Array.isArray(response.data)) {
      console.log(response.data);
      return response.data;
    } else if (response.data.error) {
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch recipients:", error);
    return [];
  }
};


export const claimDailyReward = async (
  userID: string, reward: string, input: string
) => {
  try {
    const response = await axios.post(`${API_URL}/main/claimDailyReward`, { userID, reward, input},{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

    if (response.data && response.data.authenticated) {
      const userData = response.data;
      return {
        authenticated: userData.authenticated
      };
    } else {
      console.warn("User data is empty or invalid.");
      return { authenticated: false };
    }
    
  } catch (error) {
    console.error("Failed to send remittance:", error);
    return {  authenticated: false };
  }
};


export const getBetByID = async (
  betID: string
) => {
  try {
    const response = await axios.post(`${API_URL}/main/getBetByID`, { betID},{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

    if (Array.isArray(response.data)) {
      console.log(response.data);
      
    } else if (response.data.error) {
      return [];
    }
    return response.data;
  } catch (error) {
    console.error("Failed to fetch recipients:", error);
    return [];
  }
};

export const getSavedBetByID = async (
  betID: string
) => {
  try {
    const response = await axios.post(`${API_URL}/main/getSavedBetByID`, { betID},{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

    if (Array.isArray(response.data)) {
      console.log(response.data);
      
    } else if (response.data.error) {
      return [];
    }
    return response.data;
  } catch (error) {
    console.error("Failed to fetch recipients:", error);
    return [];
  }
};

export const addLog = async (
  userID: string, activity: string 
) => {
  try {
    const response = await axios.post(`${API_URL}/main/addLog`, { userID, activity},{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

    if (response.data && response.data.authenticated) {
      const userData = response.data;
      return {
        authenticated: userData.authenticated
      };
    } else { 
      console.warn("User data is empty or invalid.");
      return { authenticated: false };
    }
    
  } catch (error) {
    console.error("Failed to send remittance:", error);
    return {  authenticated: false };
  }
};

export const adjustEmployeeCommission = async (
  userID: string, amount: string 
) => {
  try {
    const response = await axios.post(`${API_URL}/main/adjustEmployeeCommission`, { userID, amount},{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

    if (response.data && response.data.authenticated) {
      const userData = response.data;
      return {
        authenticated: userData.authenticated,
        error: userData.error
      };
    } else { 
      console.warn("User data is empty or invalid.");
      return { authenticated: false };
    }
    
  } catch (error) {
    console.error("Failed to send remittance:", error);
    return {  authenticated: false };
  }
};

export const getMySavedBetsCount = async (userID:string) => {
  try {
    const response = await axios.post(`${API_URL}/main/getMySavedBetsCount`, { userID: userID},{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });
    
    if (response.data) 
      {
      const userData = response.data;
      console.log(response);
      return {
        count: userData.count,
      };
    } 
    else 
    {
      console.warn("User data is empty or invalid.");
      return { count: '-' };
    }
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return { count: '-' };
  }
};

export const getUserType = async () => {
  try {
    const response = await axios.post(`${API_URL}/main/getUserType`, { },{
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });
      console.log(response);
    if (response.data) 
      {
      const userData = response.data;
      return userData;
    } 
    else 
    {
      console.warn("User data is empty or invalid.");
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return [];
  }
};

export const confirmDoubleBet = async (
  formData: FormData,
) => {
  try {
    const response = await axios.post(
      `${API_URL}/main/confirmDoubleBet`,
      formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      }
    );

    if (response.data) {

      const userData = response.data;
      return {
        authenticated: userData.authenticated,
        message: userData.message,
        receipt_id: userData.receipt_id,
        back: userData.back,
      };

    } else {
      console.warn("User data is empty or invalid.");
      return { authenticated: false, message: "no response on the api",back:true };
    }
    
  } catch (error) {
    console.error("Failed to send remittance:", error);
    return { authenticated: false, message: "no response on the api",back:true };
  }
};

export const getReceiptByID = async (
  receiptID: string
) => {
  try {
    const response = await axios.post(`${API_URL}/main/getReceiptByID`, { receiptID},{
        headers: { "Content-Type": "application/json" }
      });

    if (Array.isArray(response.data)) {
      console.log(response.data);
      
    } else if (response.data.error) {
      return [];
    }
    return response.data;
  } catch (error) {
    console.error("Failed to fetch recipients:", error);
    return [];
  }
};

export const saveDoubleBet = async (
  formData: FormData,
) => {
  try {
    const response = await axios.post(
      `${API_URL}/main/saveDoubleBet`,
      formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      }
    );

    if (response.data) {

      const userData = response.data;
      return {
        authenticated: userData.authenticated,
        message: userData.message,
        receipt_id: userData.receipt_id,
        back: userData.back,
      };

    } else {
      console.warn("User data is empty or invalid.");
      return { authenticated: false, message: "no response on the api",back:true };
    }
    
  } catch (error) {
    console.error("Failed to send remittance:", error);
    return { authenticated: false, message: "no response on the api",back:true };
  }
};

export const getSaveReceiptByID = async (
  receiptID: string
) => {
  try {
    const response = await axios.post(`${API_URL}/main/getSaveReceiptByID`, { receiptID},{
        headers: { "Content-Type": "application/json" }
      });

    if (Array.isArray(response.data)) {
      console.log(response.data);
      
    } else if (response.data.error) {
      return [];
    }
    return response.data;
  } catch (error) {
    console.error("Failed to fetch recipients:", error);
    return [];
  }
};

export const getNationalDrawResultsToday = async () => {
  try {
    const response = await axios.get(`https://scamemes.online/numero/main/getDrawResultsToday`, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data.error) {
      return [];
    }
  } catch (error) {
    console.error('Failed to fetch draws today:', error);
    return[];
  }
}