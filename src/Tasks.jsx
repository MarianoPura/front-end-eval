import { useEffect, useState } from 'react';
import api from './api/axios';
import './Tasks.css';

function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await api.get('/tasks');
            setTasks(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        setAdding(true);
        setError('');
        try {
            const res = await api.post('/tasks', {
                title: newTaskTitle,
                isDone: false
            });
            setTasks([...tasks, res.data]);
            setNewTaskTitle('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add task');
        } finally {
            setAdding(false);
        }
    };

    const toggleTask = async (task) => {
        try {
            const res = await api.put(`/tasks/${task.id}`, {
                title: task.title,
                isDone: !task.isDone
            });
            setTasks(tasks.map(t => t.id === task.id ? res.data : t));
        } catch (err) {
            console.error(err);
        }
    };

    const deleteTask = async (id) => {
        try {
            await api.delete(`/tasks/${id}`);
            setTasks(tasks.filter(t => t.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return <div className="tasks-loading">Loading tasks...</div>;
    }

    return (
        <div className="tasks-container">
            <form className="add-task-form" onSubmit={handleAddTask}>
                <input
                    type="text"
                    placeholder="What needs to be done?"
                    value={newTaskTitle}
                    onChange={(e) => {
                        setNewTaskTitle(e.target.value);
                        if (error) setError('');
                    }}
                />
                <button type="submit" disabled={adding || !newTaskTitle.trim()}>
                    {adding ? 'Adding...' : 'Add Task'}
                </button>
            </form>
            {error && <p className="task-error">{error}</p>}

            {tasks.length === 0 ? (
                <div className="empty-state">
                    <p>No tasks yet. Add one above!</p>
                </div>
            ) : (
                <ul className="tasks-list">
                    {tasks.map(task => (
                        <li key={task.id} className={task.isDone ? 'completed' : ''}>
                            <div className="task-content" onClick={() => toggleTask(task)}>
                                <span className="checkbox">{task.isDone ? '✓' : ''}</span>
                                <span className="task-title">{task.title}</span>
                            </div>
                            <button className="delete-btn" onClick={() => deleteTask(task.id)}>
                                ×
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <div className="tasks-footer">
                <span>{tasks.filter(t => !t.isDone).length} tasks remaining</span>
            </div>
        </div>
    );
}

export default Tasks;
