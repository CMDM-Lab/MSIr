import axios from "axios";

const API_URL = process.env.API_URL+"/auth/";

const register = async (email, password) => {
  const response = axios.post(API_URL + "signup", {
    email,
    password,
  });
  if (response){

  }
  return response
};

const login = async (email, password) => {
    const response = await axios.post(API_URL + "signin", {
            email,
            password,
        });
    if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
};

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

export default {
  register,
  login,
  logout,
  getCurrentUser,
};