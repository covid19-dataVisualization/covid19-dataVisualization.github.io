// 1. Load the data from the CSV file
d3.csv("../../data/stacked.csv", function (data) {

    // 2. Define the dimensions and margins
    var margin = { top: 20, right: 60, bottom: 30, left: 100 },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // 3. Create scales for the x and y axes
    var y = d3.scaleBand()
        .rangeRound([height, 0])
        .padding(0.1)
        .domain(data.map(function (d) { return d.Country; }));

    var x = d3.scaleLinear()
        .rangeRound([0, width])
        .domain([0, d3.max(data, function (d) {
            var values = Object.keys(d).map(function (key) {
                return key !== "Country" ? +d[key] : 0;
            });
            return d3.sum(values);
        })]);

    // var x = d3.scaleLinear()
    //     .rangeRound([0, width])
    //     .domain([0, d3.max(data, function (d) { return +d.Total; })]);

    var colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf', '#9edae5', '#ff9896', '#dbdb8d'];
    var ke_val = ["CanSino", "Moderna", "AstraZeneca", "Pfizer", "Sinopharm", "Sputnik", "Johnson", "Novavax", "Valneva", "Medicago", "Sinovac", "Covaxin", "Sanofi"]
    // Create an ordinal scale using your array of colors
    var colorScale = d3.scaleOrdinal()
        .range(colors)
        .domain(ke_val);

    // 5. Create a stack generator and use it to generate a stacked dataset
    var stack = d3.stack()
        .keys(ke_val)
        .order(d3.stackOrderDescending);
    var stackedData = stack(data);

    // 6. Create a group element for each stack and a group element for the y-axis
    var svg = d3.select("#stack").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var stacks = svg.selectAll(".stack")
        .data(stackedData)
        .enter().append("g")
        .attr("class", "stack")
        .style("fill", function (d, i) { return colorScale(d); });

    var yAxis = svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y));

    
        var tooltip = d3.select("#stack")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("opacity", 0);

    var rects = stacks.selectAll("rect")
        .data(function (d) { return d; })
        .enter().append("rect")
        .attr("y", function (d) { return y(d.data.Country); })
        .attr("x", function (d) { return x(d[0]); })
        .attr("width", function (d) { return x(d[1]) - x(d[0]); })
        .attr("height", y.bandwidth() * 1.5)
        .attr("fill", function (d, i) { return colorScale(d); })
        // Add tooltip functionality using d3-tip library
        .on("mouseover", function (d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html("Country: " + d.data.Country + "<br>" +
                "Vaccine: " + d3.select(this.parentNode).datum().key + "<br>" +
                "Total Vaccinated: " + (d[1] + d[0]))
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY - 28) + "px")
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
    // Add a legend
    var legend = svg.selectAll(".legend")
        .data(data.columns.slice(1).reverse())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) { return "translate(" + (width + margin.right - 100) + "," + (20 + i * 20) + ")"; }); // move legend to right side of chart

    legend.append("rect")
        .attr("x", 0)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function (d) { return colorScale(d) });

    legend.append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(function (d) { return d; });


});