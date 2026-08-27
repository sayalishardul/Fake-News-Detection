import { useEffect, useState } from "react";

import API from "../../services/api";
import AdminSidebar from "./AdminSidebar";

import "./AdminUsers.css";


function AdminUsers() {

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [error, setError] = useState("");


  // =====================================================
  // FETCH USERS
  // =====================================================

  const fetchUsers = async () => {

    try {

      setLoading(true);
      setError("");

      const response = await API.get(
        "auth/users/"
      );

      const sortedUsers = [
        ...response.data
      ].sort(
        (a, b) => a.id - b.id
      );

      setUsers(sortedUsers);

    } catch (error) {

      console.error(
        "Users API Error:",
        error
      );

      console.error(
        "Response:",
        error.response?.data
      );

      setError(
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Unable to load users."
      );

    } finally {

      setLoading(false);

    }
  };


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    fetchUsers();

  }, []);


  // =====================================================
  // DELETE USER
  // =====================================================

  const handleDelete = async (userId) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) {
      return;
    }


    try {

      await API.delete(
        `auth/users/${userId}/`
      );

      setUsers(
        (prevUsers) =>
          prevUsers.filter(
            (user) =>
              user.id !== userId
          )
      );

      alert(
        "User deleted successfully."
      );

    } catch (error) {

      console.error(
        "Delete User Error:",
        error
      );

      alert(
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Unable to delete user."
      );
    }
  };


  // =====================================================
  // SEARCH
  // =====================================================

  const filteredUsers = users.filter(
    (user) => {

      const searchText =
        search
          .toLowerCase()
          .trim();

      if (!searchText) {
        return true;
      }

      const name =
        user.name
          ?.toLowerCase() || "";

      const username =
        user.username
          ?.toLowerCase() || "";

      const email =
        user.email
          ?.toLowerCase() || "";

      return (
        name.includes(searchText) ||
        username.includes(searchText) ||
        email.includes(searchText)
      );
    }
  );


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div className="admin-layout">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <AdminSidebar />


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="admin-content">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="users-header">

          <h1>
            Users
          </h1>

          <p>
            Manage registered users
            in the Fake News Detection
            system.
          </p>

        </div>


        {/* =================================================
            SEARCH
        ================================================= */}

        <div className="users-search-container">

          <input
            type="text"
            className="users-search-input"
            placeholder="Search by name, username or email..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          {search && (

            <button
              className="clear-search-btn"
              onClick={() =>
                setSearch("")
              }
            >
              Clear
            </button>

          )}

        </div>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <div className="users-error">

            {error}

          </div>

        )}


        {/* =================================================
            TABLE
        ================================================= */}

        <div className="users-table-card">


          {loading ? (

            <div className="users-loading">

              Loading users...

            </div>


          ) : filteredUsers.length === 0 ? (

            <div className="users-empty">

              {search
                ? "No users found matching your search."
                : "No users found."
              }

            </div>


          ) : (

            <div className="table-wrapper">

              <table className="users-table">


                <thead>

                  <tr>

                    <th>
                      ID
                    </th>

                    <th>
                      Name
                    </th>

                    <th>
                      Username
                    </th>

                    <th>
                      Email
                    </th>

                    <th>
                      Role
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Joined
                    </th>

                    <th>
                      Action
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {filteredUsers.map(
                    (user) => (

                      <tr
                        key={user.id}
                      >


                        {/* ID */}

                        <td>
                          {user.id}
                        </td>


                        {/* NAME */}

                        <td>
                          {user.name || "-"}
                        </td>


                        {/* USERNAME */}

                        <td>

                          <span className="username-badge">

                            {user.username}

                          </span>

                        </td>


                        {/* EMAIL */}

                        <td>

                          {user.email || "-"}

                        </td>


                        {/* ROLE */}

                        <td>

                          {user.is_superuser ? (

                            <span className="role-badge admin-role">

                              Admin

                            </span>

                          ) : user.is_staff ? (

                            <span className="role-badge staff-role">

                              Staff

                            </span>

                          ) : (

                            <span className="role-badge user-role">

                              User

                            </span>

                          )}

                        </td>


                        {/* STATUS */}

                        <td>

                          {user.is_active ? (

                            <span className="status-badge active-status">

                              Active

                            </span>

                          ) : (

                            <span className="status-badge inactive-status">

                              Inactive

                            </span>

                          )}

                        </td>


                        {/* JOINED */}

                        <td>

                          {user.date_joined
                            ? new Date(
                                user.date_joined
                              ).toLocaleDateString()
                            : "-"
                          }

                        </td>


                        {/* ACTION */}

                        <td>

                          <button
                            className="delete-user-btn"
                            onClick={() =>
                              handleDelete(
                                user.id
                              )
                            }
                          >
                            Delete
                          </button>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}


export default AdminUsers; 