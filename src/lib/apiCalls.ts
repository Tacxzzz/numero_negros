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