import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Finance } from './pages/Finance';
import { Marketing } from './pages/Marketing';
import { Sales } from './pages/Sales';
import { Reports } from './pages/Reports';
import { Import } from './pages/Import';
import { Workflow } from './pages/Workflow';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/marketing" element={<Marketing />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/import" element={<Import />} />
          <Route path="/workflow" element={<Workflow />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;