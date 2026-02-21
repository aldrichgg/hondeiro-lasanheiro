import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/AuthContext';
import { UIProvider } from './hooks/UIContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { MainLayout } from './layouts/MainLayout';

// Pages
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ChatPage } from './pages/ChatPage';
import { VehiclePage } from './pages/VehiclePage';
import { LibraryPage } from './pages/LibraryPage';
import { SellersPage } from './pages/SellersPage';

function App() {
  return (
    <AuthProvider>
      <UIProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/vehicle" element={<VehiclePage />} />
              <Route path="/library" element={<LibraryPage />} />
              <Route path="/sellers" element={<SellersPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Route>
          </Routes>
        </Router>
      </UIProvider>
    </AuthProvider>
  );
}

export default App;
