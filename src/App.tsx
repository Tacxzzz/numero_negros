import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { Dashboard } from "./pages/Dashboard";
import { GamePage } from "./pages/GamePage";
import { CreatePage } from "./pages/CreatePage";
import { UserProvider } from "./pages/UserContext";
import { GameHistoryPage } from './pages/GameHistoryPage';
import { MyBetsPage } from './pages/MyBetsPage';
import { TournamentsPage } from './pages/TournamentsPage';
import { SupportPage } from './pages/SupportPage';
import { MyTransactionsPage } from './pages/MyTransactionsPage';
import { DrawHistoryPage } from "./pages/DrawHistoryPage";
import { PaymentSuccess } from "./pages/PaymentSuccess";
import { BetClientsPage } from "./pages/BetClientsPage";
import { ClientProvider } from "./pages/ClientContext";
import PisoPlaysGuide from "./pages/PisoPlaysGuide";

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
      <ClientProvider>
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
          <Route path="/game/:gameId/:gameType/:drawId" element={<ProtectedRoute element={<GamePage />} />} />
          <Route path="/game-history/:gameId" element={<GameHistoryPage />} />
          {/* Add a test route */}
          <Route path="/test" element={<div>Test Page Works!</div>} />
          <Route path="/my-bets" element={<MyBetsPage />} />
          <Route path="/tournaments" element={<TournamentsPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/transactions" element={<MyTransactionsPage />} />
          <Route path="/drawhistory" element={<DrawHistoryPage />} />
          <Route path="/betclients" element={<BetClientsPage />} />
          <Route path="/payment-success" element={<ProtectedRoute element={<PaymentSuccess />} />} />
          <Route path="/pisoplaysguide" element={<PisoPlaysGuide />} />
        </Routes>
      </Router>
      
      </ClientProvider>
    </UserProvider>
  );
}

export default App;