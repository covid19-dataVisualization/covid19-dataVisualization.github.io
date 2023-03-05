
// Set the dimensions and margins of the graph
const margin = { top: 30, right: 70, bottom: -20, left:20 };
var width = 370 ;
var height = 370 ;

// Append the svg object to the body of the page
const svg = d3.select("#pie")
  .append("svg")
  .attr("width",700)
  .attr("height",500)
  .style("background-color","ccc")
  .append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Parse the data

d3.csv("../../data/data_barchart_wafflechart_piechart.csv").then(function(data) {
  // Filter the data to select rows where Total_Vaccinations is not null
  const filteredData = data.filter(function(d) {
    return d.Total_Cases !== null && +d.Total_Cases > 21000000 ;
  });

  // Print the filtered data to the console
  const randomData = d3.shuffle(filteredData);
  randomData.sort(function(a, b) {
    return b.Total_Cases - a.Total_Cases;
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

  // Create the pie chart
  var radius = Math.min(width, height) / 2.5;
  var pie = d3.pie()
              .sort(null)
              .value(function(d) { return d.Total_Cases; });
  var arc = d3.arc()
              .outerRadius(radius - 10)
              .innerRadius(0);
  var labelArc = d3.arc()
              .outerRadius(radius - 40)
              .innerRadius(radius - 40);
  var color = d3.scaleOrdinal(d3.schemeCategory10);

  var g = svg.append("g")
              .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var data_ready = pie(randomData);
  
  g.selectAll("path")
   .data(data_ready)
   .enter().append("path")
   .attr("d", arc)
   .attr("fill", function(d) { return color(d.data.Country); })
   .attr("stroke", "black")
   .style("stroke-width", "2px")
// Add a title
svg.append("text")
.attr("x", (width / 2))
.attr("y", 0 - (margin.top / 2))
.attr("text-anchor", "middle")
.style("font-size", "14px")
.style("font-weight","bold")
.text("Comparing Total cases among Top 10 countries");

// Create the legend
var legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(" + (width - 35 ) + "," + 0 + ")");

// Add the legend rectangles
var legendRects = legend.selectAll("rect")
    .data(data_ready)
    .enter()
    .append("rect")
    .attr("y", function(d, i) { return i * 20; })
    .attr("width", 10)
    .attr("height", 10)
    .attr("fill", function(d) { return color(d.data.Country); })
    ;

// Add the legend labels
var legendLabels = legend.selectAll("text")
    .data(data_ready)
    .enter()
    .append("text")
    .style("font-size","10px")
    .style("font-weight","bold")
    .attr("x", 20)
    .attr("y", function(d, i) { return i * 20 + 10; })
    .text(function(d) { return d.data.Country; });

});
