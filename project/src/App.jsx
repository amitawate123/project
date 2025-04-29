import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Components/Home'
import AboutPage from './Components/AboutPage';
import DT from './Components/DT'
import Drag from './Components/Drag';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/dt" element={<DT />} />
        <Route path="/drag" element={<Drag />} />
        <Route path="/drag/:dtId" element={<Drag />} />
        
        
      </Routes>
    </Router>
  );
}

export default App;
