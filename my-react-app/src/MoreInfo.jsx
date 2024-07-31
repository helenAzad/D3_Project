import React from 'react';
import { useParams } from 'react-router-dom';
import processData from './ProcessDataForLineChart';
import CumulativeLineChart from './CumulativeLineChart.jsx';
import './ProfessorProfile.css'
function MoreInfo({ professors }) {
  const { name } = useParams();
  const decodedName = decodeURIComponent(name);
  const professor = professors.find(p => `${p.ProfessorFN} ${p.ProfessorLN}` === decodedName);
  const processedData = processData(professor);

  return (
    <>
    <div>
      <h1 className='top-center-container'>{professor.ProfessorFN} {professor.ProfessorLN}</h1>
    </div>
    <div  className="profile-container" style={{ display: 'flex', gap: '20px' }}>
        <div className="chart-container" style={{ width: '50%' }}>
         <h1 className='top-center-container'>Article Statistics</h1>
            <CumulativeLineChart data={processedData} />
        </div>
        <div className="info-container" style={{ width: '50%' }}>

       <div class="top-center-container">
         <h1>Researching Fields</h1>
       </div>
             {professor.fields.map((field, index) => (
              <>
              <div key={index}><p><strong>Field {index + 1}:</strong></p></div>
              <div key={index} className="professor-info"><p>{field}</p></div>
              </>
            ))}
            
        </div>
    </div>
    </>
  );
}

export default MoreInfo;
