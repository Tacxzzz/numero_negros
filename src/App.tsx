import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { UserProvider } from "./pages/UserContext";
import { ClientProvider } from "./pages/ClientContext";
import AddToHomeScreen from "./components/AddToHomeScreen";
import { PlayerCashinTotal } from "./pages/PlayerCashinTotal";
import { PlayerCashoutTotal } from "./pages/PlayerCashoutTotal";


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

const PlayerWins = lazy(() => import("./pages/PlayerWins").then(module => ({ default: module.PlayerWins })));
const PlayerBalances = lazy(() => import("./pages/PlayerBalances").then(module => ({ default: module.PlayerBalances })));
const PlayerCommissions = lazy(() => import("./pages/PlayerCommissions").then(module => ({ default: module.PlayerCommissions })));
const PlayerCashin = lazy(() => import("./pages/PlayerCashin").then(module => ({ default: module.PlayerCashin })));
const PlayerCashout = lazy(() => import("./pages/PlayerCashout").then(module => ({ default: module.PlayerCashout })));



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
  return (
    <UserProvider>
      <ClientProvider>
        <Router>
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
            <Routes>
              <Route path="/" element={<RedirectIfAuthenticated><LoginPage /></RedirectIfAuthenticated>} />
              <Route path="/create-account" element={<RedirectIfAuthenticated><CreatePage /></RedirectIfAuthenticated>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard onLogout={handleLogout} /></ProtectedRoute>} />
              <Route path="/game/:gameId/:gameType/:drawId" element={<ProtectedRoute><GamePage /></ProtectedRoute>} />
              <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
              <Route path="/game-history/:gameId" element={<GameHistoryPage />} />
              <Route path="/my-bets" element={<MyBetsPage />} />
              <Route path="/tournaments" element={<TournamentsPage />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/transactions" element={<MyTransactionsPage />} />
              <Route path="/drawhistory" element={<DrawHistoryPage />} />
              <Route path="/betclients" element={<BetClientsPage />} />
              <Route path="/pisoplaysguide" element={<PisoPlaysGuide />} />
              <Route path="/manageTeam" element={<ManageReferrals />} />
              <Route path="/allowReferrer" element={<AllowReferrer />} />
              <Route path="/team" element={<Players />} />
              <Route path="/teambets" element={<PlayerTotalBets />} />
              <Route path="/playerbets" element={<PlayerBets />} />
              <Route path="/teamwins" element={<PlayerWins />} />
              <Route path="/teambalances" element={<PlayerBalances />} />
              <Route path="/teamcommissions" element={<PlayerCommissions />} />
              <Route path="/teamcashins" element={<PlayerCashinTotal />} />
              <Route path="/playercashins" element={<PlayerCashin />} />
              <Route path="/teamcashouts" element={<PlayerCashoutTotal />} />
              <Route path="/playercashouts" element={<PlayerCashout />} />
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
