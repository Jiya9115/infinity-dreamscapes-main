import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "./components/Navbar";
import AdminLayout from "./pages/Admin/AdminLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

// Client Pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Generate from "./pages/Generate";
import Gallery from "./pages/Gallery";
import Pricing from "./pages/Pricing";

// Admin Pages
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminUsers from "./pages/Admin/AdminUsers";
import AdminImages from "./pages/Admin/AdminImages";
import AdminPayments from "./pages/Admin/AdminPayments";
import AdminSettings from "./pages/Admin/AdminSettings";

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* === PUBLIC ROUTES === */}
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />

        {/* === PROTECTED CLIENT ROUTES === */}
        <Route 
          path="/generate" 
          element={
            <ProtectedRoute>
              <Generate />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/gallery" 
          element={
            <ProtectedRoute>
              <Gallery />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/pricing" 
          element={
            <ProtectedRoute>
              <Pricing />
            </ProtectedRoute>
          } 
        />

        {/* === PROTECTED ADMIN ROUTES === */}
        {/* FIX 1: Added path="/admin" to the wrapper so the Navbar link works */}
        {/* FIX 2: Added requireAdmin={true} to actually lock the door to your specific email */}
        <Route 
          path="/admin"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* FIX 3: If they click the Navbar link and go to "/admin", redirect them to the dashboard */}
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="images" element={<AdminImages />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Catch-all: Send any unknown URLs back to the homepage */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;