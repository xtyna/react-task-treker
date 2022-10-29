import Header from "./components/Header";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Tasks from "./components/Tasks";
import AddTask from "./components/AddTask";
import Footer from "./components/Footer";
import About from "./components/About";
import MyInputs from "./components/Inputs";

import { useState, useEffect } from "react";
import "./index.css";

function App() {
  const [showAddTask, setShowAddTask] = useState(false);
  const [tasks, setTasks] = useState([]);

  //Fetch Task
  const fetchTask = async () => {
    const res = await fetch("http://localhost:5000/tasks/${id}");
    const data = await res.json();

    return data;
  };

  //Add Task
  const addTask = async (task) => {
    const data = task;
    setTasks([...tasks, data]);
    setShowAddTask(false);
    // const id = Math.floor(Math.random() * 10000) + 1;
    // const newTask = { id, ...task };
    // setTasks([...tasks, newTask]);
  };

  //Delete Task
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "DELETE",
    });

    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Toggle Reminder
  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id);
    const updTask = { ...taskToToggle, reminder: !taskToToggle.reminder };

    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(updTask),
    });
    const data = await res.json();

    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, reminder: !data.reminder } : task
      )
    );
  };

  return (
    <Router>
      <div className="container">
        <MyInputs style={{ display: "flex", height: "130px" }} />
        <Header
          onAdd={() => setShowAddTask(!showAddTask)}
          showAdd={showAddTask}
        />
        {showAddTask && <AddTask onAdd={addTask} />}
        {tasks.length > 0 ? (
          <Tasks
            tasks={tasks}
            onDelete={deleteTask}
            onToggle={toggleReminder}
          />
        ) : (
          "No tasks added"
        )}
        <Routes>
          <Route path="/about" component={About} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
