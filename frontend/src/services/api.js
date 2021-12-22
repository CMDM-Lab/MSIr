import axios from "axios";
import configData from "../config.json";

const API_URL= configData.API_URL

const instance = axios.create({
    baseURL: API_URL,
  });
  
  export default instance;