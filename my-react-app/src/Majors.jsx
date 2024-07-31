import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useNavigate } from 'react-router-dom';

function ForceGraph({ professors }) {
  const svgRef = useRef();
  const navigate = useNavigate();
  useEffect(() => {
    const majors = Array.from(new Set(professors.map(p => p.major)));

    // Nodes: one for the university and one for each major
    const nodes = [{ id: "University", group: 0 }].concat(
      majors.map(major => ({ id: major, group: 1 }))
    );

    // Links: between the university and each major
    const links = majors.map(major => ({
      source: "University",
      target: major
    }));
    // const navigate = useNavigate();
    drawForceGraph(nodes, links);
  }, [professors]); // Redraw graph when professors data changes

  function drawForceGraph(nodes, links) {
    const svg = d3.select(svgRef.current);
    const width = +svg.attr("width");
    const height = +svg.attr("height");

    svg.selectAll("*").remove();
    
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(150))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
      .attr("stroke", "#999")
      .selectAll("line")
      .data(links)
      .join("line");
    // const navigate = useNavigate();
    // Important: Group for nodes to hold both circles and texts for smoother dragging
    const nodeGroup = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(drag(simulation));
 
      // Apply drag behavior to the group
 
    // Append circles to the group
    nodeGroup.append("circle")
      .attr("r", 40)
      .attr("fill", d => d.group === 0 ? "red" : "blue")
      .on("click", (event, d) => {
          if (d.group === 1) { // Assuming group 1 is for majors
              navigate(`/professors/${d.id}`); // Use the correct path here
          }
      });
    // Append text to the group, centered
    nodeGroup.append("text")
      .text(d => d.id)
      .attr("text-anchor", "middle") // Center horizontally
      .attr("dominant-baseline", "central") // Center vertically
      .attr("fill", "white")
      .style("font-size", "12px")
      .style("font-family", "Arial");

    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      nodeGroup.attr("transform", d => `translate(${d.x},${d.y})`);
    });
  }

  // Drag behavior
  const drag = simulation => {
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  };

  return (
    // <svg ref={svgRef} width={800} height={600} style={{ border: '1px solid black' }}></svg>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
    <h1 style={{ textAlign: 'center' }}>Majors Graph</h1>
    <svg ref={svgRef} width={800} height={600} style={{ border: '1px solid black' }}></svg>
  </div>
  );
}

export default ForceGraph;
