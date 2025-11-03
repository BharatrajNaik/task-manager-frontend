import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // You only need to import CSS once, but safe to keep here
import { Container, Button, Form, ListGroup, Row, Col } from 'react-bootstrap'; // Import components
import './App.css'; 

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState(''); 

  const fetchTasks = () => {
    // ... (fetchTasks function remains the same) ...
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

  const handleSubmit = (e) => {
    // ... (handleSubmit function remains the same) ...
    e.preventDefault();
    if (!newTitle.trim()) return;

    axios.post('http://localhost:8080/api/tasks', { title: newTitle, completed: false })
      .then(response => {
        setTasks([...tasks, response.data]);
        setNewTitle('');
      });
  };

  const toggleTaskStatus = (task) => {
    // ... (toggleTaskStatus function remains the same) ...
    const updatedStatus = !task.completed;
    axios.put(`http://localhost:8080/api/tasks/${task.id}`, { title: task.title, completed: updatedStatus })
      .then(() => {
        setTasks(tasks.map(t => 
          t.id === task.id ? { ...t, completed: updatedStatus } : t
        ));
      });
  };

  const deleteTask = (id) => {
    // ... (deleteTask function remains the same) ...
    axios.delete(`http://localhost:8080/api/tasks/${id}`)
      .then(() => {
        setTasks(tasks.filter(t => t.id !== id));
      });
  };

  if (loading) {
    return <div className="App"><Container>Loading tasks from backend...</Container></div>;
  }
  
  return (
    <Container className="my-5"> {/* Use Container for centering and spacing */}
      <h1 className="text-center mb-4">Task Manager Full Stack</h1>
      <p className="text-center text-muted">Tasks Fetched from Spring Boot API</p>
      
      {/* --- Task Creation Form using Form component --- */}
      <Form onSubmit={handleSubmit} className="mb-4">
        <Row>
          <Col xs={9}>
            <Form.Control
              type="text"
              placeholder="New task title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </Col>
          <Col xs={3}>
            <Button variant="primary" type="submit" disabled={!newTitle.trim()} className="w-100">
              Add Task
            </Button>
          </Col>
        </Row>
      </Form>

      <hr/>

      {/* --- Task List using ListGroup component --- */}
      {tasks.length === 0 ? (
        <p className="text-center text-secondary">No tasks found. Add a new one above.</p>
      ) : (
        <ListGroup>
          {tasks.map(task => (
            <ListGroup.Item 
              key={task.id} 
              className="d-flex justify-content-between align-items-center"
              variant={task.completed ? 'success' : 'light'} // Apply color styling
            >
              <div style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                {task.title}
                <small className="ms-3 text-muted"> (ID: {task.id})</small>
              </div>
              <div>
                <Button 
                  variant={task.completed ? 'warning' : 'info'} 
                  size="sm" 
                  onClick={() => toggleTaskStatus(task)} 
                  className="me-2"
                >
                  {task.completed ? 'Mark Pending' : 'Mark Complete'}
                </Button>
                <Button 
                  variant="danger" 
                  size="sm" 
                  onClick={() => deleteTask(task.id)}
                >
                  Delete
                </Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Container>
  );
}

export default App;