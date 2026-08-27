import { NavLink } from "react-router-dom";

import {
  FaChartLine,
  FaUsers,
  FaNewspaper,
  FaChartPie,
  FaGear,
} from "react-icons/fa6";

import "./AdminSidebar.css";

function AdminSidebar() {
  const menuItems = [
    {
      path: "/admin/dashboard",
      icon: <FaChartLine />,
      label: "Dashboard",
    },
    {
      path: "/admin/users",
      icon: <FaUsers />,
      label: "Users",
    },
    {
      path: "/admin/predictions",
      icon: <FaNewspaper />,
      label: "Predictions",
    },
    {
      path: "/admin/analytics",
      icon: <FaChartPie />,
      label: "Analytics",
    },
    {
      path: "/admin/settings",
      icon: <FaGear />,
      label: "Settings",
    },
  ];

  return (
    <aside className="admin-sidebar">

      {/* ==========================================
          SIDEBAR HEADER
      ========================================== */}

      <div className="sidebar-header">
        <h2>Admin Panel</h2>

        <p>Management Console</p>
      </div>

      {/* ==========================================
          NAVIGATION
      ========================================== */}

      <nav className="sidebar-navigation">

        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>

              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive ? "active" : ""
                }
              >
                <span className="sidebar-icon">
                  {item.icon}
                </span>

                <span className="sidebar-label">
                  {item.label}
                </span>
              </NavLink>

            </li>
          ))}
        </ul>

      </nav>

    </aside>
  );
}

export default AdminSidebar;