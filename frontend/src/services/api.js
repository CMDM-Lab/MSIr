import axios from "axios";

API_URL=''

const instance = axios.create({
    baseURL: API_URL,
  });
  
  export default instance;