import axios from "axios";
import { auth } from "../firebase/firebaseConfig";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
  baseURL: `${backendUrl}/api`,
  withCredentials: true,
});

api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken(true);
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("No Firebase user found for API call.");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
