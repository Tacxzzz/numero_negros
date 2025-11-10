import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { UserProvider } from "./pages/UserContext";
import { ClientProvider } from "./pages/ClientContext";
import AddToHomeScreen from "./components/AddToHomeScreen";
import { PlayerCashinTotal } from "./pages/PlayerCashinTotal";
import { PlayerCashoutTotal } from "./pages/PlayerCashoutTotal";
import { useEffect, useState } from 'react';
import { goToBet88 } from './lib/goToBet88';

// Correct lazy imports: 
const LoginPage = lazy(() => import("./pages/LoginPage").then(module => ({ default: module.LoginPage })));
const Dashboard = lazy(() => import("./pages/Dashboard").then(module => ({ default: module.Dashboard })));
const GamePage = lazy(() => import("./pages/GamePage").then(module => ({ default: module.GamePage })));
const CreatePage = lazy(() => import("./pages/CreatePage").then(module => ({ default: module.CreatePage })));
const GameHistoryPage = lazy(() => import("./pages/GameHistoryPage").then(module => ({ default: module.GameHistoryPage })));
const MyBetsPage = lazy(() => import("./pages/MyBetsPage").then(module => ({ default: module.MyBetsPage })));
const TournamentsPage = lazy(() => import("./pages/TournamentsPage").then(module => ({ default: module.TournamentsPage })));
const SupportPage = lazy(() => import("./pages/SupportPage").then(module => ({ default: module.SupportPage })));
const MyTransactionsPage = lazy(() => import("./pages/MyTransactionsPage").then(module => ({ default: module.MyTransactionsPage })));
const DrawHistoryPage = lazy(() => import("./pages/DrawHistoryPage").then(module => ({ default: module.DrawHistoryPage })));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess").then(module => ({ default: module.PaymentSuccess })));
const BetClientsPage = lazy(() => import("./pages/BetClientsPage").then(module => ({ default: module.BetClientsPage })));
const PisoPlaysGuide = lazy(() => import("./pages/PisoPlaysGuide").then(module => ({ default: module.default })));
const ManageReferrals = lazy(() => import("./pages/ManageReferrals").then(module => ({ default: module.ManageReferrals })));
const AllowReferrer = lazy(() => import("./pages/AllowReferrer").then(module => ({ default: module.AllowReferrer })));
const Players = lazy(() => import("./pages/Players").then(module => ({ default: module.Players })));
const PlayerBets = lazy(() => import("./pages/PlayerBets").then(module => ({ default: module.PlayerBets })));
const PlayerTotalBets = lazy(() => import("./pages/PlayerTotalBets").then(module => ({ default: module.PlayerTotalBets })));
const SavedBets = lazy(() => import("./pages/SavedBets").then(module => ({ default: module.SavedBets })));

const PlayerWins = lazy(() => import("./pages/PlayerWins").then(module => ({ default: module.PlayerWins })));
const PlayerBalances = lazy(() => import("./pages/PlayerBalances").then(module => ({ default: module.PlayerBalances })));
const PlayerCommissions = lazy(() => import("./pages/PlayerCommissions").then(module => ({ default: module.PlayerCommissions })));
const PlayerCashin = lazy(() => import("./pages/PlayerCashin").then(module => ({ default: module.PlayerCashin })));
const PlayerCashout = lazy(() => import("./pages/PlayerCashout").then(module => ({ default: module.PlayerCashout })));
const TicketReceipt = lazy(() => import("./pages/TicketReceipt"));

const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("authToken");
};

const handleLogout = (): void => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("identifier");
  window.location.reload();
};

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  return isAuthenticated() ? children : <Navigate to="/" replace />;
};

const RedirectIfAuthenticated = ({ children }: { children: JSX.Element }) => {
  return isAuthenticated() ? <Navigate to="/dashboard" replace /> : children;
};


function App() {
  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('redirectedToBet88') === 'true') {
      setRedirected(true);
    }
  }, []);

  if (redirected) {
    // Show locked screen instead of your app routes
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center gap-4">
        <div className="flex gap-4 mt-4">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => goToBet88()}
          >
            Go to Bet88
          </button>
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded"
            onClick={() => {
              sessionStorage.removeItem('redirectedToBet88'); // Clear the session flag
              window.location.reload(); // Refresh the app so user can access it again
            }}
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <UserProvider>
      <ClientProvider>
        <Router>
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
            <Routes>
              <Route path="/" element={<RedirectIfAuthenticated><LoginPage /></RedirectIfAuthenticated>} />
              <Route path="/create-account" element={<RedirectIfAuthenticated><CreatePage /></RedirectIfAuthenticated>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard onLogout={handleLogout} /></ProtectedRoute>} />
              <Route path="/game/:gameId/:gameType/:drawId" element={<ProtectedRoute><GamePage onLogout={handleLogout}/></ProtectedRoute>} />
              <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
              <Route path="/game-history/:gameId" element={<ProtectedRoute><GameHistoryPage onLogout={handleLogout}/></ProtectedRoute>} />
              <Route path="/my-bets" element={<ProtectedRoute><MyBetsPage onLogout={handleLogout}/></ProtectedRoute>} />
              <Route path="/tournaments" element={<TournamentsPage />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/transactions" element={<ProtectedRoute><MyTransactionsPage onLogout={handleLogout} /></ProtectedRoute>} />
              <Route path="/drawhistory" element={<ProtectedRoute><DrawHistoryPage onLogout={handleLogout} /></ProtectedRoute>} />
              <Route path="/betclients" element={<ProtectedRoute><BetClientsPage onLogout={handleLogout} /></ProtectedRoute>} />
              <Route path="/savedbets" element={<ProtectedRoute><SavedBets onLogout={handleLogout} /></ProtectedRoute>} />
              <Route path="/pisoplaysguide" element={<PisoPlaysGuide />} />
              <Route path="/manageTeam" element={<ProtectedRoute><ManageReferrals onLogout={handleLogout} /></ProtectedRoute>} />
              <Route path="/allowReferrer" element={<ProtectedRoute><AllowReferrer onLogout={handleLogout} /></ProtectedRoute>} />
              <Route path="/team" element={<ProtectedRoute><Players onLogout={handleLogout} /></ProtectedRoute>} />
              <Route path="/teambets" element={<ProtectedRoute><PlayerTotalBets onLogout={handleLogout} /></ProtectedRoute>} />
              <Route path="/playerbets" element={<ProtectedRoute><PlayerBets onLogout={handleLogout} /></ProtectedRoute>} />
              <Route path="/ticketreceipt" element={<TicketReceipt />} />
              <Route path="/teamwins" element={<ProtectedRoute><PlayerWins onLogout={handleLogout} /></ProtectedRoute>} />
              <Route path="/teambalances" element={<ProtectedRoute><PlayerBalances onLogout={handleLogout} /></ProtectedRoute>} />
              <Route path="/teamcommissions" element={<ProtectedRoute><PlayerCommissions onLogout={handleLogout} /></ProtectedRoute>} />
              <Route path="/teamcashins" element={<ProtectedRoute><PlayerCashinTotal onLogout={handleLogout} /></ProtectedRoute>} />
              <Route path="/playercashins" element={<ProtectedRoute><PlayerCashin onLogout={handleLogout} /></ProtectedRoute>} />
              <Route path="/teamcashouts" element={<ProtectedRoute><PlayerCashoutTotal onLogout={handleLogout} /></ProtectedRoute>} />
              <Route path="/playercashouts" element={<ProtectedRoute><PlayerCashout onLogout={handleLogout} /></ProtectedRoute>} />
              <Route path="/test" element={<div>Test Page Works!</div>} />
              <Route path="*" element={<Navigate to="/" replace />} />
              
            </Routes>
          </Suspense>
        </Router>
        <AddToHomeScreen />
      </ClientProvider>
    </UserProvider>
  );
}

export default App;