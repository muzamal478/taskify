import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { auth, analytics } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { logEvent } from "firebase/analytics";
import Header from "./components/Header";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Profile from "./components/Profile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        logEvent(analytics, "login", { userId: currentUser.uid });
      }
    });
    return () => unsubscribe();
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    logEvent(analytics, "toggle_theme", { theme: isDarkMode ? "light" : "dark" });
  };

  return (
    <Router>
      <div className={isDarkMode ? "dark min-h-screen" : "min-h-screen"}>
        <Header user={user} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
        <Routes>
          <Route
            path="/login"
            element={!user ? <Login setUser={setUser} /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/signup"
            element={!user ? <Signup setUser={setUser} /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/dashboard"
            element={user ? <Dashboard user={user} /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile"
            element={user ? <Profile user={user} setUser={setUser} /> : <Navigate to="/login" />}
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Router>
  );
}

export default App;