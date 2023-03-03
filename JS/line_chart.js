d3.csv("data_linechart.csv").then(function(data) {
    // Filter data for Afghanistan
    data = data.filter(function(d) {
      return d.Country === "Iran";
    });
  
    // Convert string date to date object
    data.forEach(function(d) {
        d.Date = d3.timeParse("%m/%d/%Y")(d.Date);
        d.Number_of_Deaths = +d.Number_of_Deaths;
    });
    data.sort(function(a, b) {
        return a.Date - b.Date;
      });
  
    // Set the dimensions of the canvas / graph
    var margin = {top: 30, right: 20, bottom: 30, left: 50},
        width = 900 - margin.left - margin.right,
        height = 270 - margin.top - margin.bottom;
  
    // Add the SVG element
    var svg = d3.select("#chart")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");
  
    // Set the ranges
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);
  
    // Define the line
    var valueline = d3.line()
        .x(function(d) { return x(d.Date); })
        .y(function(d) { return y(d.Number_of_Deaths); });
  
    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.Date; }));
    y.domain([0, d3.max(data, function(d) { return d.Number_of_Deaths; })]);
    
     // Add the valueline path
     
      // Add the dots
      svg.selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
          .attr("cx", function(d) { return x(d.Date); })
          .attr("cy", function(d) { return y(d.Number_of_Deaths); })
          .attr("r", 1)
          .attr("fill", "steelblue");
          var line = svg.append("path")
          .datum(data)
          .attr("fill", "none")
          .attr("stroke", "steelblue")
          .attr("stroke-width", 1.5)
          .attr("d", d3.line()
            .x(function(d) { return x(d.Date); })
            .y(function(d) { return y(d.Number_of_Deaths); })
          );
    // Add the X Axis
    var x = d3.scaleTime()
    .domain(d3.extent(data, function(d) { return d.Date; }))
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return +d.Number_of_Deaths; })])
    .range([ height, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y));
  
    // Add the title
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Number of Deaths in Iran");
  
  });
  