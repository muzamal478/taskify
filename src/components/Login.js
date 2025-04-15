import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link } from "react-router-dom";
import authBg from "../assets/login.jpg";
import { toast } from "react-toastify";
import CryptoJS from "crypto-js";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("taskifyEmail");
    const savedPassword = localStorage.getItem("taskifyPassword");
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      const bytes = CryptoJS.AES.decrypt(savedPassword, "taskify-secret-key");
      const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);
      setPassword(decryptedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      setError("");
      toast.success("Logged in successfully!");

      if (rememberMe) {
        localStorage.setItem("taskifyEmail", email);
        const encryptedPassword = CryptoJS.AES.encrypt(password, "taskify-secret-key").toString();
        localStorage.setItem("taskifyPassword", encryptedPassword);
      } else {
        localStorage.removeItem("taskifyEmail");
        localStorage.removeItem("taskifyPassword");
      }
    } catch (err) {
      setError("Invalid email or password");
      toast.error("Failed to login");
    }
    setIsLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${authBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="card w-full max-w-md bg-white/90 backdrop-blur-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#1E90FF] dark:text-[#63b3ed]">
          Login to Taskify
        </h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="mb-4"
            disabled={isLoading}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="mb-4"
            disabled={isLoading}
          />
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="mr-2 h-4 w-4 text-[#1E90FF] focus:ring-[#1E90FF] border-gray-300 rounded"
              disabled={isLoading}
            />
            <label
              htmlFor="rememberMe"
              className="text-sm text-[#1E90FF] dark:text-[#63b3ed]"
            >
              Remember Me
            </label>
          </div>
          <div className="text-right mb-4">
            <Link
              to="/forgot-password"
              className="text-[#1E90FF] dark:text-[#63b3ed] hover:underline text-sm"
            >
              Forgot Password?
            </Link>
          </div>
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? <div className="spinner mx-auto"></div> : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;









