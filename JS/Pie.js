
// Set the dimensions and margins of the graph
const margin = { top: 30, right: 30, bottom: 50, left: 70 };
const width = 600 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// Append the svg object to the body of the page
const svg = d3.select("#chart")
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
    return d.Total_Cases !== null && +d.Total_Cases > 1000000 ;
  });

  // Print the filtered data to the console
  const randomData = d3.shuffle(filteredData).slice(0,10);
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
   .attr("stroke", "white")
   .style("stroke-width", "2px")
// Add a title
svg.append("text")
.attr("x", (width / 2))
.attr("y", 0 - (margin.top / 2))
.attr("text-anchor", "middle")
.style("font-size", "14px")
.text("Comparing COVID-19 Total cases among 10 random countries with cases more than 1 million");

// Create the legend
var legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(" + (width - 80 ) + "," + 0 + ")");

// Add the legend rectangles
var legendRects = legend.selectAll("rect")
    .data(data_ready)
    .enter()
    .append("rect")
    .attr("y", function(d, i) { return i * 20; })
    .attr("width", 10)
    .attr("height", 10)
    .attr("fill", function(d) { return color(d.data.Country); });

// Add the legend labels
var legendLabels = legend.selectAll("text")
    .data(data_ready)
    .enter()
    .append("text")
    .attr("x", 15)
    .attr("y", function(d, i) { return i * 20 + 10; })
    .text(function(d) { return d.data.Country; });

});
