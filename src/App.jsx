import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import Header from './components/Header';
import Home from './pages/Home';
import Sign from './pages/Sign'; 
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Verify from './pages/Verify';
import Module from './pages/Module';
import Page from './pages/Page';
import SelectEdad from './pages/SelectEdad';
import SelectAvatar from './pages/SelectAvatar';
import Register from './pages/Register';

function App() {
  return (
    <div>
      <main>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/select-edad" element={<SelectEdad />} />
            <Route path="/select-avatar" element={<SelectAvatar />} />
            <Route path="/register" element={<Register />} />
            <Route path="/sign" element={<Sign />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/dashboard" element={<Dashboard />} /> 
            <Route path='/profile' element={<Profile></Profile>}/>
            <Route path="/module/:moduleId" element={<Module />} />
            <Route path="/page/:pageId" element={<Page />} />
          </Routes>
        </div>
      </Router>
      </main>
    </div>
  
  )
}

export default App
