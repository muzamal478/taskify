import { useState, useEffect } from "react";
import { db, analytics } from "../firebase";
import { collection, query, where, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
import taskBg from "../assets/task.jpg";
import { format } from "date-fns";
import ConfirmModal from "./ConfirmModal";
import { toast } from "react-toastify";
import { logEvent } from "firebase/analytics";

const TaskList = ({ user }) => {
  const [tasks, setTasks] = useState([]);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editText, setEditText] = useState("");
  const [filter, setFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setIsLoading(true);
    const q = query(collection(db, "tasks"), where("uid", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTasks(tasksData);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const deleteTask = async (id) => {
    setTaskToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (taskToDelete) {
      setIsLoading(true);
      try {
        await deleteDoc(doc(db, "tasks", taskToDelete));
        toast.success("Task deleted successfully!");
        logEvent(analytics, "delete_task");
      } catch (err) {
        toast.error("Failed to delete task");
      }
      setTaskToDelete(null);
      setIsLoading(false);
    }
    setIsModalOpen(false);
  };

  const startEdit = (task) => {
    setEditTaskId(task.id);
    setEditText(task.text);
  };

  const updateTask = async (id) => {
    setIsLoading(true);
    try {
      await updateDoc(doc(db, "tasks", id), { text: editText });
      toast.success("Task updated successfully!");
      logEvent(analytics, "update_task");
    } catch (err) {
      toast.error("Failed to update task");
    }
    setEditTaskId(null);
    setEditText("");
    setIsLoading(false);
  };

  const filteredTasks = filter === "All" ? tasks : tasks.filter((task) => task.category === filter);

  return (
    <>
      <div className="card">
        <h2 className="text-2xl font-semibold mb-4 text-[#1E90FF] dark:text-[#63b3ed]">
          Your Tasks
        </h2>
        {isLoading && <div className="spinner mx-auto mb-4"></div>}
        <div className="flex gap-2 mb-4">
          {["All", "Work", "Personal", "Urgent"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`btn ${filter === cat ? "btn-primary" : "btn-secondary"}`}
              disabled={isLoading}
            >
              {cat}
            </button>
          ))}
        </div>
        {filteredTasks.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No tasks in this category.</p>
        ) : (
          filteredTasks.map((task) => (
            <div key={task.id} className="card mb-4 overflow-hidden">
              <img src={taskBg} alt="Task" className="task-image" />
              <div className="p-4">
                {editTaskId === task.id ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="flex-1"
                      disabled={isLoading}
                    />
                    <button
                      onClick={() => updateTask(task.id)}
                      className="btn btn-primary"
                      disabled={isLoading}
                    >
                      {isLoading ? <div className="spinner"></div> : "Save"}
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-lg">{task.text}</span>
                      <span className="block text-sm text-gray-500 dark:text-gray-400">
                        {task.category}
                      </span>
                      {task.dueDate && (
                        <span className="block text-sm text-gray-500 dark:text-gray-400">
                          Due: {format(new Date(task.dueDate), "MM/dd/yyyy")}
                        </span>
                      )}
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => startEdit(task)}
                        className="btn btn-secondary"
                        disabled={isLoading}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="btn btn-danger"
                        disabled={isLoading}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this task?"
      />
    </>
  );
};

export default TaskList;