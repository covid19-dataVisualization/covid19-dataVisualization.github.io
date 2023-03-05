
d3.csv("../../data/data_radarchart_stackedbarchart.csv", function (data) {

    const filteredData = data.filter(d => d.Country === "Argentina");

    const nameValues = filteredData.map(function (d) {
        return d["Manufacturer"];
    });

   filteredData.forEach(function (d) {
        d.Total = parseInt(d.Total);
        delete d.Country;
    });

    let legendOptions = nameValues;

    let radarChartConfig = {
        w: 500,
        h: 500,
        levels: 5
    };

    let colorscale = d3.scale.category10();


    RadarChart.draw('.chart-container', [filteredData], radarChartConfig);

    let graph = d3.select('body')
        .selectAll('svg')
        .attr('width', radarChartConfig.w + 320);

    let legendContainer = d3.select('body')
        .selectAll('svg')
        .append('g')
        .attr('width', 200)
        .attr('height', radarChartConfig.h)
        .attr('transform', 'translate(570,30)')

    //Create the title for the legend
    let text = legendContainer.append('text')
        .attr('class', 'title')
        .attr('font-size', '18px')
        .attr('fill', '#404040')
        .text('Luminis Whisky tasting 2016');

    let legend = legendContainer.append('g')
        .attr('transform', 'translate(0,20)');

    //Create colour squares
    legend.selectAll('rect')
        .data(legendOptions)
        .enter()
        .append('rect')
        .attr('x', 0)
        .attr('y', function (d, i) {
            return i * 20;
        })
        .attr('width', 10)
        .attr('height', 10)
        .style('fill', function (d, i) {
            return colorscale(i);
        });
    //Create text next to squares
    legend.selectAll('text')
        .data(legendOptions)
        .enter()
        .append('text')
        .attr('x', 30)
        .attr('y', function (d, i) {
            return i * 20 + 9;
        })
        .attr('font-size', '14px')
        .attr('fill', '#737373')
        .text(function (d) {
            return d;
        });
});