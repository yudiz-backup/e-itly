import axios from "axios";
import { localStorageKey } from "src/constants/generics";
import { logoutUser } from "./ApiHelpers";

const defaultHeaders = {
  "Content-Type": "application/json",
};
if (!import.meta.env.VITE_API_URL) {
  console.warn("Problem with VITE_API_URL", import.meta.env.VITE_API_URL);
}
const appClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 40000,
  headers: defaultHeaders,
});

appClient.interceptors.request.use(async function (config) {
  try {
    const authToken = localStorage?.getItem(localStorageKey.authToken);
    if (authToken) config.headers.token = authToken;
    return config;
  } catch (e) {
    return config;
  }
});

appClient.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    if ([401, 403].includes(error.response?.status)) {
      logoutUser();
    }
    return Promise.reject(error);
  }
);

export { appClient };
