import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { Dashboard } from "./pages/Dashboard";
import { GamePage } from "./pages/GamePage";
import { CreatePage } from "./pages/CreatePage";
import { UserProvider } from "./pages/UserContext";
import { GameHistoryPage } from './pages/GameHistoryPage';

const isAuthenticated = () => {
  const token = localStorage.getItem("authToken");
  console.log("isAuthenticated:", !!token); // Debug auth status
  return !!token;
};

const ProtectedRoute = ({ element }) => {
  const auth = isAuthenticated();
  console.log("ProtectedRoute check:", auth); // Debug route protection
  return auth ? element : <Navigate to="/" replace />;
};

const RedirectIfAuthenticated = ({ element }) => {
  const auth = isAuthenticated();
  console.log("RedirectIfAuthenticated check:", auth); // Debug redirect
  return auth ? <Navigate to="/dashboard" replace /> : element;
};

const handleLogout = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("identifier");
  window.location.reload();
};

function App() {
  console.log("App rendered"); // Confirm App mounts
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/create-account"
            element={<RedirectIfAuthenticated element={<CreatePage />} />}
          />
          <Route
            path="/dashboard"
            element={<ProtectedRoute element={<Dashboard onLogout={handleLogout} />} />}
          />
          <Route path="/game" element={<ProtectedRoute element={<GamePage />} />} />
          <Route path="/game-history/:gameId" element={<GameHistoryPage />} />
          {/* Add a test route */}
          <Route path="/test" element={<div>Test Page Works!</div>} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;