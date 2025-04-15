import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { FaSun, FaMoon } from "react-icons/fa";
import ConfirmModal from "./ConfirmModal";
import { useState } from "react";

const Header = ({ user, toggleDarkMode, isDarkMode }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = async () => {
    setIsModalOpen(true);
  };

  const confirmLogout = async () => {
    await signOut(auth);
    setIsModalOpen(false);
    navigate("/login");
  };

  return (
    <>
      <header className="bg-[#1E90FF] dark:bg-gray-800 text-white shadow-md sticky top-0 z-10">
        <div className="container flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="Taskify Logo" className="h-10 w-10 object-contain" />
            <h1 className="text-xl font-bold tracking-tight">Taskify</h1>
          </div>
          <nav className="flex items-center space-x-3">
          <button onClick={toggleDarkMode} className="btn btn-secondary">
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </button>
            {user && (
              <button
                onClick={() => navigate("/profile")}
                className="btn btn-secondary"
              >
                Profile
              </button>
            )}
            {user && (
              <button
                onClick={() => navigate("/dashboard")}
                className="btn btn-secondary"
              >
                Dashboard
              </button>
            )}
            {user ? (
              <button onClick={handleLogout} className="btn btn-danger">
                Logout
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="btn btn-secondary"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="btn btn-primary"
                >
                  Sign Up
                </button>
              </>
            )}
          </nav>
        </div>
      </header>
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmLogout}
        message="Are you sure you want to logout?"
      />
    </>
  );
};

export default Header;