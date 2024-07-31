import React from 'react';
import { useParams } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import './ProfessorProfile.css';
import CurrentDateComponent from './CurrentDateComponent';
import { useNavigate } from 'react-router-dom';

function ProfessorProfile({ professors }) {
  let navigate = useNavigate();
  const { name } = useParams();
  const decodedName = decodeURIComponent(name);
  const professor = professors.find(p => `${p.ProfessorFN} ${p.ProfessorLN}` === decodedName);

  // Helper function to calculate year difference
  const calculateYearDifference = (from, to = new Date()) => {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    return toDate.getFullYear() - fromDate.getFullYear();
  };

  // Aggregate durations
  let totalTA = 0, totalAssociate = 0, totalEmployed = 0;
  professors.forEach(prof => {
    totalTA += calculateYearDifference(prof.TeacherAssistant, prof.AssociateProfessor);
    totalAssociate += calculateYearDifference(prof.AssociateProfessor, prof.EmploymentDate);
    totalEmployed += calculateYearDifference(prof.EmploymentDate);
  });

  // Assuming the total time is the sum of all durations
  const totalTime = totalTA + totalAssociate + totalEmployed;

  // Calculate percentages
  const data = [
    { name: 'Teacher Assistant', value: (totalTA / totalTime) * 100 },
    { name: 'Associate Professor', value: (totalAssociate / totalTime) * 100 },
    { name: 'Employed', value: (totalEmployed / totalTime) * 100 },
  ];

  return (
    <>
    <h1 class="top-center-container">{professor.ProfessorFN} {professor.ProfessorLN} Information</h1>

    <div  className="profile-container" style={{ display: 'flex', gap: '20px' }}>

      <div className="chart-container" style={{ width: '50%' }}>

        <PieChart width={400} height={400}>
          <Pie
            dataKey="value"
            isAnimationActive={true}
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28'][index % 3]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
      {/* Professor's information rendering remains the same */}
      <div className="info-container" style={{ width: '50%' }}>
       <div class="top-center-container">
         <h1>Information</h1>
       </div>

       {professor ? (
  <div>
    <div>
      <p><strong>First Name:</strong></p>
    </div>
    <div className="professor-info">
      <p>{professor.ProfessorFN}</p>
    </div>
    <div>
      <p><strong>Last Name: </strong></p>
    </div>
    <div className="professor-info">
      <p>{professor.ProfessorLN}</p>
    </div>
    <div>
      <p><strong>Birth Date:</strong> </p>
    </div>
    <div className="professor-info">
      <p>{professor.BirthDate}</p>
    </div>
    <div>
      <p><strong>Employment Date:</strong> </p>
    </div>
    <div className="professor-info">
      <p>{professor.EmploymentDate}</p>
    </div>
    {/* Add more professor info as needed */}
    <div>
    <p><strong>Current Date:</strong> </p>
    <div className="professor-info"><CurrentDateComponent /></div>
      
    </div>
  </div>
) : (
  <p>Professor not found</p>
)}
        <div className='div-button-container'>
          <button 
              className="button-spacing"
              onClick={() => navigate(`/more-info/${encodeURIComponent(`${professor.ProfessorFN} ${professor.ProfessorLN}`)}`)}
          >More Information</button>
          <a href="https://www.google.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <button className="button-spacing" type="button">Go to Google</button>
          </a>
        </div>


       </div>
     </div>



    </>
  );

}

export default ProfessorProfile;
