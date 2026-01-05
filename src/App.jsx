import { useState, useEffect } from 'react';
import './App.css';
import Tasks from './Tasks';
import Login from './Login';
import Register from './Register';

function App() {
    const [user, setUser] = useState(null);
    const [showRegister, setShowRegister] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogin = (userData) => {
        setUser(userData);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
    };

    const handleRegisterSuccess = () => {
        setShowRegister(false);
    };

    if (!user) {
        return (
            <div className="auth-wrapper">
                <h1>Task Manager</h1>
                <p className="tagline">Get things done, one task at a time.</p>
                {showRegister ? (
                    <Register
                        onRegister={handleRegisterSuccess}
                        onSwitchToLogin={() => setShowRegister(false)}
                    />
                ) : (
                    <Login
                        onLogin={handleLogin}
                        onSwitchToRegister={() => setShowRegister(true)}
                    />
                )}
            </div>
        );
    }

    return (
        <div className="app">
            <div className="header">
                <h1>Task Manager</h1>
                <div className="user-info">
                    <span>{user.email}</span>
                    <button onClick={handleLogout}>Sign out</button>
                </div>
            </div>
            <Tasks />
        </div>
    );
}

export default App;
