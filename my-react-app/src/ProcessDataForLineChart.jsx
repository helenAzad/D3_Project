import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';


function processData(professor){
    const dataByYear = {};
    const startYear = new Date(professor.AssociateProfessor).getFullYear();
    professor.publishedAsseyDate.forEach((year) => {
      if (year >= startYear && year <= 2024) {
        dataByYear[year] = (dataByYear[year] || 0) + 1;
      }
    }
    );
  
    const processedData = Object.keys(dataByYear).sort().map((year) => ({
      year: parseInt(year),
      count: dataByYear[year],
    }));
  
    // Calculate cumulative sums
    let cumulativeSum = 0;
    const cumulativeData = processedData.map((d) => {
      cumulativeSum += d.count;
      return { ...d, cumulativeCount: cumulativeSum };
    });
  
    return cumulativeData;
  };
  
export default processData;
