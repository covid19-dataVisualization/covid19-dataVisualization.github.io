function drawChart_a1_v1() {
    let div_id = "#a1_v1";

    // Definition of the div target dimentions
    let ratio = 2.5; // 3 width = 1 height
    let win_width = d3.select(div_id).node().getBoundingClientRect().width;
    let win_height = win_width / ratio;

    // set the dimensions and margins of the graph
    let margin = {top: 30, right: 30, bottom: 140, left: 70};
    let width = win_width - margin.right - margin.left;
    let height = win_height - margin.top - margin.bottom;



	let svg = d3.select(div_id)
		.append("svg")
		.attr("viewBox", "0 0 " + win_width + " " + win_height);

    let xScale = d3.scaleBand().range([0, width]).padding(0.4),
        yScale = d3.scaleLinear().range([height, 0]);

    let g = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
			
			d3.csv("bar.csv", function(data) {
				data.forEach(function(d) {
					d.TotalCases = +d.TotalCases;
				});
			
				// Sort data in descending order based on TotalCases
				data.sort(function(a, b) {
					return b.TotalCases - a.TotalCases;
				});
			
				// Extract the top 20 countries by TotalCases
				let top20 = data.slice(0, 20);
			
				// Calculate the sum of TotalCases for the other countries
				let other = data.slice(20, data.length);
				let sum = d3.sum(other, function(d){ return d.TotalCases});
			
				// Use top20 to create the chart
				xScale.domain(top20.map(function(d) { return d.Name; }));
				yScale.domain([0, d3.max(top20, function(d) { return d.TotalCases; })]);
			
				g.append("g")
					.attr("transform", "translate(0," + height + ")")
					.call(d3.axisBottom(xScale))
					.selectAll("text")
					.style("text-anchor", "end")
					.attr("dx", "-.8em")
					.attr("dy", "-.6em")
					.attr("transform", "rotate(-65)" );
			
				g.append("g")
					.append("text")
					.style("text-anchor", "end")
					.attr("x", width)
					.attr("y", height+50)
					.attr('text-anchor', 'end')
					.attr('stroke', 'black')
					.text("Name")
			
				g.append("g")
					.call(d3.axisLeft(yScale).tickFormat(function(d){return d;}))
					.append("text")
					.attr("transform", "rotate(-90)")
					.attr("y", 10)
					.attr('dy', '-5em')
					.attr('text-anchor', 'end')
					.attr('stroke', 'black')
					.text('Count')
			
				g.selectAll(".bar")
					.data(top20)
					.enter().append("rect")
					.attr("class", "bar")
					.on("mouseover", onMouseOver) // Add listener for event
					.on("mouseout", onMouseOut)
					.attr("x", function(d) { return xScale(d.Name); })
					.attr("y", function(d) { return yScale(d.TotalCases); })
					.attr("width", xScale.bandwidth())
					.transition()
					.ease(d3.easeLinear)
					.duration(500)
					.delay(function(d,i){ return i * 50})
					.attr("height", function(d) { return height - yScale(d.TotalCases); });
			
				d3.select('#other')
					.html(`
						 <h2>Others</h2>
						 <div> Count: ${sum}</div>
					 `);
			});
			
       
	// Mouseover event handler

	function onMouseOver(d, i) {
		// Get bar's xy values, ,then augment for the tooltip
		let xPos = d3.event.pageX + 10;
		let yPos = d3.event.pageY - 10;

		// Update Tooltip's position and value
		d3.select('#tooltip')
			.style('left', xPos + 'px')
			.style('top', yPos + 'px')
			.html(`
				<h2>${d.Name}</h2>
				<div> TotalCases: ${d.TotalCases}</div>
			`);
		
		d3.select('#tooltip').classed('hidden', false);

		d3.select(this).attr('class','highlight')
		d3.select(this)
			.transition() // I want to add animnation here
			.duration(500)
			.attr('width', xScale.bandwidth() + 5)
			.attr('y', function(d){return yScale(d.TotalCases) - 10;})
			.attr('height', function(d){return height - yScale(d.TotalCases) + 10;})

	}

	// Mouseout event handler
	function onMouseOut(d, i){
		d3.select(this).attr('class','bar')
		d3.select(this)
			.transition()
			.duration(500)
			.attr('width', xScale.bandwidth())
			.attr('y', function(d){return yScale(d.TotalCases);})
			.attr('height', function(d) {return height - yScale(d.TotalCases)})
		
		d3.select('#tooltip').classed('hidden', true);
	}
}

drawChart_a1_v1()
