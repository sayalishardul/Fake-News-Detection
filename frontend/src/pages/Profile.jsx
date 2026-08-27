import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import API from "../services/api";
import { useAuth } from "../context/AuthContext";

import { useNavigate } from "react-router-dom";

import "./Profile.css";

function Profile() {
  const { updateUser } = useAuth();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
  });

  // ==========================================
  // Fetch Profile
  // ==========================================

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await API.get("auth/profile/");

      setForm(response.data);
    } catch (error) {
      console.log(error);
      toast.error("Unable to load profile.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Handle Input Change
  // ==========================================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================================
  // Save Profile
  // ==========================================

  const handleSave = async () => {
    try {
      const response = await API.put(
        "auth/profile/",
        form
      );

      updateUser({
        username: form.username,
        name: `${form.first_name} ${form.last_name}`,
        email: form.email,
      });

      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
      toast.error("Failed to update profile.");
    }
  };

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <div className="profile-page">
        <h2>Loading...</h2>
      </div>
    );
  }

  // ==========================================
  // Profile Page
  // ==========================================

  return (
    <div className="profile-page">

      <div className="profile-card">

        {/* Profile Avatar */}

        <div className="profile-avatar">
          👤
        </div>

        {/* Profile Name */}

        <h2>
          {form.first_name} {form.last_name}
        </h2>

        <div className="profile-form">

          {/* First Name */}

          <label>First Name</label>

          <input
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
          />

          {/* Last Name */}

          <label>Last Name</label>

          <input
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
          />

          {/* Username */}

          <label>Username</label>

          <input
            value={form.username}
            disabled
          />

          {/* Email */}

          <label>Email</label>

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
          />

          {/* Save Button */}

          <button
            type="button"
            onClick={handleSave}
          >
            Save Changes
          </button>

          {/* Back To User Dashboard */}

          <button
            type="button"
            className="profile-back-btn"
            onClick={() => navigate("/")}
          >
            ← Back to Dashboard
          </button>

        </div>

      </div>

    </div>
  );
}

export default Profile;