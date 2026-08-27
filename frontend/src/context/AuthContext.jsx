import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================================================
  // RESTORE LOGIN SESSION
  // =========================================================

  useEffect(() => {
    const access = localStorage.getItem("access");
    const username = localStorage.getItem("username");
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");

    const isStaff =
      localStorage.getItem("is_staff") === "true";

    const isSuperuser =
      localStorage.getItem("is_superuser") === "true";

    if (access && username) {
      setUser({
        username,
        name: name || "",
        email: email || "",
        is_staff: isStaff,
        is_superuser: isSuperuser,
      });
    } else {
      setUser(null);
    }

    setLoading(false);
  }, []);

  // =========================================================
  // LOGIN
  // =========================================================

  const login = (data) => {
    if (!data?.access || !data?.refresh) {
      console.error("Invalid login response.");
      return;
    }

    const isStaff = Boolean(data.is_staff);
    const isSuperuser = Boolean(data.is_superuser);

    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);

    localStorage.setItem(
      "username",
      data.username || ""
    );

    localStorage.setItem(
      "name",
      data.name || ""
    );

    localStorage.setItem(
      "email",
      data.email || ""
    );

    localStorage.setItem(
      "is_staff",
      String(isStaff)
    );

    localStorage.setItem(
      "is_superuser",
      String(isSuperuser)
    );

    setUser({
      username: data.username || "",
      name: data.name || "",
      email: data.email || "",
      is_staff: isStaff,
      is_superuser: isSuperuser,
    });
  };

  // =========================================================
  // UPDATE USER PROFILE
  // =========================================================

  const updateUser = (data) => {
    if (!data) {
      return;
    }

    const updatedUser = {
      username:
        data.username ??
        user?.username ??
        "",

      name:
        data.name ??
        user?.name ??
        "",

      email:
        data.email ??
        user?.email ??
        "",

      is_staff:
        data.is_staff ??
        user?.is_staff ??
        false,

      is_superuser:
        data.is_superuser ??
        user?.is_superuser ??
        false,
    };

    localStorage.setItem(
      "username",
      updatedUser.username
    );

    localStorage.setItem(
      "name",
      updatedUser.name
    );

    localStorage.setItem(
      "email",
      updatedUser.email
    );

    localStorage.setItem(
      "is_staff",
      String(updatedUser.is_staff)
    );

    localStorage.setItem(
      "is_superuser",
      String(updatedUser.is_superuser)
    );

    setUser(updatedUser);
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("username");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("is_staff");
    localStorage.removeItem("is_superuser");

    setUser(null);
  };

  // =========================================================
  // AUTHENTICATION STATUS
  // =========================================================

  const isAuthenticated = Boolean(
    user &&
    localStorage.getItem("access")
  );

  // =========================================================
  // ADMIN STATUS
  // =========================================================

  const isAdmin = Boolean(
    user &&
    (user.is_staff || user.is_superuser)
  );

  // =========================================================
  // CONTEXT
  // =========================================================

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// =========================================================
// USE AUTH HOOK
// =========================================================

export function useAuth() {
  return useContext(AuthContext);
}