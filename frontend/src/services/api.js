import axios from "axios";
import url from "../config/url";

//const API_URL= process.env.API_URL
const API_URL= url.API_URL

const instance = axios.create({
    baseURL: API_URL,
  });
  
  export default instance;