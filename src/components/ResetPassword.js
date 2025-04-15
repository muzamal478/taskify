import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import skyBg from "../assets/signup.jpg"; 

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [actionCode, setActionCode] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Extract and verify actionCode from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const oobCode = params.get("oobCode");
    if (oobCode) {
      setActionCode(oobCode);
      verifyPasswordResetCode(auth, oobCode)
        .then(() => {
          setError(""); // Clear any previous errors
        })
        .catch((err) => {
          console.error("Verify code error:", err);
          let errorMessage = "Unable to verify reset link";
          if (err.code === "auth/expired-action-code") {
            errorMessage = "Reset link has expired";
          } else if (err.code === "auth/invalid-action-code") {
            errorMessage = "Invalid reset link";
          }
          setError(errorMessage);
          toast.error(errorMessage);
          navigate("/login");
        });
    } else {
      setError("No reset code provided");
      toast.error("No reset code provided");
      navigate("/login");
    }
  }, [location, navigate]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      toast.error("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      await confirmPasswordReset(auth, actionCode, newPassword);
      setError("");
      toast.success("Password updated successfully!");
      navigate("/login");
    } catch (err) {
      console.error("Reset password error:", err);
      let errorMessage = "Failed to update password";
      if (err.code === "auth/weak-password") {
        errorMessage = "Password is too weak";
      } else if (err.code === "auth/invalid-action-code") {
        errorMessage = "Invalid or expired reset link";
      }
      setError(errorMessage);
      toast.error(errorMessage);
    }
    setIsLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${skyBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="card w-full max-w-md bg-white/90 backdrop-blur-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#1E90FF] dark:text-[#63b3ed]">
          Create New Password
        </h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleResetPassword}>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
            className="mb-4"
            disabled={isLoading}
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className="mb-6"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? <div className="spinner mx-auto"></div> : "Update Password"}
          </button>
        </form>
        <div className="text-center mt-4">
          <a
            href="/login"
            className="text-[#1E90FF] dark:text-[#63b3ed] hover:underline text-sm"
          >
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;