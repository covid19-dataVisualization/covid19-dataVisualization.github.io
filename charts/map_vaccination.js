
const drawChart = async () => {
  const width = 1000;
  const height = 550;
  const margin = { top: 15, right: 100, bottom: 60, left: 100 };
    
    const geojson = await d3.json("../../data/geojson.json");
    const coviddatafile = await d3.json("../../data/covid-updated-data.json");
    const countrytocontinent = await d3.json("../../data/countrytocontinent.json");
    const coviddata = coviddatafile['data']
    const colorScale = d3.scaleLinear()
    .domain(d3.extent(coviddata, d => d.total_vaccinations / 35))
    .range(["#D7F4F8", "#1637A9"]);
  
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
      .data(["all", "top10vaccine"])
      .enter()
      .append("option")
      .attr("value", d => d)
      .text(d => d);
  
    const filteredList = coviddata.filter(obj => {
      // Check if any key matches the value
      return !Object.keys(obj).some(key => key === "location" && dataremoved.includes(obj[key]));
    });
  
    // filteredData = filteredList.sort((a, b) => b.total_deaths - a.total_deaths).slice(0, 10);
    // filteredData = filteredList.sort((a, b) => b.total_cases - a.total_cases).slice(0, 10);
  
    deathFilter.on("change", () => {
      const selectedOption = deathFilter.property("value");
      if (selectedOption === "top10vaccine") {
        filteredData = filteredList.sort((a, b) => b.total_vaccinations - a.total_vaccinations).slice(0, 10);
        map.selectAll("path")
          // .data(geojson.features)
          // .attr("opacity", d => filteredData.find(country => d.properties.name.toLowerCase().includes(country.trim())) ? 1 : 0.2);
          .attr("opacity", d => filteredData.find(b => b.location === d.properties.name) ? 1 : 0.2);
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
      .attr("fill", d => {
        const data = coviddata.find(b => b.location === d.properties.name);
        if (data && data.total_vaccinations != null) {
          return colorScale(data.total_vaccinations );
        } else {
          return "#fff";
        }
      })
      .style("cursor", "pointer")
      
      .style("stroke","#aaa")
      .style("background-color","#fff")
      
      .on("click", (a, b) => {
        let currentCountry = b.properties.name;
        localStorage.setItem("CurrentCounty", currentCountry);
        window.open('vaccine_details.html', '_blank');
      })
      .on("mousemove", function (e, d) {
        d3.select(this).transition().duration(100).attr("fill", "#afedc0");
  
        let country = d.properties.name;
        let data = coviddata.find(function (d) {
          return d.location == country;
        });
        if (data) {
          
            let tooltip = d3
            .select(".tooltip")
            .transition()
            .duration(100)
            .style("opacity", 1)
            .style("display", "block");
            const formattedTotalCases = data.total_vaccinations ? data.total_vaccinations.toLocaleString() : "NULL";
          d3.select(".tooltip")
            .html(
             
              `<div>Country: ${data.location}</div> <br> <div>Total Vaccinations: ${formattedTotalCases}</div>`
            )
            .style("left", e.pageX + 20 + "px")
            .style("top", e.pageY + "px");   
          
        } 
        
      })
      .on("mouseout", function (e, d) {
        d3.select(this).transition().duration(100).attr("fill", d => {
          const filteredData = coviddata.filter(item => filterValue.some(country => item.location.toLowerCase().includes(country.trim())));
          const color = filteredData.length === 0 ? "#f0eee5" : colorScale(filteredData[0].total_vaccinations / 30);
          const data = coviddata.find(b => b.location === d.properties.name);
          if (data && data.total_vaccinations != null) {
            return colorScale(data.total_vaccinations );
          } else {
            return "#fff";
          }
        })
        d3.select(".tooltip").style("display", "none");

      });
      
    
    
  };
  
  drawChart();
  
  