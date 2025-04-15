import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import dashboardBg from "../assets/picture.jpg";

const Dashboard = ({ user }) => {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: `url(${dashboardBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="container mt-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-lg p-6">
        <h2 className="text-3xl font-bold mb-8 text-white dark:text-white">
          Welcome to Taskify, {user.displayName || user.email}
        </h2>
        <TaskForm user={user} />
        <TaskList user={user} />
      </div>
    </div>
  );
};

export default Dashboard;