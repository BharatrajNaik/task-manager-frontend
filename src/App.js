import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; 

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState(''); // State for the new task title

  const fetchTasks = () => {
    axios.get('http://localhost:8080/api/tasks')
      .then(response => {
        setTasks(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching tasks:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // --- NEW: Function to handle task creation ---
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents default form submission (page reload)
    if (!newTitle.trim()) return; // Don't submit empty titles

    axios.post('http://localhost:8080/api/tasks', {
      title: newTitle,
      completed: false // Default status
    })
      .then(response => {
        // Update the tasks list with the new task returned by the server
        setTasks([...tasks, response.data]);
        setNewTitle(''); // Clear the input field
      })
      .catch(error => {
        console.error("Error creating task:", error);
      });
  };
  // ---------------------------------------------

  if (loading) {
    return <div className="App">Loading tasks from backend...</div>;
  }

  // --- NEW: Function to handle status toggling (PUT request) ---
    const toggleTaskStatus = (task) => {
        const updatedStatus = !task.completed;
        
        // Axios PUT Request
        axios.put(`http://localhost:8080/api/tasks/${task.id}`, {
            title: task.title,
            completed: updatedStatus // Send the inverted status
        })
        .then(response => {
            // Update the tasks state without refreshing the page
            setTasks(tasks.map(t => 
                t.id === task.id ? { ...t, completed: updatedStatus } : t
            ));
        })
        .catch(error => {
            console.error("Error toggling task status:", error);
        });
    };
    // -------------------------------------------------------------
  // --- NEW: Function to handle task deletion (DELETE request) ---
    const deleteTask = (id) => {
        // Axios DELETE Request
        axios.delete(`http://localhost:8080/api/tasks/${id}`)
        .then(() => {
            // Update the tasks state by filtering out the deleted task
            setTasks(tasks.filter(t => t.id !== id));
        })
        .catch(error => {
            console.error("Error deleting task:", error);
        });
    };
    // -------------------------------------------------------------
  return (
    <div className="App">
      <h1>Task Manager Frontend</h1>
      <p>Tasks Fetched from Spring Boot API:</p>
      
      {/* --- NEW: Task Creation Form --- */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="New task title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <button type="submit">Add Task</button>
      </form>
      <hr/>
      {/* ------------------------------- */}

      {tasks.length === 0 ? (
        <p>No tasks found in the database.</p>
      ) : (
        <ul>
          {tasks.map(task => (
            <li key={task.id}>
              {task.title} - Status: **{task.completed ? 'COMPLETED' : 'PENDING'}** (ID: {task.id})
              <button onClick={() => toggleTaskStatus(task)} style={{ marginLeft: '10px' }}>
                Toggle Status
              </button>
              <button onClick={() => deleteTask(task.id)} style={{ marginLeft: '10px', color: 'red' }}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;