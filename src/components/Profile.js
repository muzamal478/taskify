import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { updateProfile, updateEmail, deleteUser, signOut, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { doc, setDoc, getDoc, deleteDoc, collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmModal from "./ConfirmModal";
import skyBg from "../assets/picture.jpg"; 

const Profile = ({ user, setUser }) => {
  const [displayName, setDisplayName] = useState(user.displayName || "");
  const [email, setEmail] = useState(user.email || "");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [city, setCity] = useState("");
  const [gender, setGender] = useState("");
  const [language, setLanguage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Load user details from Firestore
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setPhoneNumber(data.phoneNumber || "");
          setCity(data.city || "");
          setGender(data.gender || "");
          setLanguage(data.language || "");
        }
      } catch (err) {
        console.error("Error fetching user details:", err);
      }
    };
    fetchUserDetails();
  }, [user]);

  // Handle profile update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateProfile(auth.currentUser, { displayName });
      await updateEmail(auth.currentUser, email);
      await setDoc(
        doc(db, "users", user.uid),
        {
          displayName,
          email,
          phoneNumber,
          city,
          gender,
          language,
        },
        { merge: true }
      );
      setUser({ ...user, displayName, email });
      setError("");
      toast.success("Profile updated successfully!");
    } catch (err) {
      setError(`Failed to update profile: ${err.message}`);
      toast.error(`Failed to update profile: ${err.message}`);
      console.error("Update error:", err);
    }
    setIsLoading(false);
  };

  // Re-authenticate user if needed
  const reauthenticateUser = async (password) => {
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(auth.currentUser, credential);
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      // Prompt for password to re-authenticate
      const password = prompt("Please enter your password to confirm account deletion:");
      if (!password) {
        throw new Error("Password is required to delete account");
      }
      await reauthenticateUser(password);

      // Delete user's tasks
      const tasksQuery = query(
        collection(db, "tasks"),
        where("uid", "==", user.uid)
      );
      const tasksSnapshot = await getDocs(tasksQuery);
      const deleteTasks = tasksSnapshot.docs.map((taskDoc) =>
        deleteDoc(doc(db, "tasks", taskDoc.id))
      );
      await Promise.all(deleteTasks);

      // Delete user data from Firestore
      await deleteDoc(doc(db, "users", user.uid));

      // Delete Firebase Auth user
      await deleteUser(auth.currentUser);

      // Sign out user
      await signOut(auth);

      // Clear user state
      setUser(null);

      // Show success message
      toast.success("Account deleted successfully!");

      // Redirect to login
      navigate("/login");
    } catch (err) {
      setError(`Failed to delete account: ${err.message}`);
      toast.error(`Failed to delete account: ${err.message}`);
      console.error("Delete error:", err);
    }
    setIsLoading(false);
    setIsModalOpen(false);
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: `url(${skyBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="container mt-8 mb-8">
        <div className="card bg-white/90 dark:bg-gray-800/90 backdrop-blur-md">
          <h2 className="text-2xl font-semibold mb-6 text-[#1E90FF] dark:text-[#63b3ed]">
            Update Profile
          </h2>
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          <form onSubmit={handleUpdate}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                  className="w-full"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="w-full"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Your phone number"
                  className="w-full"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Your city"
                  className="w-full"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full"
                  disabled={isLoading}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full"
                  disabled={isLoading}
                >
                  <option value="">Select language</option>
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="Hindi">Hindi</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                className="btn btn-primary flex-1"
                disabled={isLoading}
              >
                {isLoading ? <div className="spinner mx-auto"></div> : "Save Profile"}
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="btn btn-danger flex-1 text-center"
                disabled={isLoading}
              >
                Delete Account
              </button>
            </div>
          </form>
        </div>
      </div>
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeleteAccount}
        message="Are you sure you want to delete your account?"
      />
    </div>
  );
};

export default Profile;