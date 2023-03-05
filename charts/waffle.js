function waffle() {

  var total = 0;
  var
    widthSquares = 16,
    heightSquares = 9,
    squareValue = 0,
    gap = 0.5;

  var color = d3.scale.category10();

  d3.select("#waffle").append("div").attr("id", "legends");

  d3.select("#waffle").append("div").attr("id", "histogram_chart");

  const currentCountry = localStorage.getItem("CurrentCounty");

  d3.csv("../../data/wafflechart_pie_bubble.csv", function (error, data) {

    let data_deepcopy = JSON.parse(JSON.stringify(data));

    let country = data_deepcopy.find(country => country.Country === currentCountry);

    var theData = [];
    let clean_data = country

    let key_title = 'Country'
    let value_title = clean_data[key_title]
    // delete clean_data['Total']
    delete clean_data[key_title]

    let key_data = Object.keys(clean_data)
    let value_data = Object.values(clean_data)


    // console.log(value_data_cleaned)

    var chart_data = []

    for (let i = 0; i < key_data.length; i++) {

      chart_data.push({
        [key_title]: key_data[i],
        [value_title]: parseFloat(value_data[i])
      });
    }

    total = d3.sum(chart_data, function (d) { return d[value_title]; });
    //value of a square  
    //remap data
    squareSize = 25
    squareValue = total / 1000;
    chart_data.forEach(function (d, i) {
      // console.log(i)
      d[value_title] = +d[value_title];
      d.units = Math.round(d[value_title] / squareValue);

      theData = theData.concat(
        Array(d.units + 1).join(1).split('').map(function () {
          return {
            squareValue: squareValue,
            units: d.units,
            [value_title]: d[value_title],
            groupIndex: i
          };
        })
      );
    });

    // console.log(theData)

    width = (squareSize * widthSquares) + widthSquares * gap + 25;
    height = (squareSize * heightSquares) + heightSquares * gap + 25;

    var svg = d3.select("#histogram_chart").append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("margin-right", "5px");

    svg
      .append("g").attr("class", value_title)
      .selectAll("div")
      .data(theData)
      .enter()
      .append("rect")
      .attr("width", squareSize)
      .attr("height", squareSize)
      .attr("fill", function (d) {
        return color(d.groupIndex);
      })
      .attr("x", function (d, i) {
        //group n squares for column
        col = Math.floor(i / heightSquares);
        return (col * squareSize) + (col * gap);
      })
      .attr("y", function (d, i) {
        row = i % heightSquares;
        return (heightSquares * squareSize) - ((row * squareSize) + (row * gap))
      })
      .append("title")
      .text(function (d, i) {
        return chart_data[d.groupIndex][key_title] + " | " + d[value_title]
      });

    let label = value_title.split(' ')

    var title = d3.select("." + label[0]).insert("text")
      .attr('y', '18')
      .attr('font-size', '18px')
      .text(value_title)
      .attr("fill", "#444444");


    //add legend with categorical data
    var legend = d3.select("#legends")
      .append("svg")
      .append('g')
      .selectAll("div")
      .data(chart_data)
      .enter()
      .append("g")
      .attr('transform', function (d, i) { return "translate(0," + i * 20 + ")"; });
    legend.append("rect")
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", function (d, i) { return color(i) });
    legend.append("text")
      .attr("x", 25)
      .attr("y", 13)
      .text(function (d, i) {
        return d['Country']
      });

  });

}

waffle();