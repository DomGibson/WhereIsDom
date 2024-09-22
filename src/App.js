// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPrimary from './pages/DashboardPrimary';
import DashboardSecondary from './pages/DashboardSecondary';
import PrivateRoute from './components/PrivateRoute'; // Import the updated PrivateRoute

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        
        {/* Wrap private routes with PrivateRoute */}
        <Route path="/" element={<PrivateRoute />}>
          <Route path="dashboard-primary" element={<DashboardPrimary />} />
          <Route path="dashboard-secondary" element={<DashboardSecondary />} />
        </Route>
        
      </Routes>
    </Router>
  );
}

export default App;
