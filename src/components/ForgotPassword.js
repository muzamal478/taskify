import { useState } from "react";
import { auth } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import signup from "../assets/signup.jpg"; // New sky background

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setError("");
      toast.success("Password reset link sent to your email!");
      navigate("/login");
    } catch (err) {
      setError("Failed to send reset link. Check your email.");
      toast.error("Failed to send reset link");
    }
    setIsLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${signup})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
       <div className="card w-full max-w-md bg-white/90 backdrop-blur-md">
          <h2 className="text-3xl font-bold mb-6 text-center text-[#1E90FF] dark:text-[#63b3ed]"> 
          Forgot Password
        </h2>
        <p className="text-center mb-4 text-[#1E90FF] dark:text-[#63b3ed]">
          Enter your email to receive a password reset link.
        </p>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleReset}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="mb-6"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? <div className="spinner mx-auto"></div> : "Send Reset Link"}
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

export default ForgotPassword;