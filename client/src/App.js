// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Masthead from './Masthead';
import Home from './Home';

function App() {
  return (
    <Router>
      <div className="App">
        <Masthead />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;