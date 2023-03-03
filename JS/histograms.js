// Set the default country and data type
var currentCountry = "Italy";
var currentDataType = "people_vaccinated_per_hundred";

// Load the data and create the initial histogram
d3.csv("new_vaccinated_data_by_age_countries.csv").then(function(data) {
  createHistogram(data, currentCountry, currentDataType);
});

// Handle changes to the dropdown
d3.select("#select-data").on("change", function() {
  // Update the current data type
  currentDataType = this.value;
  
  // Reload the data and recreate the histogram
  d3.csv("new_vaccinated_data_by_age_countries.csv").then(function(data) {
    createHistogram(data, currentCountry, currentDataType);
  });
});

// Handle changes to the country selection
d3.select("#select-country").on("change", function() {
  // Update the current country
  currentCountry = this.value;
  
  // Reload the data and recreate the histogram
  d3.csv("new_vaccinated_data_by_age_countries.csv").then(function(data) {
    createHistogram(data, currentCountry, currentDataType);
  });
});

// Create a histogram with the given data, country, and data type
function createHistogram(data, country, dataType) {
  // Convert data object to array
  var dataArray = Object.values(data);

  // Filter the data by country
  var filteredData = dataArray.filter(function(d) {
    return d.location === country;
  });

  // Create histogram
  var margin = {top: 10, right: 30, bottom: 50, left: 80},
      width = 460 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;


  var svg = d3.select("#chart")
    .html("") // Clear the previous chart
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  // Create x axis
  var x = d3.scaleBand()
      .range([ 0, width ])
      .domain(filteredData.map(function(d) { return d.age_group; }))
      .padding(0.2);
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Create y axis
  var y = d3.scaleLinear()
      .domain([0, d3.max(filteredData, function(d) { return +d[dataType]; })])
      .range([ height, 0]);
  svg.append("g")
      .call(d3.axisLeft(y));

  // Create bars
  svg.selectAll("mybar")
      .data(filteredData)
      .enter()
      .append("rect")
        .attr("x", function(d) { return x(d.age_group); })
        .attr("y", function(d) { return y(d[dataType]); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d[dataType]); })
        .attr("fill", "#69b3a2");
        
      
  // Add x-axis label
  svg.append("text")
      .attr("class", "x label")
      .attr("text-anchor", "middle")
      .attr("x", width/2)
      .attr("y", height + margin.bottom - 10) // Adjusted y position
      .text("Age Group");
      
  // Add y-axis label
  svg.append("text")
      .attr("class", "y label")
      .attr("text-anchor", "end")
      .attr("y", -margin.left + 10)
      .attr("x", -margin.top - height/2 + margin.bottom)
      .attr("dy", ".75em")
      .attr("transform", "rotate(-90)")
      .text(function() {
        if (dataType === "people_vaccinated_per_hundred") {
          return "People Vaccinated per Hundred";
        } else if (dataType === "people_fully_vaccinated_per_hundred") {
          return "People Fully Vaccinated per Hundred";
        } else if (dataType === "people_with_booster_per_hundred") {
          return "People with Booster per Hundred";
        }
      });
}
