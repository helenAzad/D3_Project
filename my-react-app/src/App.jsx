// App.jsx
import React, { useState, useEffect } from 'react';
import ForceGraph from './Majors.jsx';
import professorsData from './data.json';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProfessorNames from './ProfessorNames.jsx';
import ProfessorProfile from './ProfessorProfile.jsx'
import MoreInfo from './MoreInfo.jsx';
function App() {
  const [professors, setProfessors] = useState([]);
  
  useEffect(() => {
    setProfessors(professorsData.professors);
  }, []);
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={
            <>
              <div className="App">
                <header className="App-header">
                </header>
              </div>
              <ForceGraph professors={professors} />
            </>
          } />
          <Route path="/professors/:major" element={<ProfessorNames professors={professors} />} />
          <Route path="/professor/:name" element={<ProfessorProfile professors={professors} />} />
          <Route path="/more-info/:name" element={<MoreInfo professors={professors}/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
