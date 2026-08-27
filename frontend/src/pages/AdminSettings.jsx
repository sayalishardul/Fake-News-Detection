import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminSidebar from "../components/Admin/AdminSidebar";
import { useAuth } from "../context/AuthContext";

import "./AdminSettings.css";

import API from "../services/api";

function AdminSettings() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // ==========================================
  // PASSWORD STATES
  // ==========================================

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [passwordLoading, setPasswordLoading] =
    useState(false);

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    logout();

    navigate("/login", {
      replace: true,
    });
  };

  // ==========================================
  // CHANGE PASSWORD
  // ==========================================

  const handleChangePassword = async (e) => {
  e.preventDefault();

  if (
    !currentPassword ||
    !newPassword ||
    !confirmPassword
  ) {
    alert("Please fill in all password fields.");
    return;
  }

  if (newPassword.length < 8) {
    alert(
      "New password must contain at least 8 characters."
    );
    return;
  }

  if (newPassword !== confirmPassword) {
    alert(
      "New password and confirm password do not match."
    );
    return;
  }

  if (currentPassword === newPassword) {
    alert(
      "New password must be different from the current password."
    );
    return;
  }

  try {
    setPasswordLoading(true);

    const response = await API.post(
      "admin/change-password/",
      {
        current_password: currentPassword,
        new_password: newPassword,
      }
    );

    alert(
      response.data.message ||
        "Password changed successfully."
    );

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

  } catch (error) {
    console.error(
      "Change Password Error:",
      error
    );

    alert(
      error.response?.data?.error ||
        "Unable to change password."
    );

  } finally {
    setPasswordLoading(false);
  }
};

  return (
    <div className="admin-layout">

      {/* ==========================================
          SIDEBAR
      ========================================== */}

      <AdminSidebar />

      {/* ==========================================
          MAIN CONTENT
      ========================================== */}

      <div className="admin-content">

        {/* ==========================================
            PAGE HEADER
        ========================================== */}

        <div className="settings-header">

          <h1>Settings</h1>

          <p>
            Manage your admin account and preferences
          </p>

        </div>

        {/* ==========================================
            ADMIN PROFILE
        ========================================== */}

        <div className="settings-card">

          <div className="settings-card-header">

            <h2>Admin Profile</h2>

            <p>
              Your current account information
            </p>

          </div>

          <div className="settings-form">

            {/* USERNAME */}

            <div className="settings-field">

              <label>
                Username
              </label>

              <input
                type="text"
                value={user?.username || ""}
                readOnly
              />

            </div>

            {/* NAME */}

            <div className="settings-field">

              <label>
                Name
              </label>

              <input
                type="text"
                value={user?.name || ""}
                readOnly
              />

            </div>

            {/* EMAIL */}

            <div className="settings-field">

              <label>
                Email
              </label>

              <input
                type="email"
                value={user?.email || ""}
                readOnly
              />

            </div>

          </div>

        </div>

        {/* ==========================================
            PASSWORD
        ========================================== */}

        <div className="settings-card">

          <div className="settings-card-header">

            <h2>Password</h2>

            <p>
              Update your account password
            </p>

          </div>

          <form
            className="settings-password"
            onSubmit={handleChangePassword}
          >

            {/* CURRENT PASSWORD */}

            <div className="settings-field">

              <label>
                Current Password
              </label>

              <div className="password-input">

                <input
                  type={
                    showCurrentPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) =>
                    setCurrentPassword(
                      e.target.value
                    )
                  }
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowCurrentPassword(
                      !showCurrentPassword
                    )
                  }
                >
                  {showCurrentPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>

            </div>

            {/* NEW PASSWORD */}

            <div className="settings-field">

              <label>
                New Password
              </label>

              <div className="password-input">

                <input
                  type={
                    showNewPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(
                      e.target.value
                    )
                  }
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowNewPassword(
                      !showNewPassword
                    )
                  }
                >
                  {showNewPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>

            </div>

            {/* CONFIRM PASSWORD */}

            <div className="settings-field">

              <label>
                Confirm Password
              </label>

              <div className="password-input">

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >
                  {showConfirmPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>

            </div>

            {/* CHANGE PASSWORD */}

            <button
              type="submit"
              className="save-password-btn"
              disabled={passwordLoading}
            >
              {passwordLoading
                ? "Updating..."
                : "Change Password"}
            </button>

          </form>

        </div>

        {/* ==========================================
            ACCOUNT
        ========================================== */}

        <div className="settings-card account-card">

          <div className="settings-card-header">

            <h2>Account</h2>

            <p>
              Manage your admin session
            </p>

          </div>

          <button
            type="button"
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </div>

    </div>
  );
}

export default AdminSettings;