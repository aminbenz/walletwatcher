import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_APP_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: { Accept: "application/json" },
  withCredentials: true,
});

export const make = async (config: any, showNotifications: boolean = true) => {
  if (showNotifications) {
    return toast
      .promise(
        api.request(config),
        {
          loading: "Loading...",
          success: (res) => res.data?.message || "Request successful!",
          error: (err) => err.response.data?.message || "An error occurred.",
        },
        {
          position: "bottom-right",
        }
      )
      .then((res) => res.data);
  } else {
    const response = await api.request(config);
    return response.data;
  }
};

export default api;
