const pages = [
    ["Visualizing Affected Cases and Deaths", "../../index.html"],
    ["Visualizing Number of Vaccinated People", "template/vaccination.html"],

]

d3.select("#navigation")
  .style("position", "fixed")
  .style("x", 0)
  .style("width", "100%")
  .style("display", "flex")
  .style("flex-wrap", "wrap")
  .style("flex-direction", "row")
  .style("justify-content", "center")
  .selectAll(".button-wrapper") // create a wrapper div for each button
  .data(pages)
  .enter()
  .append("a")
  .attr("href", (d) => d[1])
  .append("div") // wrapper div for the button
  .attr("class", "button-wrapper")
  .append("input")
  .attr("type", "button")
  .style("background-color", "orange")
  .attr("value", (d) => d[0])
  .attr("class", "button1")
  .style("padding-right", "12px")
  .style("padding-left", "12px")
  .style("border", "solid")
  .style("border-top", "none")
  .style("font-size", "1em") // set font size in em units
  .style("font-weight", "bold") // make text bold
  .on("mouseover", function() { // add mouseover event listener
    d3.select(this.parentNode)
    .transition()
      .duration(300) // set duration to 200ms
      .style("transform", "scaleY(1.5)") // scale down to 90%
      .style("transform-origin", "top center"); // set transform origin to bottom center
  })
  .on("mouseout", function() { // add mouseout event listener
    d3.select(this.parentNode)
    .transition()
      .duration(300) // set duration to 200ms
      .style("transform", "scaleY(1)") // reset to original size
      .style("transform-origin", "top center"); // reset transform origin
  });

