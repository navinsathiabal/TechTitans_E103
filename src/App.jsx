
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import Plan from './pages/Plan';
import Create from './pages/Create';
import Fund from './pages/Fund';
import Login from './pages/Login';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem('growth_assist_session');
    if (session) {
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, []);

  if (loading) return null;

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route
          path="/login"
          element={!isLoggedIn ? <Login /> : <Navigate to="/" />}
        />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            isLoggedIn ? (
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/plan" element={<Plan />} />
                  <Route path="/create" element={<Create />} />
                  <Route path="/fund" element={<Fund />} />
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
