import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./components/Admin/AdminUsers";
import AdminPredictions from "./pages/AdminPredictions";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminSettings from "./pages/AdminSettings";

import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import AdminRoute from "./components/ProtectedRoute/AdminRoute";

function App() {
  return (
    <Routes>

      {/* =====================================================
          LOGIN
      ===================================================== */}

      <Route
        path="/login"
        element={<Login />}
      />


      {/* =====================================================
          REGISTER
      ===================================================== */}

      <Route
        path="/register"
        element={<Register />}
      />


      {/* =====================================================
          USER HOME / DASHBOARD
      ===================================================== */}

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />


      {/* =====================================================
          USER PROFILE
      ===================================================== */}

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />


      {/* =====================================================
          ADMIN ROOT
      ===================================================== */}

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <Navigate
              to="/admin/dashboard"
              replace
            />
          </AdminRoute>
        }
      />


      {/* =====================================================
          ADMIN DASHBOARD
      ===================================================== */}

      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />


      {/* =====================================================
          ADMIN USERS
      ===================================================== */}

      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <AdminUsers />
          </AdminRoute>
        }
      />


      {/* =====================================================
          ADMIN PREDICTIONS
      ===================================================== */}

      <Route
        path="/admin/predictions"
        element={
          <AdminRoute>
            <AdminPredictions />
          </AdminRoute>
        }
      />


      {/* =====================================================
          ADMIN ANALYTICS
      ===================================================== */}

      <Route
        path="/admin/analytics"
        element={
          <AdminRoute>
            <AdminAnalytics />
          </AdminRoute>
        }
      />


      {/* =====================================================
          ADMIN SETTINGS
      ===================================================== */}

      <Route
        path="/admin/settings"
        element={
          <AdminRoute>
            <AdminSettings />
          </AdminRoute>
        }
      />


      {/* =====================================================
          UNKNOWN ROUTE
      ===================================================== */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>
  );
}

export default App;