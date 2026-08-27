import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {

  const {
    user,
    loading,
    isAuthenticated,
  } = useAuth();


  // =========================================================
  // WAIT FOR AUTHENTICATION TO RESTORE
  // =========================================================

  if (loading) {

    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "16px",
          color: "#6b7280",
        }}
      >
        Loading...
      </div>
    );

  }


  // =========================================================
  // USER NOT AUTHENTICATED
  // =========================================================

  if (!isAuthenticated || !user) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }


  // =========================================================
  // AUTHENTICATED USER
  // =========================================================

  return children;

}

export default ProtectedRoute;