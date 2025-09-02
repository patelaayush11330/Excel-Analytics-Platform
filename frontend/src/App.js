import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import axios from "axios";

// Page imports
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import History from "./pages/History";
import UploadPage from "./pages/UploadPage";
import ChartPage from "./pages/ChartPage";
import ShowData from "./components/ShowData";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUserFiles from "./pages/AdminUserFiles";
import LandingPage from "./pages/LandingPage";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

// ✅ Axios Global Config
axios.defaults.baseURL = "http://localhost:5000/api";
axios.defaults.withCredentials = true;

const AppLayout = () => {
  const location = useLocation();

  // ✅ Hide Navbar/Footer on Landing, Login, Register
  const hideNavbarFooter = ["/", "/login", "/register"].includes(location.pathname);

  return (
    <>
      {!hideNavbarFooter && <Navbar />}

      <div className={!hideNavbarFooter ? "sidebar-open" : ""}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <UploadPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/charts/:fileId"
            element={
              <ProtectedRoute>
                <ChartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chartpage"
            element={
              <ProtectedRoute>
                <ChartPage />
              </ProtectedRoute>
            }
          />

          {/* Admin user-specific files */}
          <Route
            path="/admin/user-files/:userId"
            element={
              <ProtectedRoute>
                <AdminUserFiles />
              </ProtectedRoute>
            }
          />

          {/* Unprotected Data Viewer */}
          <Route path="/showdata/:fileId" element={<ShowData />} />
          <Route path="/showdata" element={<ShowData />} />
        </Routes>
      </div>

      {!hideNavbarFooter && <Footer />}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
