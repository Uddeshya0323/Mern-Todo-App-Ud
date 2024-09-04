import React, { useEffect, useState } from "react";
import {
  FaCheck,
  FaPencilAlt,
  FaPlus,
  FaSearch,
  FaTrash,
  FaPlay,
  FaPause,
  FaStop,
} from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import { CreateTask, DeleteTaskById, GetAllTasks, UpdateTaskById } from "./api";
import { notify } from "./utils";
import "./TaskManager.css"; // Import the CSS file

function TaskManager() {
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState([]);
  const [copyTasks, setCopyTasks] = useState([]);
  const [updateTask, setUpdateTask] = useState(null);
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  // Stopwatch state
  const [isRunning, setIsRunning] = useState(false);
  const [stopwatchTime, setStopwatchTime] = useState(0); // Time in milliseconds
  const [startTime, setStartTime] = useState(0);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const dateOptions = { year: "numeric", month: "long", day: "numeric" };
      const timeOptions = {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };
      setCurrentDate(now.toLocaleDateString(undefined, dateOptions));
      setCurrentTime(now.toLocaleTimeString(undefined, timeOptions));
    };

    updateDateTime(); // Initial call
    const intervalId = setInterval(updateDateTime, 1000); // Update every second

    return () => clearInterval(intervalId); // Clean up interval on unmount
  }, []);

  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => {
        setStopwatchTime((prevTime) => prevTime + 100); // Increase by 100 ms
      }, 100);
    } else {
      clearInterval(intervalId);
    }
    return () => clearInterval(intervalId);
  }, [isRunning]);

  const handleStartStopwatch = () => {
    if (!isRunning) {
      setStartTime(Date.now() - stopwatchTime); // Adjust start time
      setIsRunning(true);
    }
  };

  const handleStopStopwatch = () => {
    if (isRunning) {
      setIsRunning(false);
    }
  };

  const handleResetStopwatch = () => {
    setIsRunning(false);
    setStopwatchTime(0);
  };

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 100);
    return `${minutes}:${
      seconds < 10 ? `0${seconds}` : seconds
    }.${milliseconds}`;
  };

  const handleTask = () => {
    if (updateTask && input) {
      // Update API call
      console.log("update api call");
      const obj = {
        taskName: input,
        isDone: updateTask.isDone,
        _id: updateTask._id,
      };
      handleUpdateItem(obj);
    } else if (updateTask === null && input) {
      console.log("create api call");
      // Create API call
      handleAddTask();
    }
    setInput("");
  };

  useEffect(() => {
    if (updateTask) {
      setInput(updateTask.taskName);
    }
  }, [updateTask]);

  const handleAddTask = async () => {
    const obj = {
      taskName: input,
      isDone: false,
    };
    try {
      const { success, message } = await CreateTask(obj);
      if (success) {
        // Show success toast
        notify(message, "success");
      } else {
        // Show error toast
        notify(message, "error");
      }
      fetchAllTasks();
    } catch (err) {
      console.error(err);
      notify("Failed to create task", "error");
    }
  };

  const fetchAllTasks = async () => {
    try {
      const { data } = await GetAllTasks();
      setTasks(data);
      setCopyTasks(data);
    } catch (err) {
      console.error(err);
      notify("Failed to fetch tasks", "error");
    }
  };

  useEffect(() => {
    fetchAllTasks();
  }, []);

  const handleDeleteTask = async (id) => {
    try {
      const { success, message } = await DeleteTaskById(id);
      if (success) {
        // Show success toast
        notify(message, "success");
      } else {
        // Show error toast
        notify(message, "error");
      }
      fetchAllTasks();
    } catch (err) {
      console.error(err);
      notify("Failed to delete task", "error");
    }
  };

  const handleCheckAndUncheck = async (item) => {
    const { _id, isDone, taskName } = item;
    const obj = {
      taskName,
      isDone: !isDone,
    };
    try {
      const { success, message } = await UpdateTaskById(_id, obj);
      if (success) {
        // Show success toast
        notify(message, "success");
      } else {
        // Show error toast
        notify(message, "error");
      }
      fetchAllTasks();
    } catch (err) {
      console.error(err);
      notify("Failed to update task", "error");
    }
  };

  const handleUpdateItem = async (item) => {
    const { _id, isDone, taskName } = item;
    const obj = {
      taskName,
      isDone: isDone,
    };
    try {
      const { success, message } = await UpdateTaskById(_id, obj);
      if (success) {
        // Show success toast
        notify(message, "success");
      } else {
        // Show error toast
        notify(message, "error");
      }
      fetchAllTasks();
    } catch (err) {
      console.error(err);
      notify("Failed to update task", "error");
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    const oldTasks = [...copyTasks];
    const results = oldTasks.filter((item) =>
      item.taskName.toLowerCase().includes(term)
    );
    setTasks(results);
  };

  return (
    <div className="task-manager-container ">
      <div className="task-manager">
        <div className="date-time-card">
          <div className="date-time">
            <div className="current-date">{currentDate}</div>
            <div className="current-time">{currentTime}</div>
          </div>
          <div className="stopwatch">
            <div className="stopwatch-display">{formatTime(stopwatchTime)}</div>
            <div className="stopwatch-controls">
              {!isRunning ? (
                <button
                  onClick={handleStartStopwatch}
                  className="btn btn-success btn-sm"
                >
                  <FaPlay />
                </button>
              ) : (
                <button
                  onClick={handleStopStopwatch}
                  className="btn btn-warning btn-sm"
                >
                  <FaPause />
                </button>
              )}
              <button
                onClick={handleResetStopwatch}
                className="btn btn-danger btn-sm"
              >
                <FaStop />
              </button>
            </div>
          </div>
        </div>

        <h1 className="mb-4">Task Manager</h1>

        <div className="quote">
          “ Don’t let yesterday take up too much of today.”
        </div>
        <div className="quote">
          “We don’t just sit around and wait for other people. We just make, and
          we do.”
        </div>
        <div className="quote">
          "Setting goals is the first step in turning the invisible into the
          visible."
        </div>
        <div className="quote">
          "Learn as if you will live forever, live like you will die tomorrow."
        </div>
        <div className="quote">
          "Either you run the day or the day runs you."
        </div>

        {/* Input and Search box */}
        <div className="d-flex justify-content-between align-items-center mb-4 w-100">
          <div className="input-group flex-grow-1 me-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="form-control me-1"
              placeholder="Add a new Task"
            />
            <button
              onClick={handleTask}
              className="btn btn-success btn-sm me-2"
            >
              <FaPlus className="m-2" />
            </button>
          </div>

          <div className="input-group flex-grow-1">
            <span className="input-group-text">
              <FaSearch />
            </span>
            <input
              onChange={handleSearch}
              className="form-control"
              type="text"
              placeholder="Search tasks"
            />
          </div>
        </div>

        {/* List of items */}
        <div className="d-flex flex-column w-100">
          {tasks.map((item) => (
            <div key={item._id} className="task-item">
              <span
                className={item.isDone ? "text-decoration-line-through" : ""}
              >
                {item.taskName}
              </span>

              <div className="">
                <button
                  onClick={() => handleCheckAndUncheck(item)}
                  className="btn btn-success btn-sm me-2"
                  type="button"
                >
                  <FaCheck />
                </button>
                <button
                  onClick={() => setUpdateTask(item)}
                  className="btn btn-primary btn-sm me-2"
                  type="button"
                >
                  <FaPencilAlt />
                </button>
                <button
                  onClick={() => handleDeleteTask(item._id)}
                  className="btn btn-danger btn-sm me-2"
                  type="button"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Toastify */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
        />
      </div>
    </div>
  );
}

export default TaskManager;
