import { useEffect, useState } from "react";

import API from "../services/api";

import AdminNavbar from "../components/Admin/AdminNavbar";
import AdminSidebar from "../components/Admin/AdminSidebar";
import DashboardCard from "../components/Admin/DashboardCard";
import AdminPieChart from "../components/Admin/AdminPieChart";
import RecentUsers from "../components/Admin/RecentUsers";

import "./AdminDashboard.css";

import {
  FaUsers,
  FaDatabase,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa"; 


function AdminDashboard() {

  const [dashboard, setDashboard] = useState({
    total_users: 0,
    total_predictions: 0,
    real_news: 0,
    fake_news: 0,
  });

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchDashboard();
  }, []);


  const fetchDashboard = async () => {

    try {

      const response = await API.get("admin/dashboard/");

      console.log("Dashboard Response:", response.data);

      setDashboard({
        total_users: response.data.total_users || 0,
        total_predictions: response.data.total_predictions || 0,
        real_news: response.data.real_news || 0,
        fake_news: response.data.fake_news || 0,
      });

    } catch (error) {

      console.error("Dashboard API Error:", error);

      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Response:", error.response.data);
      }

    } finally {

      setLoading(false);

    }
  };


  return (
    <>

      {/* =========================================
          ADMIN NAVBAR
      ========================================= */}

      <AdminNavbar />


      {/* =========================================
          ADMIN LAYOUT
      ========================================= */}

      <div className="admin-layout">

        <AdminSidebar />


        <div className="admin-content">


          {/* =========================================
              DASHBOARD CARDS
          ========================================= */}

           <div className="dashboard-cards">

  <DashboardCard
  title="Total Users"
  value={loading ? "..." : dashboard.total_users}
  color="#7c3aed"
  icon={FaUsers}
/>

<DashboardCard
  title="Total Predictions"
  value={loading ? "..." : dashboard.total_predictions}
  color="#2563eb"
  icon={FaDatabase}
/>

<DashboardCard
  title="Real News"
  value={loading ? "..." : dashboard.real_news}
  color="#16a34a"
  icon={FaCheckCircle}
/>

<DashboardCard
  title="Fake News"
  value={loading ? "..." : dashboard.fake_news}
  color="#dc2626"
  icon={FaExclamationTriangle}
/>

</div>


          {/* =========================================
              PREDICTION CHART
          ========================================= */}

          <AdminPieChart
            real={dashboard.real_news}
            fake={dashboard.fake_news}
          />


          {/* =========================================
              RECENT USERS
          ========================================= */}

          <RecentUsers />


        </div>

      </div>

    </>
  );
}


export default AdminDashboard;