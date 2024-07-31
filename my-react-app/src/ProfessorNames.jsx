import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import * as d3 from 'd3';
import { useNavigate } from 'react-router-dom';

function ProfessorNames({ professors }) {
  console.log("Professor Details");
  const { major } = useParams(); // Extract major from URL
  const filteredProfessors = professors.filter(p => p.major === major);
  const svgRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    // Clear previous graph
    svg.selectAll("*").remove();

    // Set up nodes
    const nodes = [{ id: "PROFESSORS", group: 0 }].concat(
      filteredProfessors.map(prof => ({ id: `${prof.ProfessorFN} ${prof.ProfessorLN}`, group: 1 }))
    );
    
    // Set up links
    const links = filteredProfessors.map(prof => ({
      source: `${prof.ProfessorFN} ${prof.ProfessorLN}`,
      target: "PROFESSORS"
    }));

    // Set up simulation
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(150))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(400, 300));

    // Draw links
    const link = svg.append("g")
      .attr("stroke", "#999")
      .selectAll("line")
      .data(links)
      .join("line");

    // Draw nodes
    const nodeGroup = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g");

    // Append rectangles for professors
    nodeGroup.append("rect")
      .attr("width", 100)
      .attr("height", 50)
      .attr("fill", d => d.group === 0 ? "blue" : "green")
      .on("click", (event, d) => {
        if (d.group === 1) { // Assuming this is a professor
          // navigate(`/professor/${d.id}`); // Navigate to professor's details
          navigate(`/professor/${encodeURIComponent(d.id)}`);
        }
    });
    // Append text labels
    nodeGroup.append("text")
      .text(d => d.id)
      .attr("x", 50) // Center the text within the rectangle
      .attr("y", 25) // Align the text vertically in the middle of the rectangle
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "black")
      .style("font-size", "12px")
      .style("font-family", "Arial");

    // Define the drag behavior
    const drag = d3.drag()
      .on("start", (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    // Apply the drag behavior to the nodes
    nodeGroup.call(drag);

    simulation.on("tick", () => {
        // const rectWidth = 100;
        // const rectHeight = 50;
      link
        .attr("x1", d => d.source.x + 50)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x + 50)
        .attr("y2", d => d.target.y);

      nodeGroup.attr("transform", d => `translate(${d.x},${d.y})`);
    });

  }, [filteredProfessors, navigate]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
    <h1 style={{ textAlign: 'center' }}>Professor Names</h1>
    <svg ref={svgRef} width={800} height={600} style={{ border: '1px solid black' }}></svg>
  </div>
    // <svg ref={svgRef} width={800} height={600} style={{ border: '1px solid black' }}></svg>
  );
}

export default ProfessorNames;
