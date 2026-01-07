import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import Plan from './pages/Plan';
import Create from './pages/Create';
import Fund from './pages/Fund';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/plan" element={<Plan />} />
          <Route path="/create" element={<Create />} />
          <Route path="/fund" element={<Fund />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;