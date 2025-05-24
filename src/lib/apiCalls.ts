import axios from "axios";
import CryptoJS from "crypto-js";

const API_URL = import.meta.env.VITE_DATABASE_URL;
const rawToken = import.meta.env.VITE_API_KEY;
const API_KEY = btoa(rawToken);

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
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
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
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
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
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
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
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
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
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
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
      { headers: { "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
       } }
    );

    if (response.data && response.data.authenticated) {
      const userData = response.data;
      return {
        userID: userData.userID,
        authenticated: userData.authenticated,
        newDevice: userData.newDevice
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
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });

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
      { headers: { "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
       } }
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



export const fetchUserData = async (userID: string, deviceID: string) => { 
  try {
    const response = await axios.post(`${API_URL}/main/getUserData`, { userID, deviceID },{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
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
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });

    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data.error) {
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    return [];
  }
};


export const getReferrals = async (id: string
) => {
  try {
    const response = await axios.post(`${API_URL}/main/getReferrals`, { userID: id },{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });

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


export const getBetsWinners = async () => {
  try {
    const response = await axios.get(`${API_URL}/main/getBetsWinners`,{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
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

export const getGamesToday = async () => {
  try {
    const response = await axios.get(`${API_URL}/main/getGamesToday`,{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
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

export const getGames = async () => {
  try {
    const response = await axios.get(`${API_URL}/main/getGames`,{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
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


export const getGameTypes = async (game_id: string) => {
  try {
    const response = await axios.post(`${API_URL}/main/getGameTypes`, { game_id },{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
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
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
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


export const getDrawByID = async (game_id: string) => {
  try {
    const response = await axios.post(`${API_URL}/main/getDrawByID`, { game_id },{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
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
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
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

export const getGameTypeByID = async (game_id: string) => {
  try {
    const response = await axios.post(`${API_URL}/main/getGameTypeByID`, { game_id },{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
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

export const getGameTypesByID = async (game_id: string) => {
  try {
    const response = await axios.post(`${API_URL}/main/getGameTypesByID`, { game_id },{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
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
      { headers: { "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
       } }
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
    const response = await axios.post(`${API_URL}/main/getBetsByUserAndDraw`, { game_id, userID },{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
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
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
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


export const getDrawsResults = async () => {
  try {
    const response = await axios.get(`${API_URL}/main/getDrawsResults`,{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
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


export const checkCurrentBetsTotal = async (draw_id: string) => {
  try {
    const response = await axios.post(`${API_URL}/main/checkCurrentBetsTotal`, {draw_id },{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });

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
    const response = await axios.post(`${API_URL}/main/getMyBetClientsCount`, {userID },{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
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
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
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
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
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
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
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




export const addBetClients = async (
  formData: FormData,
) => {
  try {
    const response = await axios.post(
      `${API_URL}/main/addBetClients`,
      formData,
      { headers: { "Content-Type": "application/json",Authorization: `Bearer ${API_KEY}`, } }
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
      { headers: { "Content-Type": "application/json",Authorization: `Bearer ${API_KEY}`, } }
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
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
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
    formData.append("channel", channel);
    formData.append("sign", generateSign(clientCode, clientNo, timestamp, privateKey));

    const response = await axios.post(
      "https://gw01.ckogway.com/api/coin/pay/request",
      formData
    );
    console.log(response);
    if (response.data && response.data.success && response.data.code === 200) {
      const { orderNo, receiveAddr, chainName, coinUnit, requestAmount, status, payUrl, hrefbackurl, sign } = response.data.data;

      const res = await axios.post(`${API_URL}/main/cashInRequest`, {userID, orderNo, creditCashin,amountToPay,clientNo },{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });
  
      if (res.data && res.data.authenticated) {
        window.location.href = payUrl;
        return { error: false };
      } 
      else 
      {
        console.warn("User data is empty or invalid.");
        return { error: true };
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
    const clientCode = import.meta.env.VITE_CLIENT_CODE;
    const privateKey = import.meta.env.VITE_PRIVATE_KEY;
    const chainName = "BANK";
    const coinUnit = "PHP";

    const formData = new FormData();
    formData.append("clientCode", clientCode);
    formData.append("chainName", chainName);
    formData.append("coinUnit", coinUnit);
    formData.append("bankCardNum", account);
    formData.append("bankUserName", full_name);
    formData.append("ifsc", "null");
    formData.append("bankName", bank);
    formData.append("amount", (parseFloat(winnings) - 6).toString());
    formData.append("clientNo", clientNo);
    formData.append("requestTimestamp", timestamp);
    formData.append("callbackurl", `${API_URL}/main/requestCashOutCashko`);
    formData.append("sign", generateSign(clientCode, clientNo, timestamp, privateKey));

    const response = await axios.post(
      "https://gw01.ckogway.com/api/bank/agentPay/request",
      formData
    );
    console.log(response);

    if (
      response.data &&
      response.data.success &&
      response.data.code === 200 &&
      response.data.data &&
      response.data.data.orderNo
    ) {
      const { orderNo } = response.data.data;

      const res = await axios.post(`${API_URL}/main/cashOutRequest`, {
        userID,
        clientNo,
        orderNo,
        winnings,
        full_name,
        bank,
        account,
      },{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });

      if (res.data && res.data.authenticated) {
        return { error: false };
      } else {
        console.warn("User data is empty or invalid.");
        return { error: true, message:"User data is empty or invalid." };
      }
    } else {
      console.warn("Cashko request failed.");
      return { error: true, message:"Transaction response is missing orderNo." };
    }
  } catch (error) {
    console.error("Cashko request failed:", error);
    return { error: true , message:"Cashko request failed." };
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
    const clientCode = import.meta.env.VITE_CLIENT_CODE;
    const privateKey = import.meta.env.VITE_PRIVATE_KEY;
    const chainName = "BANK";
    const coinUnit = "PHP";

    const formData = new FormData();
    formData.append("clientCode", clientCode);
    formData.append("chainName", chainName);
    formData.append("coinUnit", coinUnit);
    formData.append("bankCardNum", account);
    formData.append("bankUserName", full_name);
    formData.append("ifsc", "null");
    formData.append("bankName", bank);
    formData.append("amount", (parseFloat(commissions) - 6).toString());
    formData.append("clientNo", clientNo);
    formData.append("requestTimestamp", timestamp);
    formData.append("callbackurl", `${API_URL}/main/requestCashOutCashko`);
    formData.append("sign", generateSign(clientCode, clientNo, timestamp, privateKey));

    const response = await axios.post(
      "https://gw01.ckogway.com/api/bank/agentPay/request",
      formData
    );
    console.log(response);

    if (
      response.data &&
      response.data.success &&
      response.data.code === 200 &&
      response.data.data &&
      response.data.data.orderNo
    ) {
      const { orderNo } = response.data.data;

      const res = await axios.post(`${API_URL}/main/cashOutRequestCommissions`, {
        userID,
        clientNo,
        orderNo,
        commissions,
        full_name,
        bank,
        account,
      },{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });

      if (res.data && res.data.authenticated) {
        return { error: false };
      } else {
        console.warn("User data is empty or invalid.");
        return { error: true, message:"User data is empty or invalid." };
      }
    } else {
      console.warn("Cashko request failed.");
      return { error: true, message:"Transaction response is missing orderNo." };
    }
  } catch (error) {
    console.error("Cashko request failed:", error);
    return { error: true , message:"Cashko request failed." };
  }
};



export const getAnnouncements = async () => {
  try {
    const response = await axios.get(`${API_URL}/main/getAnnouncements`,{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
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




export const getCommissions = async (
  id: string
) => {
  try {
    const response = await axios.post(`${API_URL}/main/getCommissions`, { userID:id },{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
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
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
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
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
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
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
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
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
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
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
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
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
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
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
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
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
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
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
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
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
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
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
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
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });

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

export const getBetsEarnedTeamTable = async (userID: string) => {
  try {
    const response = await axios.post(`${API_URL}/main/getBetsEarnedTeamTable`, { userID },{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });

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

export const getBetsTableByUser = async (userID: string) => {
  try {
    const response = await axios.post(`${API_URL}/main/getBetsTableByUser`, { userID },{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });

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

export const getWinsTeamTable = async (userID: string) => {
  try {
    const response = await axios.post(`${API_URL}/main/getWinsTeamTable`, { userID },{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });

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

export const getCommissionsTeamTable = async (userID: string) => {
  try {
    const response = await axios.post(`${API_URL}/main/getCommissionsTeamTable`, { userID },{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });

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

export const totalCashinTeamTable = async (userID: string) => {
  try {
    const response = await axios.post(`${API_URL}/main/totalCashinTeamTable`, { userID },{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });

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

export const getCashinsTableByUser = async (userID: string) => {
  try {
    const response = await axios.post(`${API_URL}/main/getCashinsTableByUser`, { userID },{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });

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

export const totalCashoutTeamTable = async (userID: string) => {
  try {
    const response = await axios.post(`${API_URL}/main/totalCashoutTeamTable`, { userID },{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });

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

export const getCashoutsTableByUser = async (userID: string) => {
  try {
    const response = await axios.post(`${API_URL}/main/getCashoutsTableByUser`, { userID },{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });

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




export const convertWinsToBalance = async (
  userID: string,
  amount: string,
) => {
  try {

      const res = await axios.post(`${API_URL}/main/convertWinsToBalance`, {
        userID,amount
      },{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });

      if (res.data && res.data.authenticated) {
        return { error: false };
      } else {
        console.warn("User data is empty or invalid.");
        return { error: true, message:"User data is empty or invalid." };
      }
    
  } catch (error) {
    console.error("Cashko request failed:", error);
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
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });

      if (res.data && res.data.authenticated) {
        return { error: false };
      } else {
        console.warn("User data is empty or invalid.");
        return { error: true, message:"User data is empty or invalid." };
      }
    
  } catch (error) {
    console.error("Cashko request failed:", error);
    return { error: true , message:"conversion failed." };
  }
};



export const setDailyRewards = async (userID: string) => {
  try {
    const response = await axios.post(`${API_URL}/main/setDailyRewards`, { userID },{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
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
  userID: string, reward: string 
) => {
  try {
    const response = await axios.post(`${API_URL}/main/claimDailyReward`, { userID, reward},{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
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
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
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