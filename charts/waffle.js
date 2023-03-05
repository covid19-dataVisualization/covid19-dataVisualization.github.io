function createWaffleChart(data) {
  // set the dimensions of the chart
  var width = 500;
  var height = 500;
  
  // set the number of columns and rows for the chart
  var cols = 20;
  var rows = 20;
  
  // calculate the total number of squares needed for the chart
  var totalSquares = cols * rows;
  
  // create an array to hold the data for each square
  var squaresData = [];
  
  // calculate the number of squares for each data point
  var casesSquares = Math.round((data.Total_Cases / data.Total_Vaccinations) * totalSquares);
  var deathsSquares = Math.round((data.Total_Deaths / data.Total_Vaccinations) * totalSquares);
  var vaccSquares = totalSquares - casesSquares - deathsSquares;
  
  // add the data for each type of square to the squaresData array
  for (var i = 0; i < casesSquares; i++) {
    squaresData.push({ type: 'cases' });
  }
  
  for (var i = 0; i < deathsSquares; i++) {
    squaresData.push({ type: 'deaths' });
  }
  
  for (var i = 0; i < vaccSquares; i++) {
    squaresData.push({ type: 'vacc' });
  }
  
  // create the svg element for the chart
  var svg = d3.select('#waffle')
    .append('svg')
    .attr('width', width)
    .attr('height', height);
  
  // calculate the size of each square
  var squareSize = Math.min(width/cols, height/rows);
  
  // create a group for each square and add it to the svg element
  var squares = svg.selectAll('.square')
    .data(squaresData)
    .enter()
    .append('g')
    .attr('class', 'square')
    .attr('transform', function(d, i) {
      var col = i % cols;
      var row = Math.floor(i / cols);
      var x = col * squareSize;
      var y = row * squareSize;
      return 'translate(' + x + ',' + y + ')';
    });
  
  // add a rectangle to each square group
  squares.append('rect')
    .attr('width', squareSize)
    .attr('height', squareSize)
    .attr('class', function(d) {
      return 'square ' + d.type;
    });
  
  // add text labels to each square group
  squares.append('text')
    .attr('x', squareSize/2)
    .attr('y', squareSize/2)
    .attr('dy', '.35em')
    .attr('text-anchor', 'middle')
    .attr('class', 'label')
    .text(function(d) {
      if (d.type === 'cases') {
        return 'C';
      } else if (d.type === 'deaths') {
        return 'D';
      } else {
        return 'V';
      }
    });
}

var data = {
  Country: 'Afghanistan',
  Total_Cases: 209181,
  Total_Deaths: 7896,
  Total_Vaccinations: 13603457
};

createWaffleChart(data);
