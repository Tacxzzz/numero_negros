import axios from "axios";
import { Agent } from "http";
import CryptoJS from "crypto-js";
import { error } from "console";

const API_URL = import.meta.env.VITE_DATABASE_URL;

export const createAccount = async (
  formData: FormData,
) => {
  try {
    const response = await axios.post(
      `${API_URL}/main/create`,
      formData,
      { headers: { "Content-Type": "application/json" } }
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
    const response = await axios.post(`${API_URL}/main/updatePassword`, { userID, password, newPassword });

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
  mobile: string, otp: string 
) => {
  try {
    const response = await axios.post(`${API_URL}/main/verifyOTP`, { mobile, otp });

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
    const response = await axios.post(`${API_URL}/main/verifyOTPForgot`, { mobile, otp });

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
    const response = await axios.post(`${API_URL}/main/sendOTPForReset`, { mobile });

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
  mobile: string, otp: string 
) => {
  try {
    const response = await axios.post(`${API_URL}/main/verifyOTPLogin`, { mobile, otp });

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
      { headers: { "Content-Type": "application/json" } }
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





export const getTransactions = async (userID: string) => {
  try {
    const response = await axios.post(`${API_URL}/main/getTransactions`, { userID });

    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data.error) {
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch recipients:", error);
    return [];
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



export const cashIn = async (
  formData: FormData,
) => {
  try {
    const response = await axios.post(
      `${API_URL}/main/cashIn`,
      formData,
      { headers: { "Content-Type": "application/json" } }
    );

    if (response.data && response.data.authenticated) {
      const userData = response.data;
      return {
        transID: userData.transCode+userData.transID,
      };
    } else {
      console.warn("User data is empty or invalid.");
      return { transID: "" };
    }
    
  } catch (error) {
    console.error("Failed to send remittance:", error);
    return { transID: "" };
  }
};



export const fetchUserData = async (id: string) => {
  try {
    const response = await axios.post(`${API_URL}/main/getUserData`, { userID: id });

    if (response.data && response.data.length > 0) {
      const userData = response.data[0];
      return {
        balance: Number(userData.balance) || 0,
        wins: Number(userData.wins) || 0,
        commissions: Number(userData.commissions) || 0,
        mobile: userData.mobile ?? "",
        referral: userData.referral ?? "",
        status: userData.status ?? "pending",
        agent: userData.agent ?? "",
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


export const getReferrals = async (id: string
) => {
  try {
    const response = await axios.post(`${API_URL}/main/getReferrals`, { userID: id });

    if (response.data && response.data.authenticated) {
      const userData = response.data;
      return {
        level1: userData.level1,
        level2: userData.level2,
        level3: userData.level3,
      };
    } else {
      console.warn("User data is empty or invalid.");
      return { level1: "", level2: "", level3: "" };
    }
    
  } catch (error) {
    console.error("Failed to send remittance:", error);
    return { level1: "", level2: "", level3: "" };
  }
};



export const getGames = async () => {
  try {
    const response = await axios.get(`${API_URL}/main/getGames`);

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


export const getGameTypes = async (game_id: string) => {
  try {
    const response = await axios.post(`${API_URL}/main/getGameTypes`, { game_id });

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
    const response = await axios.post(`${API_URL}/main/getGameByID`, { game_id });

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


export const getDrawByID = async (game_id: string) => {
  try {
    const response = await axios.post(`${API_URL}/main/getDrawByID`, { game_id });

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
    const response = await axios.post(`${API_URL}/main/getDrawsByID`, { game_id });

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

export const getGameTypeByID = async (game_id: string) => {
  try {
    const response = await axios.post(`${API_URL}/main/getGameTypeByID`, { game_id });

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

export const getGameTypesByID = async (game_id: string) => {
  try {
    const response = await axios.post(`${API_URL}/main/getGameTypesByID`, { game_id });

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
      { headers: { "Content-Type": "application/json" } }
    );

    if (response.data) {

      const userData = response.data;
      return {
        authenticated: userData.authenticated,
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
    const response = await axios.post(`${API_URL}/main/getBetsByUserAndDraw`, { game_id, userID });

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
    const response = await axios.post(`${API_URL}/main/getMyBets`, {userID });

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


export const getDrawsResults = async () => {
  try {
    const response = await axios.get(`${API_URL}/main/getDrawsResults`);

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


export const checkCurrentBetsTotal = async (draw_id: string) => {
  try {
    const response = await axios.post(`${API_URL}/main/checkCurrentBetsTotal`, {draw_id });

    if (response.data && response.data.authenticated) {
      const userData = response.data;
      return {
        authenticated: userData.authenticated,
        totalBets: userData.totalBets,
      };
    } else {
      console.warn("User data is empty or invalid.");
      return { authenticated: false, totalBets: "" };
    }
    
  } catch (error) {
    console.error("Failed to send remittance:", error);
    return { authenticated: false, totalBets: "" };
  }
};



export const getMyBetClientsCount = async (userID: string) => {
  try {
    const response = await axios.post(`${API_URL}/main/getMyBetClientsCount`, {userID });

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
    const response = await axios.post(`${API_URL}/main/saveFavorite`, {userID,game_id,bet });

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
    const response = await axios.post(`${API_URL}/main/readMyFavorite`, {userID,game_id });

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
    const response = await axios.post(`${API_URL}/main/getMyBetClients`, {userID });

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




export const addBetClients = async (
  formData: FormData,
) => {
  try {
    const response = await axios.post(
      `${API_URL}/main/addBetClients`,
      formData,
      { headers: { "Content-Type": "application/json" } }
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
      { headers: { "Content-Type": "application/json" } }
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
    const response = await axios.post(`${API_URL}/main/getBetClientData`, { clientID: id });

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
  amountToPay: string, creditCashin: string, userID: string 
) => {
  try {
    const timestamp = Date.now().toString();
    const clientNo = `PP${timestamp}`;
    const clientCode = import.meta.env.VITE_CLIENT_CODE;
    const privateKey = import.meta.env.VITE_PRIVATE_KEY;

    const formData = new FormData();
    formData.append("clientCode", clientCode);
    formData.append("chainName", "BANK");
    formData.append("coinUnit", "PHP");
    formData.append("clientNo",clientNo );
    formData.append("memberFlag", "user1001");
    formData.append("requestAmount", amountToPay.toString());
    formData.append("requestTimestamp", timestamp);
    formData.append("callbackurl", `${API_URL}/main/requestDepositCashko`);
    formData.append("hrefbackurl", `${window.location.origin}/payment-success`);
    formData.append("toPayQr", "0");
    formData.append("dataType", "PAY_PAGE");
    formData.append("channel", "GCASH_NATIVE");
    formData.append("sign", generateSign(clientCode, clientNo, timestamp, privateKey));

    const response = await axios.post(
      "https://gw01.ckogway.com/api/coin/pay/request",
      formData
    );
    console.log(response);
    if (response.data && response.data.success && response.data.code === 200) {
      const { orderNo, receiveAddr, chainName, coinUnit, requestAmount, status, payUrl, hrefbackurl, sign } = response.data.data;

      const res = await axios.post(`${API_URL}/main/cashInRequest`, {userID, orderNo, creditCashin,amountToPay,clientNo });
  
      if (res.data && res.data.authenticated) {
        window.location.href = payUrl;
      } 
      else 
      {
        console.warn("User data is empty or invalid.");
        return { transID: "" };
      }
     
    } 
    else {
      console.warn("Transaction response is missing expected data.");
      return {error: true};
    }
  } catch (error) {
    console.error("Cashko request failed:", error);
    return {error: true};
  }
};




const generateSign = (clientCode: string, clientNo: string, latest_requestTimestamp: string, privateKey: string) => {
  const signString = `${clientCode}&BANK&PHP&${clientNo}&${latest_requestTimestamp}${privateKey}`;
  const resultHash = CryptoJS.MD5(signString).toString(CryptoJS.enc.Hex);
  return resultHash;
};


const generateSignPAID = (clientCode: string, clientNo: string, privateKey: string) => {
  const signString = `${clientCode}&${clientNo}${privateKey}`;
  const resultHash = CryptoJS.MD5(signString).toString(CryptoJS.enc.Hex);
  return resultHash;
};


export const cashInCashkoPAID = async (
  clientNo: string
) => {
  try {
   

    const clientCode = import.meta.env.VITE_CLIENT_CODE;
    const privateKey = import.meta.env.VITE_PRIVATE_KEY;
    const sign = generateSignPAID(clientCode, clientNo, privateKey);

    const response = await axios.get(`https://gw01.ckogway.com/api/coin/pay/checkOrder?clientCode=${clientCode}&clientNo=${clientNo}&sign=${sign}`);
    
    console.log(response);
    if (response.data && response.data.success && response.data.code === 200) {
      const { status, orderNo } = response.data.data;

      if(status==="PAID")
      {
        const res = await axios.post(`${API_URL}/main/confirmCreditPaid`, {clientNo, orderNo});
  
        if (res.data && res.data.authenticated) {
          return { authenticated: true };
        } 
        else 
        {
          return { authenticated: false };
        }
      }
      else
      {
        return {error: true};
      }

      
     
    } 
    else {
      console.warn("Transaction response is missing expected data.");
      return {error: true};
    }
  } catch (error) {
    console.error("Cashko request failed:", error);
    return {error: true};
  }
};