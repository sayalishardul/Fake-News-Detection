import { Navigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";


function ProtectedRoute({ children }) {

  const {
    loading,
    isAuthenticated,
  } = useAuth();


  // =========================================================
  // WAIT FOR AUTH CONTEXT
  // =========================================================

  if (loading) {

    return (

      <div
        style={{
          minHeight: "100vh",

          display: "flex",

          justifyContent: "center",

          alignItems: "center",

          fontSize: "16px",

          color: "#6b7280",
        }}
      >

        Loading...

      </div>

    );

  }


  // =========================================================
  // NOT AUTHENTICATED
  // =========================================================

  if (!isAuthenticated) {

    return (

      <Navigate
        to="/login"
        replace
      />

    );

  }


  // =========================================================
  // AUTHENTICATED
  // =========================================================

  return children;

}


export default ProtectedRoute;