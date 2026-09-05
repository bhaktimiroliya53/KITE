import axios from "axios";

const API = axios.create({
  baseURL: "https://kite-backend-rxe8.onrender.com/api",
});

export default API;