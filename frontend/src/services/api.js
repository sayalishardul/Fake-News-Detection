import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});


// ==========================================
// ATTACH ACCESS TOKEN
// ==========================================

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// ==========================================
// REFRESH ACCESS TOKEN ON 401
// ==========================================

let isRefreshing = false;
let failedQueue = [];


const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};


API.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error) => {

    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {

      originalRequest._retry = true;

      const refresh = localStorage.getItem("refresh");

      // ==========================================
      // NO REFRESH TOKEN
      // ==========================================

      if (!refresh) {

        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

        localStorage.removeItem("username");
        localStorage.removeItem("name");
        localStorage.removeItem("email");

        window.location.href = "/login";

        return Promise.reject(error);
      }


      // ==========================================
      // REFRESH ALREADY IN PROGRESS
      // ==========================================

      if (isRefreshing) {

        return new Promise((resolve, reject) => {

          failedQueue.push({
            resolve,
            reject,
          });

        })
          .then((token) => {

            originalRequest.headers.Authorization =
              `Bearer ${token}`;

            return API(originalRequest);

          })
          .catch((err) => {

            return Promise.reject(err);

          });
      }


      // ==========================================
      // START TOKEN REFRESH
      // ==========================================

      isRefreshing = true;


      try {

        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}auth/token/refresh/`,
          {
            refresh: refresh,
          }
        );


        const newAccessToken =
          response.data.access;


        localStorage.setItem(
          "access",
          newAccessToken
        );


        processQueue(
          null,
          newAccessToken
        );


        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;


        return API(originalRequest);


      } catch (refreshError) {

        processQueue(
          refreshError,
          null
        );


        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("username");
        localStorage.removeItem("name");
        localStorage.removeItem("email");


        window.location.href = "/login";


        return Promise.reject(
          refreshError
        );

      } finally {

        isRefreshing = false;

      }
    }


    return Promise.reject(error);
  }
);


export default API;