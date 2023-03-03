const drawChart = async () => {
  const width = 1000;
  const height = 500;
  const margin = { top: 10, right: 100, bottom: 100, left: 100 };
  
  const geojson = await d3.json("data/geojson.json");
  const coviddata = await d3.json("data/coviddata.json");
  const colorScale = d3.scaleLinear()
  .domain(d3.extent(coviddata, d => d.total_cases / 30))
  .range(["#f0eee5", "#c70a04"]);

  const map = d3
    .select("#map")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("background-color","aqua")

  const projection = d3
    .geoNaturalEarth1()
    .scale(width / 1.2 / Math.PI)
    .translate([width / 2, height / 1.5]);

  const path = d3.geoPath().projection(projection);

  map
    .selectAll("path")
    .data(geojson.features)
    .enter()
    .append("path")
    .attr("d", path)
    //.attr("fill", "#050505")
    .attr("fill", d => colorScale(coviddata.find(b => b.Entity === d.properties.name)?.total_cases || 0))
    .style("cursor", "pointer")
    .style("stroke","#aaa")
    .style("background-color","#fff")
    
    .on("click", (a, b) => {
      let currentCountry = b.properties.name;
      localStorage.setItem("CurrentCounty", currentCountry);
      console.log(currentCountry);
      window.location = "./page_four.html";
    })
    .on("mousemove", function (e, d) {
      d3.select(this).transition().duration(100).attr("fill", "#afedc0");

      let country = d.properties.name;
      let data = coviddata.find(function (d) {
        return d.Entity == country;
      });
      if (data) {
        let tooltip = d3
          .select(".tooltip")
          .transition()
          .duration(100)
          .style("opacity", 1)
          .style("display", "block");
          const formattedTotaldeaths = data.total_deaths.toLocaleString();
          const formattedTotalCases = data.total_cases.toLocaleString();
          d3.select(".tooltip")
            .html(
              `<div>Country: ${data.Entity}</div>
               <div>Total Cases: ${formattedTotalCases}</div>
               <div>Total Deaths: ${formattedTotaldeaths}</div>`
            )
          .style("left", e.pageX + 20 + "px")
          .style("top", e.pageY + "px");
      }
    })
    .on("mouseout", function (e, d) {
      d3.select(this).transition().duration(100).attr("fill", d => colorScale(coviddata.find(b => b.Entity === d.properties.name)?.total_cases || 0))
      d3.select(".tooltip").style("display", "none");
    });
    
};

drawChart();
