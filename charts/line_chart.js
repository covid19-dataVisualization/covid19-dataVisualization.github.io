d3.csv("data_linechart.csv").then(function(data) {
  // Filter data for current country
  var current_country = "Iran"
  data = data.filter(function(d) {
    return d.Country === current_country;
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
  var margin = {top: 30, right: 20, bottom: 50, left: 70},
      width = 900 - margin.left - margin.right,
      height = 270 - margin.top - margin.bottom;

  // Add the SVG element
  var svg = d3.select("#chart")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .style("background-color", '#ccc')
      .style("border","black")
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

      // Add the dots
      svg.selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
          .attr("cx", function(d) { return x(d.Date); })
          .attr("cy", function(d) { return y(d.Number_of_Deaths); })
          .attr("r", 1)
          .attr("fill", "red");
          var line = svg.append("path")
          .datum(data)
          .attr("fill", "none")
          .attr("stroke", "red")
          .attr("stroke-width", 1.5)
          .attr("d", d3.line()
            .x(function(d) { return x(d.Date); })
            .y(function(d) { return y(d.Number_of_Deaths); })
          );
  // Add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .append("text")
      .attr("fill", "#000")
      .attr("x", width / 2)
      .attr("y", 25)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Date")
      .style("font-size","15px");

  // Add Y axis
  svg.append("g")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left+20)
      .attr("x", -height/5)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Number of Daily Deaths")
      .style("font-size","15px");

  // Add the title
  svg.append("text")
      .attr("x", (width / 2))
      .attr("y", 0 - (margin.top / 2))
      .attr("font-size", "16px")
      .attr("text-anchor", "middle")
      .text("Daily Deaths in " + current_country);
      });
