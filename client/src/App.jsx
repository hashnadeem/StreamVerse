import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { StreamProvider } from './context/StreamContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import BrowsePage from './pages/BrowsePage';
import TitleDetailsPage from './pages/TitleDetailsPage';
import WatchPage from './pages/WatchPage';
import ProfilesPage from './pages/ProfilesPage';
import MyListPage from './pages/MyListPage';
import PlansPage from './pages/PlansPage';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

const AppLayout = () => {
  const location = useLocation();
  const hideChrome =
    location.pathname.startsWith('/watch/') ||
    location.pathname === '/login' ||
    location.pathname === '/signup';

  return (
    <div className="app-shell">
      {!hideChrome && <Navbar />}
      <main className="main-content">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route
            path="/profiles"
            element={
              <ProtectedRoute>
                <ProfilesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/browse"
            element={
              <ProtectedRoute>
                <BrowsePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/title/:id"
            element={
              <ProtectedRoute>
                <TitleDetailsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/watch/:id"
            element={
              <ProtectedRoute>
                <WatchPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-list"
            element={
              <ProtectedRoute>
                <MyListPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/plans"
            element={
              <ProtectedRoute>
                <PlansPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      {!hideChrome && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <StreamProvider>
        <AppLayout />
      </StreamProvider>
    </AuthProvider>
  );
};

export default App;

