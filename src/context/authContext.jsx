import { useState, useContext, createContext, useEffect } from "react";

const AuthContext = createContext();

// AuthProvider Component
const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const data = localStorage.getItem("auth");
    return data ? JSON.parse(data) : { user: null, token: "" };
  });

  // Update localStorage whenever auth state changes
  useEffect(() => {
    if (auth.user) {
      localStorage.setItem("auth", JSON.stringify(auth));  // Save auth in localStorage if user exists
    }
  }, [auth]);

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook to Access AuthContext
const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
