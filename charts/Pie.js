// Append the svg object to the body of the page
const margin = { top: 50, right: 50, bottom: 10, left: 60 };
const width = 500 - margin.left - margin.right;
const height = 300 - margin.top - margin.bottom;

const svg_pie = d3.select("#pie")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");
// Parse the data

d3.csv("../../data/wafflechart_pie_bubble.csv").then(function(data) {
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

  var g = svg_pie.append("g")
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
svg_pie.append("text")
.attr("x", (width / 2))
.attr("y", 0 - (margin.top / 2))
.attr("text-anchor", "middle")
.style("font-size", "14px")
.text("Total cases among 10 random countries with cases more than 1 million");

// Create the legend
var legend = svg_pie.append("g")
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