// Step 1: Parse the CSV data

var margin = {top: 20, right: 50, bottom: 30, left: 90},
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
d3.csv("../../data/stacked.csv").then(function (data) {
    // Step 2: Stack the data
    var stack = d3.stack()
        .keys(data.columns.slice(1))
        .order(d3.stackOrderDescending)
        .offset(d3.stackOffsetNone);

    var stackedData = stack(data);

    // Define color scale
    var color = d3.scaleOrdinal()
        .domain(data.columns.slice(1))
        .range(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf", "#ff5733", "#a8f7f3", "#9b59b6"]);

    var xScale = d3.scaleLinear()
        .domain([0, d3.max(stackedData, function (d) { return d3.max(d, function (d) { return d[1]; }); })])
        .range([0, 600]);

    var yScale = d3.scaleBand()
        .domain(data.map(function (d) { return d.Country; }))
        .range([0, 800])
        .padding(0.1);

    // Create the SVG element
    var svg = d3.select("#stack")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    // Step 5: Create the groups for the bars
    var groups = svg.selectAll("g")
        .data(stackedData)
        .enter()
        .append("g")
        .style("fill", function (d) { return color(d.key); });
        var yAxis = svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScale));

    // Add the rectangles using the data from the stacked dataset
    groups.selectAll("rect")
        .data(function (d) { return d; })
        .enter()
        .append("rect")
        .attr("x", function (d) { return xScale(d[0]); })
        .attr("y", function (d) { return yScale(d.data.Country); })
        .attr("width", function (d) { return xScale(d[1]) - xScale(d[0]); })
        .attr("height", yScale.bandwidth())
        .on("mouseover", function (i, d) {
            vacc = d3.select(this.parentNode).datum().key
            
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html("Country: " + d.data.Country + "<br>" +
                "Vaccine: " + vacc + "<br>" +
                "Total Vaccinated: " + (d.data[vacc]))
                .style("left", (i.pageX + 10) + "px")
                .style("top", (i.pageY - 28) + "px")
                .style("visibility", "visible");
            d3.select(this)
                .style("opacity", 0.5);
        })
        .on("mouseout", function (d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
            d3.select(this)
                .style("opacity", 1);

        });
    var legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(" + (600 - 150) + ", 25)")
        .selectAll("g")
        .data(data.columns.slice(1).reverse())
        .enter()
        .append("g")
        .attr("transform", function (d, i) { return "translate(250," + ((i * 20) - 25) + ")"; });

    legend.append("rect")
        .attr("x", 0)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", -5)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function (d) { return d; });


    var tooltip = d3.select("#stack")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("opacity", 0);
});    