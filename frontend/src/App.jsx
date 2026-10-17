import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import UserView from './pages/user/UserView';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAuthPage from './pages/admin/AdminAuthPage';
import AdminCategoryPage from './pages/admin/AdminCategoryPage';
import AdminShortcutPage from './pages/admin/AdminShortcutPage';
import AdminHistoryPage from './pages/admin/AdminHistoryPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
          <Navbar />

          <main className="flex-1">
            <Routes>
              {/* Public User Side (http://localhost:5173/ - No login required) */}
              <Route path="/" element={<UserView />} />

              {/* Admin Side Routes */}
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/login" element={<AdminAuthPage />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              {/* Alias for common typo in request: /admin/dsahboard */}
              <Route path="/admin/dsahboard" element={<Navigate to="/admin/dashboard" replace />} />
              
              <Route path="/admin/createcategory" element={<AdminCategoryPage />} />
              <Route path="/admin/shortcut" element={<AdminShortcutPage />} />
              <Route path="/admin/history" element={<AdminHistoryPage />} />

              {/* Backward compatibility redirects from /admin007 */}
              <Route path="/admin007" element={<Navigate to="/admin/login" replace />} />
              <Route path="/admin007/login" element={<Navigate to="/admin/login" replace />} />
              <Route path="/admin007/dashboard" element={<Navigate to="/admin/dashboard" replace />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
