import './App.css';
import Home from "./pages/Home";
import Register from './pages/Register';
import Login from './pages/Login';
import Game from './pages/Game';

import { Route, Routes, Navigate } from 'react-router-dom';
import GameStatus from './pages/GameStatus';

function App() {

  // 🔒 Protected Route function
  const ProtectedRoute = ({ children }) => {

    const token = localStorage.getItem("token");

    if (!token) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  return (
    <Routes>

      {/* Home */}
      <Route path="/" element={<Home />} />

      {/* Auth */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/gamestatus" element={<GameStatus />} />

      {/* Game (Protected) */}
      <Route
        path="/game/:level"
        element={
          <ProtectedRoute>
            <Game />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;