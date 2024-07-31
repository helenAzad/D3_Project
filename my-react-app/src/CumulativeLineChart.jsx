import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const CumulativeLineChart = ({ data }) => {
    const ref = useRef();
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    useEffect(() => {
        if(data && data.length > 0) {
            drawChart();
        }
    }, [data]);

    const drawChart = () => {
        const svg = d3.select(ref.current)
            .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Clear SVG to prevent duplicate charts
        svg.selectAll("*").remove();

        // X axis
        const x = d3.scaleLinear()
            .domain(d3.extent(data, d => d.year))
            .range([0, width]);
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).tickFormat(d3.format("d")));

        // Y axis
        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => Math.max(d.cumulativeCount, (2 * (d.year - data[0].year) + 5)))]) // Adjust domain to account for new line's values
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // Add the original line
        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(d => x(d.year))
                .y(d => y(d.cumulativeCount))
            );
        // Generate data for the new line
        const newData = data.map(d => ({ year: d.year, value: 1 * (d.year - data[0].year) + 2 }));

        // Add the new line
        svg.append("path")
            .datum(newData)
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(d => x(d.year))
                .y(d => y(d.value))
            );
        const legends = svg.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .selectAll("g")
            .data([
                { color: "steelblue", text: "Master's Article" },
                { color: "red", text: "Optimum Artcile" }
            ])
            .enter().append("g")
            .attr("transform", (d, i) => `translate(0,${i * 20})`);
        legends.append("rect")
            .attr("x", 5)
            .attr("y", 5)
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", d => d.color);
    
        legends.append("text")
            .attr("x", 15)
            .attr("y", 9)
            .text(d => d.text);
    };

    return (
      <>
        <svg ref={ref}></svg>
      </>
    );
};

export default CumulativeLineChart;
