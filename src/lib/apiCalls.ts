import axios from "axios";

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



export const fetchRecipients = async (userID: string) => {
  try {
    const response = await axios.post(`${API_URL}/main/getRecipients`, { userID });

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



export const sendRemittance = async (
  formData: FormData,
) => {
  try {
    const response = await axios.post(
      `${API_URL}/main/sendRemittance`,
      formData,
      { headers: { "Content-Type": "application/json" } }
    );

    if (response.data && response.data.authenticated) {
      const userData = response.data;
      return {
        transID: userData.transCode+userData.transID,
        recipient: userData.recipient,
      };
    } else {
      console.warn("User data is empty or invalid.");
      return { transID: "", recipient: "" };
    }
    
  } catch (error) {
    console.error("Failed to send remittance:", error);
    return { transID: "", recipient: "" };
  }
};



export const fetchUserData = async (id: string) => {
  try {
    const response = await axios.post(`${API_URL}/main/getUserData`, { userID: id });

    if (response.data && response.data.length > 0) {
      const userData = response.data[0];
      return {
        balance: Number(userData.balance) || 0,
        mobile: userData.mobile ?? "",
        referral: userData.referral ?? "",
        status: userData.status ?? "pending",
      };
    } else {
      console.warn("User data is empty or invalid.");
      return { balance: 0,mobile: "",referral: "", status: "none" };
    }
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    return { balance: 0,mobile: "",referral: "", status: "none" };
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
      };
    } else {
      console.warn("User data is empty or invalid.");
      return { level1: "", level2: "" };
    }
    
  } catch (error) {
    console.error("Failed to send remittance:", error);
    return { level1: "", level2: "" };
  }
};



export const redeemBalance =  async (
  formData: FormData,
) => {
  try {
    const response = await axios.post(
      `${API_URL}/main/cashOut`,
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
    console.error("Failed to redeem amount:", error);
    return { transID: "" };
  }
};