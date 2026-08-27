import { useEffect, useState } from "react";

import API from "../../services/api";

import "./RecentUsers.css";

function RecentUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await API.get("admin/users/");

      // Show latest 5 users
      setUsers(response.data.slice(0, 5));
    } catch (error) {
      console.error("Recent Users API Error:", error);

      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Response:", error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recent-users">

      {/* =========================================
          HEADER
      ========================================= */}

      <div className="recent-users-header">

        <div>
          <h2>Recent Users</h2>

          <p>
            Recently registered users
          </p>
        </div>

      </div>


      {/* =========================================
          TABLE
      ========================================= */}

      <div className="recent-users-table-wrapper">

        {loading ? (

          <div className="recent-users-message">
            Loading users...
          </div>

        ) : users.length === 0 ? (

          <div className="recent-users-message">
            No users found.
          </div>

        ) : (

          <table className="recent-users-table">

            <thead>

              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Username</th>
                <th>Email</th>
              </tr>

            </thead>


            <tbody>

              {users
                .slice()
                .sort((a, b) => a.id - b.id)
                .map((user) => (

                  <tr key={user.id}>

                    <td className="recent-user-id">
                      {user.id}
                    </td>

                    <td className="recent-user-name">
                      {user.first_name || user.last_name
                        ? `${user.first_name || ""} ${user.last_name || ""}`.trim()
                        : "N/A"}
                    </td>

                    <td>
                      <span className="recent-username-badge">
                        {user.username}
                      </span>
                    </td>

                    <td className="recent-user-email">
                      {user.email || "N/A"}
                    </td>

                  </tr>

                ))}

            </tbody>

          </table>

        )}

      </div>

    </div>
  );
}

export default RecentUsers;