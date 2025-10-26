import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MaterialForm from "./components/MaterialForm";
import './styles/animations.css';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MaterialForm />} />
      </Routes>
    </Router>
  );
}
