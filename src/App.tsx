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
        {/* Anyone can see the homepage and auth page */}
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />

        {/* === PROTECTED CLIENT ROUTES === */}
        {/* Users must be signed in to access these */}
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
        {/* Wrapping the AdminLayout protects ALL nested admin routes automatically! */}
        <Route 
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/images" element={<AdminImages />} />
          <Route path="/admin/payments" element={<AdminPayments />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>

        {/* Catch-all: Send any unknown URLs back to the homepage */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;