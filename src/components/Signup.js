import { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import authBg from "../assets/signup.jpg";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Signup = ({ setUser }) => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Client-side validation
    if (!userName.trim()) {
      setError("User name is required");
      toast.error("User name is required");
      setIsLoading(false);
      return;
    }
    if (userName.trim().length < 2) {
      setError("User name must be at least 2 characters");
      toast.error("User name must be at least 2 characters");
      setIsLoading(false);
      return;
    }
    if (!email.trim()) {
      setError("Email is required");
      toast.error("Email is required");
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      toast.error("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update Firebase Auth profile with user name
      await updateProfile(user, {
        displayName: userName.trim(),
      });

      setUser({ ...user, displayName: userName.trim() });
      setError("");
      toast.success("Account created successfully!");
      navigate("/profile"); // Redirect to profile page
    } catch (err) {
      console.error("Signup error:", err);
      let errorMessage = "Failed to create account";
      if (err.code === "auth/email-already-in-use") {
        errorMessage = "Email is already in use";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Invalid email address";
      } else if (err.code === "auth/weak-password") {
        errorMessage = "Password is too weak";
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
        backgroundImage: `url(${authBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
     <div className="card w-full max-w-md bg-white/90 backdrop-blur-md">
         <h2 className="text-3xl font-bold mb-6 text-center text-[#1E90FF] dark:text-[#63b3ed]">
          Sign Up for Taskify
        </h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSignup}>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="User Name"
            className="mb-4"
            disabled={isLoading}
          />
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
            className="mb-6"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? <div className="spinner mx-auto"></div> : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;