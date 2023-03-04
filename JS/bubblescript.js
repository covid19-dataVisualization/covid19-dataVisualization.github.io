// Set the dimensions and margins of the graph
const margin = { top: 30, right: 30, bottom: 50, left: 80 };
const width = 1000 - margin.left - margin.right;
const height = 660 - margin.top - margin.bottom;

// Append the svg object to the body of the page
const svg = d3.select("#my_dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Parse the data

d3.csv("data_barchart_wafflechart_piechart.csv").then(function(data) {
  // Filter the data to select rows where Total_Vaccinations is not null
  const filteredData = data.filter(function(d) {
    return d.Total_Vaccinations > 15000000;
  });

  // Print the filtered data to the console
  const randomData = d3.shuffle(filteredData);
  randomData.sort(function(a, b) {
    return b.Total_Vaccinations - a.Total_Vaccinations;
  });
  // console.log(randomData);
  // Cast the string values to numbers
  randomData.forEach(function(d) {
    d.Total_Cases = +d.Total_Cases;
    d.Total_Cases_Per_Million = +d.Total_Cases_Per_Million;
    d.Total_Deaths = +d.Total_Deaths;
    d.Total_Deaths_Per_Million = +d.Total_Deaths_Per_Million;
    d.Total_Vaccinations = +d.Total_Vaccinations;
    d.Total_Vaccinations_Per_Million = +d.Total_Vaccinations_Per_Million;
  });

  // Add X axis
  const x = d3.scaleLinear()
  .domain([-d3.max(randomData, function(d) { return d.Total_Cases; })/12, d3.max(randomData, function(d) { return d.Total_Cases; })*1.3])
  .range([0, width]); 
    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-0.8em")
    .attr("dy", "0.15em")
    .attr("transform", "rotate(-20)");

  // Add Y axis
  const y = d3.scaleLinear()
  .domain([-d3.max(randomData, function(d) { return d.Total_Deaths; })/12, d3.max(randomData, function(d) { return d.Total_Deaths; })*1.3])
  .range([ height,10]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Add a scale for bubble size
  const z = d3.scaleSqrt()
    .domain([0, d3.max(randomData, function(d) { return d.Total_Vaccinations; })])
    .range([ 0, 65]);

  //Add color scale
  const colorScale = d3.scaleOrdinal()
    .domain(randomData.map(d => d.Country))
    .range(d3.schemeCategory10);

 // Add dots
 const dots = svg.append('g')
 .selectAll("dot")
 .data(randomData)
 .enter()
 .append("circle")
   .attr("cx", function (d) { return x(d.Total_Cases); } )
   .attr("cy", function (d) { return y(d.Total_Deaths); } )
   .attr("r", function (d) { return z(d.Total_Vaccinations); } )
   .style("fill", function(d) { return colorScale(d.Country); }) // Set the fill color based on the country
   .style("opacity", "0.8")
   .attr("stroke", "white")
   .style("stroke","black");
// Add a tooltip
const tooltip = d3.select("#my_dataviz")
  .append("div")
  .style("opacity", 0)
  .attr("class", "tooltip")
  .style("border", "solid")
  .style("border-width", "2px")
  .style("border-radius", "5px")
  .style("padding", "5px")
  .style("background-color","yellow");

// Show tooltip on mouseover
const mouseover = function(event, d) {
  tooltip
    .style("opacity", 0.8)
  d3.select(this)
    .style("r", function (d) { return z(d.Total_Vaccinations)*1.2; } )
    ;
};
// Hide tooltip on mouseout
const mouseout = function(event, d) {
  tooltip
    .style("opacity", 0)
  d3.select(this)
    .style("r", function (d) { return z(d.Total_Vaccinations); } )
    ;
};
// Move tooltip with mouse
const mousemove = function(event, d) {
  tooltip
    .html("Country : "+d.Country+ " __ Total cases : "
    +d.Total_Cases.toLocaleString()+" __ Total deaths : "
    +d.Total_Deaths.toLocaleString()+" __ Total vaccination : "
    +d.Total_Vaccinations.toLocaleString())
    .style("left", (event.pageX+10) + "px")
    .style("top", (event.pageY+10) + "px");
};

dots.on("mouseover", mouseover)
    .on("mouseout", mouseout)
    .on("mousemove", mousemove);
// Add X axis label
svg.append("text")
.attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + 20) + ")")
.style("text-anchor", "middle")
.text("Total Cases");

// Add Y axis label
svg.append("text")
.attr("transform", "rotate(-90)")
.attr("y", 0 - margin.left)
.attr("x",0 - (height / 2))
.attr("dy", "1em")
.style("text-anchor", "middle")
.text("Total Deaths");

// Add a title
svg.append("text")
.attr("x", (width / 2))
.attr("y", 0 - (margin.top / 2))
.attr("text-anchor", "middle")
.style("font-size", "20px")
.text("Bubble chart of countries with more than 15m total vaccinations")
.font("Arial")
.style("fill", "red");

});
