import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { Dashboard } from "./pages/Dashboard";
import { GamePage } from "./pages/GamePage";
import { CreatePage } from "./pages/CreatePage"; // ✅ Import CreateAccountPage
import { UserProvider, useUser } from "./pages/UserContext";

const isAuthenticated = () => {
  return !!localStorage.getItem("authToken");
};

const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  return isAuthenticated() ? element : <Navigate to="/" replace />;
};

const handleLogout = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("identifier");
  window.location.reload();
};

function App() {
  return (
    <UserProvider>
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/create-account" element={<CreatePage />} /> {/* ✅ New Route */}
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard onLogout={handleLogout} />} />} />
        <Route path="/game" element={<ProtectedRoute element={<GamePage />} />} />
      </Routes>
    </Router>
    </UserProvider>
  );
}

export default App;
