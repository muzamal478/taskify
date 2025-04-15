import { useState } from "react";
import { db, analytics } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import { logEvent } from "firebase/analytics";

const TaskForm = ({ user }) => {
  const [task, setTask] = useState("");
  const [category, setCategory] = useState("Work");
  const [dueDate, setDueDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const addTask = async (e) => {
    e.preventDefault();
    if (!task || !user) return;
    setIsLoading(true);
    try {
      const newTask = {
        text: task,
        category,
        dueDate: dueDate ? dueDate.toISOString() : null,
        uid: user.uid,
        createdAt: new Date().toISOString(),
      };
      await addDoc(collection(db, "tasks"), newTask);
      toast.success("Task added successfully!");
      logEvent(analytics, "add_task", { category, hasDueDate: !!dueDate });
      setTask("");
      setCategory("Work");
      setDueDate(null);
    } catch (err) {
      toast.error("Failed to add task");
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={addTask} className="mb-8">
      <div className="flex flex-col gap-4 sm:flex-row">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Add a new task"
          className="flex 1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
          disabled={isLoading}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
          disabled={isLoading}
        >
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Urgent">Urgent</option>
        </select>
        <DatePicker
          selected={dueDate}
          onChange={(date) => setDueDate(date)}
          placeholderText="Select due date"
          className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
          dateFormat="MM/dd/yyyy"
          disabled={isLoading}
        />
        <button type="submit" className="addbtn" disabled={isLoading}>
          {isLoading ? <div className="spinner mx-auto"></div> : "Add Task"}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;