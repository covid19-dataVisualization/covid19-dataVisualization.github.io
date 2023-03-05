const drawChart = async () => {
  const width = 900;
  const height = 500;
  const margin = { top: 100, right: 100, bottom: 10, left: 100 };

  const geojson = await d3.json("../../data/geojson.json");
  const coviddata = await d3.json("../../data/coviddata.json");
  const countrytocontinent = await d3.json("../../data/countrytocontinent.json");
  const colorScale = d3.scaleLinear()
    .domain(d3.extent(coviddata, d => d.total_cases / 30))
    .range(["#f0eee5", "#c70a04"]);

  const map = d3
    .select("#map")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("background-color", "lightblue")

  const projection = d3
    .geoNaturalEarth1()
    .scale(width / 1.2 / Math.PI)
    .translate([width / 2, height / 1.5]);

  const path = d3.geoPath().projection(projection);
  let filterValue = []

  let dataremoved = ["World", "High income", "Upper middle income", "Europe", "Asia", "Lower middle income", "Africa", "North America", "South America", "Oceania", "European Union"]


  const continentSelect = d3.select("#continent-select");
  continentSelect.on("change", () => {
    const selectedContinent = continentSelect.property("value");
    map.selectAll("path")
      .attr("opacity", d => selectedContinent === "all" || countrytocontinent[d.properties.name] === selectedContinent ? 1 : 0.2);
  });

  d3.select("#country-filter").on("input", () => {
    let filterValue = d3.select("#country-filter").property("value").toLowerCase().split(",");
    map.selectAll("path")
      .attr("opacity", d => filterValue.some(country => d.properties.name.toLowerCase().includes(country.trim())) ? 1 : 0.2);
  });

  continentSelect.selectAll("option")
    .data(["all", "Asia", "Europe", "Africa", "North America", "South America", "Oceania"])
    .enter()
    .append("option")
    .attr("value", d => d)
    .text(d => d);


  const deathFilter = d3.select("#death-filter");
  deathFilter.selectAll("option")
    .data(["all", "top10death", "least10death"])
    .enter()
    .append("option")
    .attr("value", d => d)
    .text(d => d);

  const filteredList = coviddata.filter(obj => {
    // Check if any key matches the value
    return !Object.keys(obj).some(key => key === "Entity" && dataremoved.includes(obj[key]));
  });

  // filteredData = filteredList.sort((a, b) => b.total_deaths - a.total_deaths).slice(0, 10);
  // filteredData = filteredList.sort((a, b) => b.total_cases - a.total_cases).slice(0, 10);

  deathFilter.on("change", () => {
    const selectedOption = deathFilter.property("value");
    if (selectedOption === "top10death") {
      filteredData = filteredList.sort((a, b) => b.total_deaths - a.total_deaths).slice(0, 10);
      map.selectAll("path")
        // .data(geojson.features)
        // .attr("opacity", d => filteredData.find(country => d.properties.name.toLowerCase().includes(country.trim())) ? 1 : 0.2);
        .attr("opacity", d => filteredData.find(b => b.Entity === d.properties.name) ? 1 : 0.2);
    }

    else if (selectedOption === "top10cases") {
      filteredData = filteredList.sort((a, b) => b.total_cases - a.total_cases).slice(0, 10);
      map.selectAll("path")
        // .data(geojson.features)
        // .attr("opacity", d => filteredData.find(country => d.properties.name.toLowerCase().includes(country.trim())) ? 1 : 0.2);
        .attr("opacity", d => filteredData.find(b => b.Entity === d.properties.name) ? 1 : 0.2);
    }
    else {
      map.selectAll("path")
        .attr("opacity", d => selectedOption === "all");
    }
  });




  map
    .selectAll("path")
    .data(geojson.features)
    .enter()
    .append("path")
    .attr("d", path)
    //.attr("fill", "#050505")
    .attr("fill", d => colorScale(coviddata.find(b => b.Entity === d.properties.name)?.total_cases || 0))
    .style("cursor", "pointer")
    .style("stroke", "#aaa")
    .style("background-color", "#fff")

    .on("click", (a, b) => {
      let currentCountry = b.properties.name;
      localStorage.setItem("CurrentCounty", currentCountry);
      // window.location = "./page_four.html";
      window.open('template/cases_details.html', '_blank');
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
   //  .on("mouseout", function (e, d) {
     //  d3.select(this).transition().duration(100).attr("fill", d => colorScale(coviddata.find(b => b.Entity === d.properties.name)?.total_cases || 0))
      // d3.select(".tooltip").style("display", "none");
    // })

    .on("mouseout", function (e, d) {
      const filteredData = coviddata.filter(item => filterValue.some(country => item.Entity.toLowerCase().includes(country.trim())));
      const color = filteredData.length === 0 ? "#f0eee5" : colorScale(filteredData[0].total_cases / 30);
      d3.select(this).transition().duration(100).attr("fill", d => colorScale(coviddata.find(b => b.Entity === d.properties.name)?.total_cases || 0))
      d3.select(".tooltip").style("display", "none");
    });

};

drawChart();
