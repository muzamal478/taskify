import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const signUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
    } catch (error) {
      console.error("Sign Up Error:", error.message);
    }
  };

  const logIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
    } catch (error) {
      console.error("Login Error:", error.message);
    }
  };

  const logOut = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <div className="max-w-md mx-auto p-4">
      {user ? (
        <div>
          <h2 className="text-xl">Welcome, {user.email}</h2>
          <button onClick={logOut} className="mt-2 bg-red-500 text-white p-2 rounded">Logout</button>
        </div>
      ) : (
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-2 mb-2 border rounded"
          />
          <button onClick={signUp} className="w-full bg-blue-500 text-white p-2 rounded mb-2">Sign Up</button>
          <button onClick={logIn} className="w-full bg-green-500 text-white p-2 rounded">Login</button>
        </div>
      )}
    </div>
  );
};

export default Auth;